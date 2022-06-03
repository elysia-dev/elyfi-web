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
    elfiElPool: number;
  };
  aprLoading: boolean;
} => {
  const [uniswapV2Apr, setUniswapV2Apr] = useState({
    elfiEthPool: 0,
    elfiDaiPool: 0,
    elfiElPool: 0,
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

  const v2Aprs = useCallback(() => {
    try {
      if (!priceData || balances.balanceLoading || !v2PoolData || !v2LPPoolElfi)
        return;

      const ethUsdPerSecond =
        priceData.elfiPrice *
        parseFloat(utils.formatEther(v2PoolData.ethPoolData.rewardPerSecond));
      const daiUsdPerSecond =
        priceData.elfiPrice *
        parseFloat(utils.formatEther(v2PoolData.daiPoolData.rewardPerSecond));
      const elUsdPerSecond =
        priceData.elfiPrice *
        parseFloat(utils.formatEther(v2PoolData.elPoolData.rewardPerSecond));

      const stakedTokenElfiEthPrice =
        parseFloat(utils.formatEther(v2LPPoolElfi.ethElfiBalance)) *
          priceData.elfiPrice +
        parseFloat(utils.formatEther(balances.v2LPPoolEth)) *
          priceData.ethPrice;
      const stakedTokenElfiDaiPrice =
        parseFloat(utils.formatEther(v2LPPoolElfi.daiElfiBalance)) *
          priceData.elfiPrice +
        parseFloat(utils.formatEther(balances.v2LPPoolDai)) *
          priceData.daiPrice;
      const stakedTokenElfiElPrice =
        parseFloat(utils.formatEther(v2LPPoolElfi.elElfiBalance)) *
          priceData.elfiPrice +
        parseFloat(utils.formatEther(balances.v2LPPoolEl)) * priceData.elPrice;

      const ethPoolPerToken =
        stakedTokenElfiEthPrice /
        parseFloat(utils.formatEther(balances.ethTotalSupply));
      const daiPoolPerToken =
        stakedTokenElfiDaiPrice /
        parseFloat(utils.formatEther(balances.daiTotalSupply));
      const elPoolPerToken =
        stakedTokenElfiElPrice /
        parseFloat(utils.formatEther(balances.elTotalSupply));

      const ethTotalUSD =
        ethPoolPerToken *
        parseFloat(utils.formatEther(v2PoolData.ethPoolData.totalPrincipal));
      const daiTotalUSD =
        daiPoolPerToken *
        parseFloat(utils.formatEther(v2PoolData.daiPoolData.totalPrincipal));
      const elTotalUSD =
        elPoolPerToken *
        parseFloat(utils.formatEther(v2PoolData.elPoolData.totalPrincipal));

      const elfiEthAPR =
        (ethUsdPerSecond / ethTotalUSD) * (3600 * 24 * 365 * 100);
      const elfiDaiAPR =
        (daiUsdPerSecond / daiTotalUSD) * (3600 * 24 * 365 * 100);
      const elfiElAPR = (elUsdPerSecond / elTotalUSD) * (3600 * 24 * 365 * 100);

      console.log(typeof elfiEthAPR);
      setUniswapV2Apr({
        elfiDaiPool: elfiDaiAPR,
        elfiEthPool: elfiEthAPR,
        elfiElPool: elfiElAPR,
      });
      setAprLoading(false);
    } catch (error) {
      setAprLoading(false);
    }
  }, [balances, priceData, v2LPPoolElfi, v2PoolData]);

  useEffect(() => {
    v2Aprs();
  }, [balances, priceData, v2LPPoolElfi, v2PoolData]);

  return { uniswapV2Apr, aprLoading };
};

export default useUniswapV2Apr;
