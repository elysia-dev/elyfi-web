import envs from 'src/core/envs';
import { utils } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import { pricesFetcher } from 'src/clients/Coingecko';
import priceMiddleware from 'src/middleware/priceMiddleware';
import useSWR from 'swr';
import {
  v2LPPoolElfiFetcher,
  v2PoolDataFetcher,
} from 'src/clients/BalancesFetcher';
import useTvlBalances from './useTvlBalances';

const useUniswapV2Apr = (): {
  uniswapV2Apr: {
    elfiEthPool: number;
    elfiDaiPool: number;
  };
  aprLoading: boolean;
} => {
  const [uniswapV2Apr, setUniswapV2Apr] = useState({
    elfiEthPool: 0,
    elfiDaiPool: 0,
  });
  const [aprLoading, setAprLoading] = useState(true);
  const balances = useTvlBalances();

  const { data: priceData } = useSWR(
    envs.externalApiEndpoint.coingackoURL,
    pricesFetcher,
    {
      use: [priceMiddleware],
    },
  );

  const { data: v2PoolData } = useSWR(['v2PoolData'], {
    fetcher: v2PoolDataFetcher(),
  });

  const { data: v2LPPoolElfi } = useSWR(
    [envs.lpStaking.ethElfiV2PoolAddress, envs.lpStaking.daiElfiV2PoolAddress],
    {
      fetcher: v2LPPoolElfiFetcher(),
    },
  );

  const v2Aprs = useCallback(() => {
    try {
      if (!priceData || balances.balanceLoading || !v2PoolData) return;

      const ethUsdPerSecond =
        priceData.elfiPrice *
        parseFloat(utils.formatEther(v2PoolData[0].rewardPerSecond));
      const daiUsdPerSecond =
        priceData.elfiPrice *
        parseFloat(utils.formatEther(v2PoolData[1].rewardPerSecond));

      const stakedTokenElfiEthPrice =
        parseFloat(utils.formatEther(v2LPPoolElfi[0])) * priceData.elfiPrice +
        parseFloat(utils.formatEther(balances.v2LPPoolEth)) *
          priceData.ethPrice;
      const stakedTokenElfiDaiPrice =
        parseFloat(utils.formatEther(v2LPPoolElfi[1])) * priceData.elfiPrice +
        parseFloat(utils.formatEther(balances.v2LPPoolDai)) *
          priceData.daiPrice;

      const ethPoolPerToken =
        stakedTokenElfiEthPrice /
        parseFloat(utils.formatEther(balances.ethTotalSupply));
      const daiPoolPerToken =
        stakedTokenElfiDaiPrice /
        parseFloat(utils.formatEther(balances.daiTotalSupply));

      const ethTotalUSD =
        ethPoolPerToken *
        parseFloat(utils.formatEther(v2PoolData[0].totalPrincipal));
      const daiTotalUSD =
        daiPoolPerToken *
        parseFloat(utils.formatEther(v2PoolData[1].totalPrincipal));

      const elfiEthAPR =
        (ethUsdPerSecond / ethTotalUSD) * (3600 * 24 * 365 * 100);
      const elfiDaiAPR =
        (daiUsdPerSecond / daiTotalUSD) * (3600 * 24 * 365 * 100);

      setUniswapV2Apr({
        elfiDaiPool: elfiDaiAPR,
        elfiEthPool: elfiEthAPR,
      });
      setAprLoading(false);
    } catch (error) {
      setAprLoading(false);
    }
  }, [balances, priceData]);

  useEffect(() => {
    v2Aprs();
  }, [priceData, balances]);

  return { uniswapV2Apr, aprLoading };
};

export default useUniswapV2Apr;
