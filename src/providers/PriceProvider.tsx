import { useEffect, useState } from 'react';
import { utils } from 'ethers';
import PriceContext, {
  initialPriceContext,
  PriceContextType,
} from 'src/contexts/PriceContext';
import Loading from 'src/components/Loading';
import ErrorPage from 'src/components/ErrorPage';
import Coingecko from 'src/clients/Coingecko';
import calcPriceFromSqrtPriceX96 from 'src/utiles/calcPriceFromSqrtPriceX96';
import CachedUniswapV3 from 'src/clients/CachedUniswapV3';

const PriceProvider: React.FC = (props) => {
  const [state, setState] = useState<PriceContextType>(initialPriceContext);

  const fetchPrices = async () => {
    try {
      const uniswapPoolData = (await CachedUniswapV3.getPoolData()).data.data.data.data;
      const priceData = await Coingecko.getPrices();

      setState({
        ...state,
        elfiPrice: parseFloat(
          uniswapPoolData.daiPool.poolDayData[
            uniswapPoolData.daiPool.poolDayData.length - 1
          ].token1Price,
        ),
        elPrice: priceData.data.elysia.usd,
        daiPrice: priceData.data.dai.usd,
        tetherPrice: priceData.data.tether.usd,
        ethPrice: priceData.data.ethereum.usd,
        elfiDaiPool: {
          price: calcPriceFromSqrtPriceX96(
            uniswapPoolData.daiPool.sqrtPrice,
          ),
          liquidity: parseFloat(
            utils.formatEther(uniswapPoolData.daiPool.liquidity),
          ),
        },
        elfiEthPool: {
          price: calcPriceFromSqrtPriceX96(
           uniswapPoolData.ethPool.sqrtPrice,
          ),
          liquidity: parseFloat(
            utils.formatEther(uniswapPoolData.ethPool.liquidity),
          ),
        },
        loading: false,
      });
    } catch (e) {
      console.log(e)
      Coingecko.getPrices()
        .then((priceData) => {
          setState({
            ...state,
            elfiPrice: 0.103,
            elPrice: priceData.data.elysia.usd,
            daiPrice: priceData.data.dai.usd,
            tetherPrice: priceData.data.tether.usd,
            ethPrice: priceData.data.ethereum.usd,
            elfiDaiPool: {
              liquidity: 0,
              price: 0,
            },
            elfiEthPool: {
              liquidity: 0,
              price: 0,
            },
            loading: false,
          });
        })
        .catch((e) => {
          // Coingecko Error
          setState({
            ...state,
            elfiPrice: 0.103,
            elPrice: 0,
            daiPrice: 0,
            tetherPrice: 0,
            ethPrice: 0,
            elfiDaiPool: {
              liquidity: 0,
              price: 0,
            },
            elfiEthPool: {
              liquidity: 0,
              price: 0,
            },
            loading: false,
          });
        });
    }
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  if (state.loading) return <Loading />;
  if (state.error) return <ErrorPage />;

  return (
    <PriceContext.Provider
      value={{
        ...state,
      }}>
      {props.children}
    </PriceContext.Provider>
  );
};

export default PriceProvider;
