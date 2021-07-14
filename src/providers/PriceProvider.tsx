import { useEffect } from 'react';
import { useState } from 'react';
import PriceContext, { initialPriceContext, PriceContextType } from 'src/contexts/PriceContext';
import UniswapV3 from 'src/clients/UniswapV3';
import Loading from 'src/components/Loading';
import ErrorPage from 'src/components/ErrorPage';

const PriceProvider: React.FC = (props) => {
  const [state, setState] = useState<PriceContextType>(initialPriceContext);

  useEffect(() => {
    UniswapV3.getELFIPRice().then((res) => {
      setState({
        ...state,
        elfiPrice: parseFloat(res.data.data.token.tokenDayData[0].priceUSD),
        loading: false,
      })
    }).catch(() => {
      setState({
        ...state,
        loading: false,
        error: true,
      })
    })
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