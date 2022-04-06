import { BigNumber } from 'ethers';
import { useEffect, useRef, useState } from 'react';
import { Middleware, SWRHook } from 'swr';

const poolDataMiddleware: Middleware =
  (useSWRNext: SWRHook) => (key, fetcher, config) => {
    const swr = useSWRNext(key, fetcher, config);
    const dataRef = useRef<any>(null);
    const [poolDataLoading, setPoolDataLoading] = useState(true);
    const [poolData, setPoolData] = useState<any>();

    useEffect(() => {
      try {
        if (swr.data !== undefined) {
          dataRef.current = swr.data;
          const data: any = swr.data;
          const uniswapPoolData = data.data.data.data;

          setPoolData({
            totalValueLockedUSD: parseFloat(
              uniswapPoolData.daiPool.totalValueLockedUSD,
            ),
            totalValueLockedToken0: parseFloat(
              uniswapPoolData.daiPool.totalValueLockedToken0,
            ),
            totalValueLockedToken1: parseFloat(
              uniswapPoolData.daiPool.totalValueLockedToken1,
            ),
            poolDayData: uniswapPoolData.daiPool.poolDayData,
            latestPrice: parseFloat(
              uniswapPoolData.daiPool.poolDayData[0].token1Price,
            ),
            loading: true,
            error: false,
            ethPool: {
              liquidity: uniswapPoolData.ethPool.liquidity,
              totalValueLockedToken0: parseFloat(
                uniswapPoolData.ethPool.totalValueLockedToken0,
              ),
              totalValueLockedToken1: parseFloat(
                uniswapPoolData.ethPool.totalValueLockedToken1,
              ),
            },
            daiPool: {
              liquidity: uniswapPoolData.daiPool.liquidity,
              totalValueLockedToken0: parseFloat(
                uniswapPoolData.daiPool.totalValueLockedToken0,
              ),
              totalValueLockedToken1: parseFloat(
                uniswapPoolData.daiPool.totalValueLockedToken1,
              ),
            },
          });
        }
        setPoolDataLoading(false);
      } catch (error) {
        setPoolData({
          totalValueLockedUSD: 0,
          totalValueLockedToken0: 0,
          totalValueLockedToken1: 0,
          poolDayData: [],
          latestPrice: 0.103,
          loading: true,
          error: false,
          ethPool: {
            liquidity: BigNumber.from(0),
            totalValueLockedToken0: 0,
            totalValueLockedToken1: 0,
            stakedToken0: 0,
            stakedToken1: 0,
          },
          daiPool: {
            liquidity: BigNumber.from(0),
            totalValueLockedToken0: 0,
            totalValueLockedToken1: 0,
            stakedToken0: 0,
            stakedToken1: 0,
          },
        });
        setPoolDataLoading(false);
      }
    }, [swr.data]);

    const data = swr.data === undefined ? dataRef.current : poolData;

    return { ...swr, data, isValidating: poolDataLoading };
  };

export default poolDataMiddleware;
