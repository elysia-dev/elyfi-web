import { useEffect, useState } from 'react';
import { utils } from 'ethers';
import PriceContext, {
  initialPriceContext,
  PriceContextType,
} from 'src/contexts/PriceContext';
import UniswapV3 from 'src/clients/UniswapV3';
import Loading from 'src/components/Loading';
import ErrorPage from 'src/components/ErrorPage';
import Coingecko from 'src/clients/Coingecko';
import calcPriceFromSqrtPriceX96 from 'src/utiles/calcPriceFromSqrtPriceX96';

const PriceProvider: React.FC = (props) => {
  const [state, setState] = useState<PriceContextType>(initialPriceContext);

  const fetchPrices = async () => {
    try {
      const ethPoolData = await UniswapV3.getElfiEthPoolData();
      const daiPoolData = await UniswapV3.getElfiDaiPoolData();

      const priceData = await Coingecko.getPrices();

      setState({
        ...state,
        elfiPrice: parseFloat(
          daiPoolData.data.data.pool.poolDayData[
            daiPoolData.data.data.pool.poolDayData.length - 1
          ].token1Price,
        ),
        elPrice: priceData.data.elysia.usd,
        daiPrice: priceData.data.dai.usd,
        tetherPrice: priceData.data.tether.usd,
        ethPrice: priceData.data.ethereum.usd,
        elfiDaiPool: {
          price: calcPriceFromSqrtPriceX96(
            daiPoolData.data.data.pool.sqrtPrice,
          ),
          liquidity: parseFloat(
            utils.formatEther(daiPoolData.data.data.pool.liquidity),
          ),
        },
        elfiEthPool: {
          price: calcPriceFromSqrtPriceX96(
            ethPoolData.data.data.pool.sqrtPrice,
          ),
          liquidity: parseFloat(
            utils.formatEther(ethPoolData.data.data.pool.liquidity),
          ),
        },
        loading: false,
      });
    } catch (e) {
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
