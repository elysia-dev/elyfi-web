import { useContext, useMemo } from 'react';
import PriceContext from 'src/contexts/PriceContext';
import { utils } from 'ethers';
import useSWR from 'swr';
import envs from 'src/core/envs';
import { poolDataFetcher } from 'src/clients/CachedUniswapV3';
import poolDataMiddleware from 'src/middleware/poolDataMiddleware';

const usePricePerLiquidity = (): {
  pricePerDaiLiquidity: number;
  pricePerEthLiquidity: number;
} => {
  const { elfiPrice, daiPrice, ethPrice } = useContext(PriceContext);
  const { data: poolData, isValidating: loading } = useSWR(
    envs.externalApiEndpoint.cachedUniswapV3URL,
    poolDataFetcher,
    {
      use: [poolDataMiddleware],
    },
  );

  const pricePerEthLiquidity = useMemo(() => {
    if (!poolData) return 0;
    return (
      (poolData.ethPool.totalValueLockedToken0 * elfiPrice +
        poolData.ethPool.totalValueLockedToken1 * ethPrice) /
      parseFloat(utils.formatEther(poolData.ethPool.liquidity))
    );
  }, [elfiPrice, ethPrice, poolData, loading]);

  const pricePerDaiLiquidity = useMemo(() => {
    if (!poolData) return 0;
    return (
      (poolData.daiPool.totalValueLockedToken0 * elfiPrice +
        poolData.daiPool.totalValueLockedToken1 * daiPrice) /
      parseFloat(utils.formatEther(poolData.daiPool.liquidity))
    );
  }, [elfiPrice, daiPrice, poolData]);

  return {
    pricePerEthLiquidity,
    pricePerDaiLiquidity,
  };
};

export default usePricePerLiquidity;
