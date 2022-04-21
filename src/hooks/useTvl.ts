import { BigNumber, utils } from 'ethers';
import { formatUnits, formatEther } from 'ethers/lib/utils';
import { useMemo, useState } from 'react';
import useSWR from 'swr';
import envs from 'src/core/envs';
import { pricesFetcher } from 'src/clients/Coingecko';
import ReserveData from 'src/core/data/reserves';
import priceMiddleware from 'src/middleware/priceMiddleware';
import { v2LPPoolElfiFetcher } from 'src/clients/BalancesFetcher';
import useReserveData from './useReserveData';
import useTvlBalances from './useTvlBalances';

const useTvl = (): { value: number; loading: boolean } => {
  const { reserveState, loading: reserveLoading } = useReserveData();
  const [loading, setLoading] = useState(true);
  const state = useTvlBalances();

  const { data: priceData } = useSWR(
    envs.externalApiEndpoint.coingackoURL,
    pricesFetcher,
    {
      use: [priceMiddleware],
    },
  );

  const { data: v2LPPoolElfi } = useSWR(
    [envs.lpStaking.ethElfiV2PoolAddress, envs.lpStaking.daiElfiV2PoolAddress],
    {
      fetcher: v2LPPoolElfiFetcher(),
    },
  );

  const tvl = useMemo(() => {
    try {
      if (!priceData || reserveLoading || state.balanceLoading || !v2LPPoolElfi)
        return 0;

      const stakedTokenElfiEthPrice =
        parseFloat(utils.formatEther(v2LPPoolElfi[0])) * priceData.elfiPrice +
        parseFloat(utils.formatEther(state.v2LPPoolEth)) * priceData.ethPrice;
      const stakedTokenElfiDaiPrice =
        parseFloat(utils.formatEther(v2LPPoolElfi[1])) * priceData.elfiPrice +
        parseFloat(utils.formatEther(state.v2LPPoolDai)) * priceData.daiPrice;

      const ethPoolPerToken =
        stakedTokenElfiEthPrice /
        parseFloat(utils.formatEther(state.ethTotalSupply));
      const daiPoolPerToken =
        stakedTokenElfiDaiPrice /
        parseFloat(utils.formatEther(state.daiTotalSupply));

      const ethTotalUSD =
        ethPoolPerToken *
        parseFloat(utils.formatEther(state.ethPoolTotalPrincipal));
      const daiTotalUSD =
        daiPoolPerToken *
        parseFloat(utils.formatEther(state.daiPoolTotalPrincipal));

      setLoading(false);
      return (
        reserveState.reserves.reduce((res, cur) => {
          const tokenInfo = ReserveData.find(
            (datum) => datum.address === cur.id,
          );
          return (
            res +
            parseFloat(
              formatUnits(
                BigNumber.from(reserveLoading ? 0 : cur?.totalDeposit || 0),
                tokenInfo?.decimals,
              ),
            )
          );
        }, 0) +
        state.ethPool.totalValueLockedToken0 * priceData.elfiPrice +
        state.ethPool.totalValueLockedToken1 * priceData.ethPrice +
        state.daiPool.totalValueLockedToken0 * priceData.elfiPrice +
        state.daiPool.totalValueLockedToken1 * priceData.daiPrice +
        parseInt(formatEther(state.stakingBalance), 10) * priceData.elfiPrice +
        parseInt(formatEther(state.v2LPPoolEth), 10) * priceData.ethPrice +
        parseInt(formatEther(state.v2LPPoolDai), 10) * priceData.daiPrice +
        ethTotalUSD +
        daiTotalUSD
      );
    } catch (e) {
      console.log(e);
      setLoading(false);
      return 0;
    }
  }, [state, reserveState, reserveLoading]);

  return {
    value: tvl,
    loading,
  };
};

export default useTvl;
