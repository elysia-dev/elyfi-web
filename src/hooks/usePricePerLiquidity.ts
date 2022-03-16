import { useContext, useMemo } from 'react';
import { utils } from 'ethers';
import useSWR from 'swr';
import envs from 'src/core/envs';
import { poolDataFetcher } from 'src/clients/CachedUniswapV3';
import poolDataMiddleware from 'src/middleware/poolDataMiddleware';
import { pricesFetcher } from 'src/clients/Coingecko';
import priceMiddleware from 'src/middleware/priceMiddleware';

const usePricePerLiquidity = (): {
  pricePerDaiLiquidity: number;
  pricePerEthLiquidity: number;
} => {
  const { data: poolData, isValidating: loading } = useSWR(
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

  const pricePerEthLiquidity = useMemo(() => {
    if (!poolData || !priceData) return 0;
    return (
      (poolData.ethPool.totalValueLockedToken0 * priceData.elfiPrice +
        poolData.ethPool.totalValueLockedToken1 * priceData.ethPrice) /
      parseFloat(utils.formatEther(poolData.ethPool.liquidity))
    );
  }, [priceData, poolData, loading]);

  const pricePerDaiLiquidity = useMemo(() => {
    if (!poolData || !priceData) return 0;
    return (
      (poolData.daiPool.totalValueLockedToken0 * priceData.elfiPrice +
        poolData.daiPool.totalValueLockedToken1 * priceData.daiPrice) /
      parseFloat(utils.formatEther(poolData.daiPool.liquidity))
    );
  }, [priceData, poolData]);

  return {
    pricePerEthLiquidity,
    pricePerDaiLiquidity,
  };
};

export default usePricePerLiquidity;
