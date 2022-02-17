import { useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import useSWR from 'swr';

import envs from 'src/core/envs';
import UniswapPoolContext, {
  initialUniswapPoolContext,
  UniswapPoolContextType,
} from 'src/contexts/UniswapPoolContext';
import { ILpInfo, poolDataFetcher } from 'src/clients/CachedUniswapV3';

const UniswapPoolProvider: React.FC = (props) => {
  const [state, setState] = useState<UniswapPoolContextType>(
    initialUniswapPoolContext,
  );

  const { data: poolData, error: cachedUniswapError } = useSWR(
    envs.cachedUniswapV3URL,
    poolDataFetcher,
  );

  const setPoolData = (poolData: ILpInfo) => {
    const data = poolData.data.data.data;

    setState({
      ...state,
      totalValueLockedUSD: parseFloat(data.daiPool.totalValueLockedUSD),
      totalValueLockedToken0: parseFloat(data.daiPool.totalValueLockedToken0),
      totalValueLockedToken1: parseFloat(data.daiPool.totalValueLockedToken1),
      poolDayData: data.daiPool.poolDayData,
      latestPrice: parseFloat(data.daiPool.poolDayData[0].token1Price),
      ethPool: {
        liquidity: data.ethPool.liquidity,
        totalValueLockedToken0: parseFloat(data.ethPool.totalValueLockedToken0),
        totalValueLockedToken1: parseFloat(data.ethPool.totalValueLockedToken1),
        stakedToken0: data.stakedEthPositions.reduce(
          (sum, cur) => sum + parseFloat(cur.depositedToken0),
          0,
        ),
        stakedToken1: data.stakedEthPositions.reduce(
          (sum, cur) => sum + parseFloat(cur.depositedToken1),
          0,
        ),
      },
      daiPool: {
        liquidity: data.daiPool.liquidity,
        totalValueLockedToken0: parseFloat(data.daiPool.totalValueLockedToken0),
        totalValueLockedToken1: parseFloat(data.daiPool.totalValueLockedToken1),
        stakedToken0: data.stakedDaiPositions.reduce(
          (sum, cur) => sum + parseFloat(cur.depositedToken0),
          0,
        ),
        stakedToken1: data.stakedDaiPositions.reduce(
          (sum, cur) => sum + parseFloat(cur.depositedToken1),
          0,
        ),
      },
      loading: false,
    });
  };

  const poolDataError = () => {
    setState({
      ...state,
      totalValueLockedUSD: 0,
      totalValueLockedToken0: 0,
      totalValueLockedToken1: 0,
      poolDayData: [],
      latestPrice: 0.103,
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
      loading: false,
    });
  };

  useEffect(() => {
    try {
      if (cachedUniswapError) throw Error;
      if (poolData) {
        setPoolData(poolData);
      }
    } catch (error) {
      poolDataError();
    }
  }, [poolData, cachedUniswapError]);

  return (
    <UniswapPoolContext.Provider
      value={{
        ...state,
      }}>
      {props.children}
    </UniswapPoolContext.Provider>
  );
};

export default UniswapPoolProvider;
