import { StakingPoolV2, StakingPoolV2factory } from '@elysia-dev/elyfi-v1-sdk';
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
import { rewardPerDayByToken } from 'src/utiles/stakingReward';
import MainnetType from 'src/enums/MainnetType';
import { pricesFetcher } from 'src/clients/Coingecko';
import priceMiddleware from 'src/middleware/priceMiddleware';
import calcLpAPR from 'src/core/utils/calcLpAPR';
import { parseEther } from 'ethers/lib/utils';

const useStakingRoundDataV2 = (
  stakedToken: Token,
  rewardToken: Token.ELFI,
  stakingPool: StakingPoolV2,
): {
  totalPrincipal: BigNumber;
  apr: BigNumber;
  loading: boolean;
} => {
  const { type: mainnet } = useContext(MainnetContext);

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

  const loadRound = useCallback(async () => {
    setState({
      ...state,
      loading: true,
    });
    if (!priceData) return;
    try {
      const res = await stakingPool.getPoolData();

      setState({
        totalPrincipal: res.totalPrincipal,
        apr:
          stakedToken === Token.ELFI
            ? calcAPR(
                res.totalPrincipal,
                priceData.elfiPrice,
                res.rewardPerSecond.mul(3600 * 24),
                priceData.elfiPrice,
              )
            : calcLpAPR(
                res.rewardPerSecond.div(
                  parseEther(priceData.elfiPrice.toFixed(4)),
                ),
                res.totalPrincipal,
                priceData.elPrice,
                rewardPerDayByToken(stakedToken, mainnet),
                res.totalPrincipal.div(
                  parseEther(priceData.elfiPrice.toFixed(4)),
                ),
              ),
        loading: false,
      });
    } catch {
      setState({
        totalPrincipal: constants.Zero,
        apr: calcAPR(
          constants.Zero,
          stakedToken === Token.UNI ? priceData.elPrice : priceData.elfiPrice,
          rewardToken === Token.ELFI
            ? ELFIPerDayOnELStakingPool
            : DAIPerDayOnELFIStakingPool,
          rewardToken === Token.ELFI ? priceData.elfiPrice : 1,
        ),
        loading: false,
      });
    }
  }, [stakingPool, priceData, mainnet]);

  useEffect(() => {
    if (
      mainnet === MainnetType.BSC &&
      stakingPool.address === envs.staking.elfyV2StakingPoolAddress
    )
      return;
    loadRound();
  }, [priceData, mainnet, stakingPool]);

  return {
    ...state,
  };
};

export default useStakingRoundDataV2;
