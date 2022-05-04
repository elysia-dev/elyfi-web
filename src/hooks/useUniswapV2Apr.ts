import envs from 'src/core/envs';
import { utils } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import { pricesFetcher } from 'src/clients/Coingecko';
import priceMiddleware from 'src/middleware/priceMiddleware';
import useSWR from 'swr';
import {
  v2LPPoolElfiFetcher,
  v2LPPoolTokensFetcher,
  v2PoolDataFetcher,
} from 'src/clients/BalancesFetcher';

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

  const { data: v2LPPoolTokens } = useSWR(
    [
      envs.lpStaking.ethElfiV2PoolAddress,
      envs.lpStaking.daiElfiV2PoolAddress,
      'v2LPPoolTokens',
    ],
    {
      fetcher: v2LPPoolTokensFetcher(),
    },
  );

  const v2Aprs = useCallback(() => {
    try {
      if (!priceData || !v2LPPoolTokens || !v2PoolData) return;

      const ethUsdPerSecond =
        priceData.elfiPrice *
        parseFloat(utils.formatEther(v2PoolData.v2EthPoolData.rewardPerSecond));
      const daiUsdPerSecond =
        priceData.elfiPrice *
        parseFloat(utils.formatEther(v2PoolData.v2DaiPoolData.rewardPerSecond));

      const stakedTokenElfiEthPrice =
        parseFloat(utils.formatEther(v2LPPoolElfi.ethPoolElfiBalance)) *
          priceData.elfiPrice +
        parseFloat(utils.formatEther(v2LPPoolTokens.ethPoolBalance)) *
          priceData.ethPrice;
      const stakedTokenElfiDaiPrice =
        parseFloat(utils.formatEther(v2LPPoolElfi.daiPoolElfiBalance)) *
          priceData.elfiPrice +
        parseFloat(utils.formatEther(v2LPPoolTokens.daiPoolBalance)) *
          priceData.daiPrice;

      const ethPoolPerToken =
        stakedTokenElfiEthPrice /
        parseFloat(utils.formatEther(v2PoolData.v2EthPoolTotalSupply));
      const daiPoolPerToken =
        stakedTokenElfiDaiPrice /
        parseFloat(utils.formatEther(v2PoolData.v2DaiPoolTotalSupply));

      const ethTotalUSD =
        ethPoolPerToken *
        parseFloat(utils.formatEther(v2PoolData.v2EthPoolData.totalPrincipal));
      const daiTotalUSD =
        daiPoolPerToken *
        parseFloat(utils.formatEther(v2PoolData.v2DaiPoolData.totalPrincipal));

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
  }, [v2LPPoolTokens, priceData, v2PoolData]);

  useEffect(() => {
    v2Aprs();
  }, [v2LPPoolTokens, priceData, v2PoolData]);

  return { uniswapV2Apr, aprLoading };
};

export default useUniswapV2Apr;
