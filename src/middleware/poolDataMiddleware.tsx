import { BigNumber } from 'ethers';
import { useEffect, useRef, useState } from 'react';
import { UniswapPoolType } from 'src/clients/CachedUniswapV3';
import { Middleware, SWRHook } from 'swr';

const poolDataMiddleware: Middleware =
  (useSWRNext: SWRHook) => (key, fetcher, config) => {
    const swr = useSWRNext(key, fetcher, config);
    const dataRef = useRef<any>(null);
    const [reserveLoading, setReserveLoading] = useState(true);
    const [poolData, setPoolData] = useState<UniswapPoolType>({
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

    useEffect(() => {
      try {
        if (swr.data !== undefined) {
          dataRef.current = swr.data;
          const data: any = swr.data;
          const poolData = data.data.data;
          setPoolData({
            ...poolData,
            totalValueLockedUSD: parseFloat(
              poolData.daiPool.totalValueLockedUSD,
            ),
            totalValueLockedToken0: parseFloat(
              poolData.daiPool.totalValueLockedToken0,
            ),
            totalValueLockedToken1: parseFloat(
              poolData.daiPool.totalValueLockedToken1,
            ),
            poolDayData: poolData.data.data.daiPool.poolDayData,
            latestPrice: parseFloat(
              poolData.daiPool.poolDayData[0].token1Price,
            ),
            ethPool: {
              liquidity: poolData.ethPool.liquidity,
              totalValueLockedToken0: parseFloat(
                poolData.ethPool.totalValueLockedToken0,
              ),
              totalValueLockedToken1: parseFloat(
                poolData.ethPool.totalValueLockedToken1,
              ),
              stakedToken0: poolData.stakedEthPositions.reduce(
                (sum: any, cur: any) => sum + parseFloat(cur.depositedToken0),
                0,
              ),
              stakedToken1: poolData.stakedEthPositions.reduce(
                (sum: any, cur: any) => sum + parseFloat(cur.depositedToken1),
                0,
              ),
            },
            daiPool: {
              liquidity: poolData.daiPool.liquidity,
              totalValueLockedToken0: parseFloat(
                poolData.data.data.daiPool.totalValueLockedToken0,
              ),
              totalValueLockedToken1: parseFloat(
                poolData.daiPool.totalValueLockedToken1,
              ),
              stakedToken0: poolData.stakedDaiPositions.reduce(
                (sum: any, cur: any) => sum + parseFloat(cur.depositedToken0),
                0,
              ),
              stakedToken1: poolData.stakedDaiPositions.reduce(
                (sum: any, cur: any) => sum + parseFloat(cur.depositedToken1),
                0,
              ),
            },
          });
        }
        setReserveLoading(false);
      } catch (error) {
        setReserveLoading(false);
      }
    }, [swr.data]);

    const data = swr.data === undefined ? dataRef.current : poolData;

    return { ...swr, data, isValidating: reserveLoading };
  };

export default poolDataMiddleware;
