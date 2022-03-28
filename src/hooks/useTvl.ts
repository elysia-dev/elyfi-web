import { BigNumber, constants } from 'ethers';
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
  bscStakingFetcher,
  elfiStakingFetcher,
  elStakingFetcher,
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
      fetcher: elfiStakingFetcher(),
    },
  );
  const { data: v2StakingBalance } = useSWR(
    [envs.staking.elfyV2StakingPoolAddress],
    {
      fetcher: elfiStakingFetcher(),
    },
  );

  const { data: bscStakingBalance } = useSWR(
    [envs.staking.elfyBscStakingPoolAddress],
    {
      fetcher: bscStakingFetcher(),
    },
  );

  const { data: elStakingBalance } = useSWR(
    [envs.staking.elStakingPoolAddress],
    {
      fetcher: elStakingFetcher(),
    },
  );

  const [state, setState] = useState({
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
      parseInt(formatEther(state.stakedElfiOnBSC), 10) * priceData.elfiPrice
    );
  }, [state, priceData, loading, poolData, reserveState]);

  const loadBalances = async () => {
    try {
      setState({
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
      !bscStakingBalance
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
  ]);

  return {
    value: tvl,
    loading: state.loading,
  };
};

export default useTvl;
