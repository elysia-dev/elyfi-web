import { StakingPool__factory } from '@elysia-dev/contract-typechain';
import { BigNumber, constants, providers } from 'ethers';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import PriceContext from 'src/contexts/PriceContext';
import Token from 'src/enums/Token';
import envs from 'src/core/envs';
import UniswapPoolContext from 'src/contexts/UniswapPoolContext';
import {
  DAIPerDayOnELFIStakingPool,
  ELFIPerDayOnELStakingPool,
} from 'src/core/data/stakings';
import calcAPR from 'src/core/utils/calcAPR';

// round 0, 1, 2, 3
const useStakingRoundData = (
  round: number,
  stakedToken: Token.EL | Token.ELFI,
  rewardToken: Token.ELFI | Token.DAI,
): {
  totalPrincipal: BigNumber;
  apr: BigNumber;
  loading: boolean;
} => {
  // Why?
  // ELFI 스테이킹풀의 경우 3 round부터 v2로 바뀜
  const stakingPool = useMemo(() => {
    return StakingPool__factory.connect(
      stakedToken === Token.EL
        ? envs.elStakingPoolAddress
        : round <= 1
        ? envs.elfyStakingPoolAddress
        : envs.elfyV2StakingPoolAddress,
      new providers.InfuraProvider(
        'mainnet',
        process.env.REACT_APP_INFURA_PROJECT_ID,
      ) as any,
    );
  }, [stakedToken, round]);

  const { latestPrice: elfiPrice } = useContext(UniswapPoolContext);
  const { elPrice } = useContext(PriceContext);

  const [state, setState] = useState({
    totalPrincipal: constants.Zero,
    apr: constants.Zero,
    loading: true,
  });

  const loadRound = useCallback(
    async (round: number) => {
      setState({
        ...state,
        loading: true,
      });

      // ELFI 스테이킹풀의 경우 3 round부터 v2로 바뀜
      let currentRound = round;
      if (round >= 2 && stakedToken === Token.ELFI) currentRound -= 2;

      try {
        const res = await stakingPool.getPoolData(currentRound);

        setState({
          totalPrincipal: res.totalPrincipal,
          apr: calcAPR(
            res.totalPrincipal,
            stakedToken === Token.EL ? elPrice : elfiPrice,
            rewardToken === Token.ELFI
              ? ELFIPerDayOnELStakingPool
              : DAIPerDayOnELFIStakingPool,
            rewardToken === Token.ELFI ? elfiPrice : 1,
          ),
          loading: false,
        });
      } catch {
        setState({
          totalPrincipal: constants.Zero,
          apr: calcAPR(
            constants.Zero,
            stakedToken === Token.EL ? elPrice : elfiPrice,
            rewardToken === Token.ELFI
              ? ELFIPerDayOnELStakingPool
              : DAIPerDayOnELFIStakingPool,
            rewardToken === Token.ELFI ? elfiPrice : 1,
          ),
          loading: false,
        });
      }
    },
    [stakingPool, elfiPrice, elPrice, round],
  );

  useEffect(() => {
    loadRound(round);
  }, [round, elfiPrice]);

  return {
    ...state,
  };
};

export default useStakingRoundData;
