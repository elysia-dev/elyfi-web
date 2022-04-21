import { StakingPool__factory } from '@elysia-dev/contract-typechain';
import { BigNumber, constants, providers } from 'ethers';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';

import envs from 'src/core/envs';
import Token from 'src/enums/Token';
import {
  DAIPerDayOnELFIStakingPool,
  ELFIPerDayOnELStakingPool,
} from 'src/core/data/stakings';
import calcAPR from 'src/core/utils/calcAPR';
import MainnetContext from 'src/contexts/MainnetContext';
import { poolAddress } from 'src/utiles/stakingPoolAddress';
import { rewardPerDayByToken } from 'src/utiles/stakingReward';
import MainnetType from 'src/enums/MainnetType';
import { pricesFetcher } from 'src/clients/Coingecko';
import priceMiddleware from 'src/middleware/priceMiddleware';

// round 0, 1, 2, 3
const useStakingRoundData = (
  round: number,
  stakedToken: string,
  rewardToken: Token.ELFI | Token.DAI | Token.BUSD,
): {
  totalPrincipal: BigNumber;
  apr: BigNumber;
  loading: boolean;
} => {
  // Why?
  // ELFI 스테이킹풀의 경우 3 round부터 v2로 바뀜

  const { type: mainnet } = useContext(MainnetContext);
  const stakingPool = useMemo(() => {
    return StakingPool__factory.connect(
      stakedToken === Token.ELFI && round > 1
        ? envs.staking.elfyV2StakingPoolAddress
        : poolAddress(mainnet, stakedToken),
      new providers.JsonRpcProvider(
        mainnet === MainnetType.BSC
          ? envs.jsonRpcUrl.bsc
          : process.env.REACT_APP_JSON_RPC,
      ) as any,
    );
  }, [stakedToken, round, mainnet]);

  const { data: priceData } = useSWR(
    envs.externalApiEndpoint.coingackoURL,
    pricesFetcher,
    {
      use: [priceMiddleware],
    },
  );

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
      if (!priceData) return;
      // ELFI 스테이킹풀의 경우 3 round부터 v2로 바뀜
      let currentRound = round;
      if (round >= 2 && stakedToken === Token.ELFI && mainnet === 'Ethereum')
        currentRound -= 2;
      try {
        const res = await stakingPool.getPoolData(
          (currentRound + 1).toString(),
        );
        setState({
          totalPrincipal: res.totalPrincipal,
          apr: calcAPR(
            res.totalPrincipal,
            stakedToken === Token.EL ? priceData.elPrice : priceData.elfiPrice,
            rewardPerDayByToken(stakedToken, mainnet),
            rewardToken === Token.ELFI ? priceData.elfiPrice : 1,
          ),
          loading: false,
        });
      } catch {
        setState({
          totalPrincipal: constants.Zero,
          apr: calcAPR(
            constants.Zero,
            stakedToken === Token.EL ? priceData.elPrice : priceData.elfiPrice,
            rewardToken === Token.ELFI
              ? ELFIPerDayOnELStakingPool
              : DAIPerDayOnELFIStakingPool,
            rewardToken === Token.ELFI ? priceData.elfiPrice : 1,
          ),
          loading: false,
        });
      }
    },
    [stakingPool, priceData, round, mainnet],
  );

  useEffect(() => {
    if (
      (stakedToken === Token.ELFI &&
        mainnet === MainnetType.Ethereum &&
        round === 0) ||
      (mainnet === MainnetType.BSC &&
        stakingPool.address === envs.staking.elfyV2StakingPoolAddress)
    )
      return;
    loadRound(round);
  }, [round, priceData, mainnet, stakingPool]);

  return {
    ...state,
  };
};

export default useStakingRoundData;
