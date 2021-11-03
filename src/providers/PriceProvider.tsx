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

      setState({
        ...state,
        elfiPrice: parseFloat(
          daiPoolData.data.data.pool.poolDayData[
            daiPoolData.data.data.pool.poolDayData.length - 1
          ].token1Price,
        ),
        elPrice: (await Coingecko.getElPrice()).data.elysia.usd,
        daiPrice: (await Coingecko.getDaiPrice()).data.dai.usd,
        tetherPrice: (await Coingecko.getTetherPrice()).data.tether.usd,
        ethPrice: (await Coingecko.getEthPrice()).data.ethereum.usd,
        elfiDaiPool: {
          price: calcPriceFromSqrtPriceX96(daiPoolData.data.data.pool.sqrtPrice),
          liquidity: parseFloat(utils.formatEther(daiPoolData.data.data.pool.liquidity)),
        },
        elfiEthPool: {
          price: calcPriceFromSqrtPriceX96(ethPoolData.data.data.pool.sqrtPrice),
          liquidity: parseFloat(utils.formatEther(ethPoolData.data.data.pool.liquidity)),
        },
        loading: false,
      });
    } catch (e) {
      setState({
        ...state,
        loading: false,
        error: true,
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
