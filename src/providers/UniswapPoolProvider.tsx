import { useEffect, useState } from 'react';

import UniswapV3 from 'src/clients/UniswapV3';
import Loading from 'src/components/Loading';
import ErrorPage from 'src/components/ErrorPage';
import UniswapPoolContext, {
  initialUniswapPoolContext,
  UniswapPoolContextType,
} from 'src/contexts/UniswapPoolContext';

const UniswapPoolProvider: React.FC = (props) => {
  const [state, setState] = useState<UniswapPoolContextType>(
    initialUniswapPoolContext,
  );

  useEffect(() => {
    UniswapV3.getPoolData()
      .then((res) => {
        setState({
          ...state,
          totalValueLockedUSD: parseFloat(
            res.data.data.daiPool.totalValueLockedUSD,
          ),
          totalValueLockedToken0: parseFloat(
            res.data.data.daiPool.totalValueLockedToken0,
          ),
          totalValueLockedToken1: parseFloat(
            res.data.data.daiPool.totalValueLockedToken1,
          ),
          poolDayData: res.data.data.daiPool.poolDayData,
          latestPrice: parseFloat(
            res.data.data.daiPool.poolDayData[
              res.data.data.daiPool.poolDayData.length - 1
            ].token1Price,
          ),
          ethPool: {
            liquidity: res.data.data.ethPool.liquidity,
            totalValueLockedToken0: parseFloat(res.data.data.ethPool.totalValueLockedToken0),
            totalValueLockedToken1: parseFloat(res.data.data.ethPool.totalValueLockedToken1),
            stakedToken0: res.data.data.stakedEthPositions
              .reduce((sum, cur) => sum + parseFloat(cur.depositedToken0), 0),
            stakedToken1: res.data.data.stakedEthPositions
              .reduce((sum, cur) => sum + parseFloat(cur.depositedToken1), 0),
          },
          daiPool: {
            liquidity: res.data.data.daiPool.liquidity,
            totalValueLockedToken0: parseFloat(res.data.data.daiPool.totalValueLockedToken0),
            totalValueLockedToken1: parseFloat(res.data.data.daiPool.totalValueLockedToken1),
            stakedToken0: res.data.data.stakedDaiPositions
              .reduce((sum, cur) => sum + parseFloat(cur.depositedToken0), 0),
            stakedToken1: res.data.data.stakedDaiPositions
              .reduce((sum, cur) => sum + parseFloat(cur.depositedToken1), 0),
          },
          loading: false,
        });
      })
      .catch((e) => {
        setState({
          ...state,
          loading: false,
          error: true,
        });
      });
  }, []);

  if (state.loading) return <Loading />;
  if (state.error) return <ErrorPage />;

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
