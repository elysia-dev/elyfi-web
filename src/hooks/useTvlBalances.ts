import useSWR from 'swr';
import envs from 'src/core/envs';
import { poolDataFetcher } from 'src/clients/CachedUniswapV3';
import poolDataMiddleware from 'src/middleware/poolDataMiddleware';
import {
  elfiBalanceOfFetcher,
  elfiV2BalanceFetcher,
  v2LPPoolElfiFetcher,
  v2LPPoolTokensFetcher,
  v2PoolDataFetcher,
} from 'src/clients/BalancesFetcher';
import { useEffect, useState } from 'react';
import { BigNumber, constants } from 'ethers';

type BalanceType = {
  ethPool: {
    totalValueLockedToken0: number;
    totalValueLockedToken1: number;
  };
  daiPool: {
    totalValueLockedToken0: number;
    totalValueLockedToken1: number;
  };

  stakingBalance: BigNumber;
  v2LPPoolDai: BigNumber;
  v2LPPoolEth: BigNumber;
  ethPoolTotalPrincipal: BigNumber;
  daiPoolTotalPrincipal: BigNumber;
  ethTotalSupply: BigNumber;
  daiTotalSupply: BigNumber;
  balanceLoading: boolean;
};

const useTvlBalances = (): BalanceType => {
  const [state, setState] = useState({
    ethPool: {
      totalValueLockedToken0: 0,
      totalValueLockedToken1: 0,
    },
    daiPool: {
      totalValueLockedToken0: 0,
      totalValueLockedToken1: 0,
    },
    stakingBalance: constants.Zero,
    v2LPPoolDai: constants.Zero,
    v2LPPoolEth: constants.Zero,
    ethPoolTotalPrincipal: constants.Zero,
    daiPoolTotalPrincipal: constants.Zero,
    ethTotalSupply: constants.Zero,
    daiTotalSupply: constants.Zero,
    balanceLoading: true,
  });

  const { data: poolData } = useSWR(
    envs.externalApiEndpoint.cachedUniswapV3URL,
    poolDataFetcher,
    {
      use: [poolDataMiddleware],
    },
  );

  const { data: stakingBalance } = useSWR(
    [
      envs.staking.elfyStakingPoolAddress,
      envs.staking.elfyV2StakingPoolAddress,
      envs.staking.elfyBscStakingPoolAddress,
    ],
    {
      fetcher: elfiBalanceOfFetcher(),
    },
  );

  const { data: v2LPPoolElfi } = useSWR(
    [envs.lpStaking.ethElfiV2PoolAddress, envs.lpStaking.daiElfiV2PoolAddress],
    {
      fetcher: v2LPPoolElfiFetcher(),
    },
  );

  const { data: v2LPPoolTokens } = useSWR(
    [
      envs.lpStaking.daiElfiV2PoolAddress,
      envs.lpStaking.ethElfiV2PoolAddress,
      'v2LPPoolTokens',
    ],
    {
      fetcher: v2LPPoolTokensFetcher(),
    },
  );

  const { data: elfiV2Balance } = useSWR(['elfiV2Balance'], {
    fetcher: elfiV2BalanceFetcher(),
  });

  const { data: v2PoolData } = useSWR(['v2PoolData'], {
    fetcher: v2PoolDataFetcher(),
  });

  useEffect(() => {
    if (
      !poolData ||
      !stakingBalance ||
      !v2LPPoolElfi ||
      !v2LPPoolTokens ||
      !elfiV2Balance ||
      !v2PoolData
    )
      return;

    setState({
      ethPool: {
        totalValueLockedToken0: poolData.ethPool.totalValueLockedToken0,
        totalValueLockedToken1: poolData.ethPool.totalValueLockedToken1,
      },
      daiPool: {
        totalValueLockedToken0: poolData.daiPool.totalValueLockedToken0,
        totalValueLockedToken1: poolData.daiPool.totalValueLockedToken1,
      },
      stakingBalance: stakingBalance[0]
        .add(stakingBalance[1])
        .add(stakingBalance[2])
        .add(v2LPPoolElfi[0])
        .add(v2LPPoolElfi[1])
        .add(elfiV2Balance[0].totalPrincipal)
        .add(elfiV2Balance[1].totalPrincipal),
      v2LPPoolDai: v2LPPoolTokens[0],
      v2LPPoolEth: v2LPPoolTokens[1],
      ethPoolTotalPrincipal: v2PoolData[0].totalPrincipal,
      daiPoolTotalPrincipal: v2PoolData[1].totalPrincipal,
      ethTotalSupply: v2PoolData[2],
      daiTotalSupply: v2PoolData[3],
      balanceLoading: false,
    });
  }, [
    poolData,
    stakingBalance,
    v2LPPoolElfi,
    v2LPPoolTokens,
    elfiV2Balance,
    v2PoolData,
  ]);

  return state;
};

export default useTvlBalances;
