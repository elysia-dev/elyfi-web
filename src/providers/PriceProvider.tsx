import { useEffect } from 'react';
import { useState } from 'react';
import PriceContext, { initialPriceContext, PriceContextType } from 'src/contexts/PriceContext';
import UniswapV3 from 'src/clients/UniswapV3';
import Loading from 'src/components/Loading';
import ErrorPage from 'src/components/ErrorPage';
import Coingecko from 'src/clients/Coingecko';

const PriceProvider: React.FC = (props) => {
  const [state, setState] = useState<PriceContextType>(initialPriceContext);

  const fetchPrices = async () => {
    try {
      setState({
        ...state,
        elfiPrice: parseFloat((
          await UniswapV3.getELFIPRice()).data.data.token.tokenDayData[0].priceUSD
        ),
        elPrice: (await Coingecko.getElPrice()).data.elysia.usd,
        loading: false,
      })
    } catch (e) {
      setState({
        ...state,
        loading: false,
        error: true,
      })
    }
  }

  useEffect(() => {
    fetchPrices();
  }, [])

  if (state.loading) return (<Loading />)
  if (state.error) return (<ErrorPage />)

  return (
    <PriceContext.Provider value={{
      ...state,
    }}>
      {props.children}
    </PriceContext.Provider>
  );
}

export default PriceProvider;