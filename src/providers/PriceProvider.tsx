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
      const poolData = await UniswapV3.getPoolData();
      const nonZeroData = poolData.data.data.pool.token0.tokenDayData.filter((item) => parseFloat(item.priceUSD));

      console.log(nonZeroData)

      setState({
        ...state,
        elfiPrice: parseFloat(
          poolData.data.data.pool.token0.tokenDayData[poolData.data.data.pool.token0.tokenDayData.length - 1]?.priceUSD
        ) || nonZeroData.reduce((sum, item) => sum + parseFloat(item.priceUSD), 0) / nonZeroData.length,
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