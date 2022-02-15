import { useEffect, useState } from 'react';
import Loading from 'src/components/Loading';
import ErrorPage from 'src/components/ErrorPage';
import UniswapPoolContext, {
  initialUniswapPoolContext,
  UniswapPoolContextType,
} from 'src/contexts/UniswapPoolContext';
import { BigNumber } from 'ethers';
import CachedUniswapV3 from 'src/clients/CachedUniswapV3';

const UniswapPoolProvider: React.FC = (props) => {
  const [state, setState] = useState<UniswapPoolContextType>(
    initialUniswapPoolContext,
  );

  useEffect(() => {
    CachedUniswapV3.getPoolData()
      .then((res) => {
        const data = res.data.data.data.data;
        setState({
          ...state,
          totalValueLockedUSD: parseFloat(data.daiPool.totalValueLockedUSD),
          totalValueLockedToken0: parseFloat(
            data.daiPool.totalValueLockedToken0,
          ),
          totalValueLockedToken1: parseFloat(
            data.daiPool.totalValueLockedToken1,
          ),
          poolDayData: data.daiPool.poolDayData,
          latestPrice: parseFloat(data.daiPool.poolDayData[0].token1Price),
          ethPool: {
            liquidity: data.ethPool.liquidity,
            totalValueLockedToken0: parseFloat(
              data.ethPool.totalValueLockedToken0,
            ),
            totalValueLockedToken1: parseFloat(
              data.ethPool.totalValueLockedToken1,
            ),
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
            totalValueLockedToken0: parseFloat(
              data.daiPool.totalValueLockedToken0,
            ),
            totalValueLockedToken1: parseFloat(
              data.daiPool.totalValueLockedToken1,
            ),
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
      })
      .catch((e) => {
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
      });
  }, []);

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
