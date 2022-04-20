import useSWR from 'swr';
import envs from 'src/core/envs';
import { poolDataFetcher } from 'src/clients/CachedUniswapV3';
import poolDataMiddleware from 'src/middleware/poolDataMiddleware';
import {
  bscBalanceOfFetcher,
  daiPoolDataFetcher,
  daiTotalSupplyFetcher,
  elBalanceOfFetcher,
  elfiBalanceOfFetcher,
  elfiBscV2BalanceFetcher,
  elfiV2BalanceFetcher,
  ethPoolDataFetcher,
  ethTotalSupplyFetcher,
  v2EthLPPoolElfiFetcher,
  v2LDaiLPPoolElfiFetcher,
  v2LPPoolDaiFetcher,
  v2LPPoolEthFetcher,
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

  v1StakingBalance: BigNumber;
  v2StakingBalance: BigNumber;
  bscStakingBalance: BigNumber;
  elStakingBalance: BigNumber;
  v2EthLPPoolElfi: BigNumber;
  v2DaiLPPoolElfi: BigNumber;
  v2LPPoolDai: BigNumber;
  v2LPPoolEth: BigNumber;
  elfiV2Balance: BigNumber;
  elfiBscV2Balance: BigNumber;
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
    v1StakingBalance: constants.Zero,
    v2StakingBalance: constants.Zero,
    bscStakingBalance: constants.Zero,
    elStakingBalance: constants.Zero,
    v2EthLPPoolElfi: constants.Zero,
    v2DaiLPPoolElfi: constants.Zero,
    v2LPPoolDai: constants.Zero,
    v2LPPoolEth: constants.Zero,
    elfiV2Balance: constants.Zero,
    elfiBscV2Balance: constants.Zero,
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

  const { data: v1StakingBalance } = useSWR(
    [envs.staking.elfyStakingPoolAddress],
    {
      fetcher: elfiBalanceOfFetcher(),
    },
  );
  const { data: v2StakingBalance } = useSWR(
    [envs.staking.elfyV2StakingPoolAddress],
    {
      fetcher: elfiBalanceOfFetcher(),
    },
  );

  const { data: bscStakingBalance } = useSWR(
    [envs.staking.elfyBscStakingPoolAddress],
    {
      fetcher: bscBalanceOfFetcher(),
    },
  );

  const { data: elStakingBalance } = useSWR(
    [envs.staking.elStakingPoolAddress],
    {
      fetcher: elBalanceOfFetcher(),
    },
  );
  const { data: v2EthLPPoolElfi } = useSWR(
    [envs.lpStaking.ethElfiV2PoolAddress],
    {
      fetcher: v2EthLPPoolElfiFetcher(),
    },
  );
  const { data: v2DaiLPPoolElfi } = useSWR(
    [envs.lpStaking.daiElfiV2PoolAddress],
    {
      fetcher: v2LDaiLPPoolElfiFetcher(),
    },
  );
  const { data: v2LPPoolDai } = useSWR(
    [envs.lpStaking.daiElfiV2PoolAddress, 'v2LPPoolDai'],
    {
      fetcher: v2LPPoolDaiFetcher(),
    },
  );

  const { data: v2LPPoolEth } = useSWR(
    [envs.lpStaking.ethElfiV2PoolAddress, 'v2LPPoolEth'],
    {
      fetcher: v2LPPoolEthFetcher(),
    },
  );
  const { data: elfiV2Balance } = useSWR(['elfiV2Balance'], {
    fetcher: elfiV2BalanceFetcher(),
  });

  const { data: elfiBscV2Balance } = useSWR(['elfiBscV2Balance'], {
    fetcher: elfiBscV2BalanceFetcher(),
  });
  const { data: ethPoolData } = useSWR(['ethPoolData'], {
    fetcher: ethPoolDataFetcher(),
  });
  const { data: daiPoolData } = useSWR(['daiPoolData'], {
    fetcher: daiPoolDataFetcher(),
  });
  const { data: ethTotalSupply } = useSWR(['ethTotalSupply'], {
    fetcher: ethTotalSupplyFetcher(),
  });
  const { data: daiTotalSupply } = useSWR(['daiTotalSupply'], {
    fetcher: daiTotalSupplyFetcher(),
  });

  useEffect(() => {
    if (
      !poolData ||
      !v1StakingBalance ||
      !v2StakingBalance ||
      !bscStakingBalance ||
      !elStakingBalance ||
      !v2EthLPPoolElfi ||
      !v2DaiLPPoolElfi ||
      !v2LPPoolDai ||
      !v2LPPoolEth ||
      !elfiV2Balance ||
      !elfiBscV2Balance ||
      !ethPoolData ||
      !daiPoolData ||
      !ethTotalSupply ||
      !daiTotalSupply
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
      v1StakingBalance,
      v2StakingBalance,
      bscStakingBalance,
      elStakingBalance,
      v2EthLPPoolElfi,
      v2DaiLPPoolElfi,
      v2LPPoolDai,
      v2LPPoolEth,
      elfiV2Balance: elfiV2Balance.totalPrincipal,
      elfiBscV2Balance: elfiBscV2Balance.totalPrincipal,
      ethPoolTotalPrincipal: ethPoolData.totalPrincipal,
      daiPoolTotalPrincipal: daiPoolData.totalPrincipal,
      ethTotalSupply,
      daiTotalSupply,
      balanceLoading: false,
    });
  }, [
    poolData,
    v1StakingBalance,
    v2StakingBalance,
    bscStakingBalance,
    elStakingBalance,
    v2EthLPPoolElfi,
    v2DaiLPPoolElfi,
    v2LPPoolDai,
    v2LPPoolEth,
    elfiV2Balance,
    elfiBscV2Balance,
    ethPoolData,
    daiPoolData,
    ethTotalSupply,
    daiTotalSupply,
  ]);

  return state;
};

export default useTvlBalances;
