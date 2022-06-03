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
  v2LPPoolEl: BigNumber;
  ethPoolTotalPrincipal: BigNumber;
  daiPoolTotalPrincipal: BigNumber;
  ethTotalSupply: BigNumber;
  daiTotalSupply: BigNumber;
  elTotalSupply: BigNumber;
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
    v2LPPoolEl: constants.Zero,
    ethPoolTotalPrincipal: constants.Zero,
    daiPoolTotalPrincipal: constants.Zero,
    ethTotalSupply: constants.Zero,
    daiTotalSupply: constants.Zero,
    elTotalSupply: constants.Zero,
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
      {
        elfiV1PoolAddress: envs.staking.elfyStakingPoolAddress,
        elfiV2PoolAddress: envs.staking.elfyV2StakingPoolAddress,
        bscPoolAddress: envs.staking.elfyBscStakingPoolAddress,
      },
    ],
    {
      fetcher: elfiBalanceOfFetcher(),
    },
  );

  const { data: v2LPPoolElfi } = useSWR(
    [
      {
        ethElfiAddress: envs.lpStaking.ethElfiV2PoolAddress,
        daiElfiAddress: envs.lpStaking.daiElfiV2PoolAddress,
        elElfiAddress: envs.lpStaking.elElfiV2PoolAddress,
      },
    ],
    {
      fetcher: v2LPPoolElfiFetcher(),
    },
  );

  const { data: v2LPPoolTokens } = useSWR(
    [
      {
        ethElfiAddress: envs.lpStaking.ethElfiV2PoolAddress,
        daiElfiAddress: envs.lpStaking.daiElfiV2PoolAddress,
        elElfiAddress: envs.lpStaking.elElfiV2PoolAddress,
      },
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
      stakingBalance: stakingBalance.elfiV1Balance
        .add(stakingBalance.elfiV2Balance)
        .add(stakingBalance.bscBalance)
        .add(v2LPPoolElfi.ethElfiBalance)
        .add(v2LPPoolElfi.daiElfiBalance)
        .add(v2LPPoolElfi.elElfiBalance)
        .add(
          elfiV2Balance[0].status === 'rejected'
            ? constants.Zero
            : elfiV2Balance[0].value.totalPrincipal,
        )
        .add(
          elfiV2Balance[1].status === 'rejected'
            ? constants.Zero
            : elfiV2Balance[1].value.totalPrincipal,
        ),
      v2LPPoolDai: v2LPPoolTokens.daiTokenBalance,
      v2LPPoolEth: v2LPPoolTokens.ethTokenBalance,
      v2LPPoolEl: v2LPPoolTokens.elTokenBalance,
      ethPoolTotalPrincipal: v2PoolData.ethPoolData.totalPrincipal,
      daiPoolTotalPrincipal: v2PoolData.daiPoolData.totalPrincipal,
      ethTotalSupply: v2PoolData.ethTotalSupply,
      daiTotalSupply: v2PoolData.daiTotalSupply,
      elTotalSupply: v2PoolData.elTotalSupply,
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
