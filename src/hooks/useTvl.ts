import { BigNumber, constants, providers, utils } from 'ethers';
import { formatUnits, formatEther } from 'ethers/lib/utils';
import { useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';
import envs from 'src/core/envs';
import ReserveData from 'src/core/data/reserves';
import { poolDataFetcher } from 'src/clients/CachedUniswapV3';
import poolDataMiddleware from 'src/middleware/poolDataMiddleware';
import { pricesFetcher } from 'src/clients/Coingecko';
import priceMiddleware from 'src/middleware/priceMiddleware';
import {
  bscBalanceOfFetcher,
  elBalanceOfFetcher,
  elfiBalanceOfFetcher,
  v2EthLPPoolElfiFetcher,
  v2LDaiLPPoolElfiFetcher,
  v2LPPoolDaiFetcher,
  v2LPPoolEthFetcher,
} from 'src/clients/BalancesFetcher';
import useReserveData from './useReserveData';

const useTvl = (): { value: number; loading: boolean } => {
  const { reserveState, loading: reserveLoading } = useReserveData();
  const [loading, setLoading] = useState(true);
  const { data: poolData } = useSWR(
    envs.externalApiEndpoint.cachedUniswapV3URL,
    poolDataFetcher,
    {
      use: [poolDataMiddleware],
    },
  );
  const { data: priceData } = useSWR(
    envs.externalApiEndpoint.coingackoURL,
    pricesFetcher,
    {
      use: [priceMiddleware],
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
  const { data: v2LPPoolDai } = useSWR([envs.lpStaking.daiElfiV2PoolAddress], {
    fetcher: v2LPPoolDaiFetcher(),
  });
  const { data: v2LPPoolEth } = useSWR([envs.lpStaking.ethElfiV2PoolAddress], {
    fetcher: v2LPPoolEthFetcher(),
  });

  const [state, setState] = useState({
    v2LPPoolElfi: constants.Zero,
    v2LPPoolDai: constants.Zero,
    v2LPPoolEth: constants.Zero,
    stakedEl: constants.Zero,
    stakedElfi: constants.Zero,
    stakedElfiOnBSC: constants.Zero,
    loading: true,
  });

  const tvl = useMemo(() => {
    if (!poolData || !priceData || !reserveState) return 0;
    return (
      reserveState.reserves.reduce((res, cur) => {
        const tokenInfo = ReserveData.find((datum) => datum.address === cur.id);
        return (
          res +
          parseFloat(
            formatUnits(
              BigNumber.from(loading ? 0 : cur?.totalDeposit || 0),
              tokenInfo?.decimals,
            ),
          )
        );
      }, 0) +
      poolData.ethPool.totalValueLockedToken0 * priceData.elfiPrice +
      poolData.ethPool.totalValueLockedToken1 * priceData.ethPrice +
      poolData.daiPool.totalValueLockedToken0 * priceData.elfiPrice +
      poolData.daiPool.totalValueLockedToken1 * priceData.daiPrice +
      parseInt(formatEther(state.stakedEl), 10) * priceData.elPrice +
      parseInt(formatEther(state.stakedElfi), 10) * priceData.elfiPrice +
      parseInt(formatEther(state.stakedElfiOnBSC), 10) * priceData.elfiPrice +
      parseInt(formatEther(state.v2LPPoolElfi), 10) * priceData.elfiPrice +
      parseInt(formatEther(state.v2LPPoolEth), 10) * priceData.ethPrice +
      parseInt(formatEther(state.v2LPPoolDai), 10) * priceData.daiPrice
    );
  }, [state, priceData, loading, poolData, reserveState]);

  const loadBalances = async () => {
    try {
      setState({
        v2LPPoolElfi: v2DaiLPPoolElfi.add(v2EthLPPoolElfi),
        v2LPPoolDai,
        v2LPPoolEth,
        stakedEl: elStakingBalance,
        stakedElfi: v1StakingBalance.add(v2StakingBalance),
        stakedElfiOnBSC: bscStakingBalance,
        loading: false,
      });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (
      reserveLoading ||
      !elStakingBalance ||
      !v2StakingBalance ||
      !v1StakingBalance ||
      !bscStakingBalance ||
      !v2EthLPPoolElfi ||
      !v2DaiLPPoolElfi ||
      !v2LPPoolEth ||
      !v2LPPoolDai
    )
      return;
    loadBalances().then(() => {
      setLoading(false);
    });
  }, [
    reserveLoading,
    elStakingBalance,
    v2StakingBalance,
    v1StakingBalance,
    bscStakingBalance,
    v2EthLPPoolElfi,
    v2DaiLPPoolElfi,
    v2LPPoolEth,
    v2LPPoolDai,
  ]);

  return {
    value: tvl,
    loading: state.loading,
  };
};

export default useTvl;
