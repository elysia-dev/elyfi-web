import { useEffect, useState } from 'react';
import useSWR from 'swr';

import envs from 'src/core/envs';
import PriceContext, {
  initialPriceContext,
  PriceContextType,
} from 'src/contexts/PriceContext';
import { ICoinPriceResponse, pricesFetcher } from 'src/clients/Coingecko';

const PriceProvider: React.FC = (props) => {
  const [state, setState] = useState<PriceContextType>(initialPriceContext);
  const { data: priceData, error: coingeckoError } = useSWR(
    envs.externalApiEndpoint.coingackoURL,
    pricesFetcher,
  );

  const fetchPrices = async (
    priceData: ICoinPriceResponse,
  ) => {
    setState({
      ...state,
      elfiPrice: priceData.elyfi.usd,
      elPrice: priceData.elysia.usd,
      daiPrice: priceData.dai.usd,
      tetherPrice: priceData.tether.usd,
      ethPrice: priceData.ethereum.usd,
    });
  };

  useEffect(() => {
    try {
      if (coingeckoError) throw Error;
      if (priceData) {
        fetchPrices(priceData);
      }
    } catch (error) {
      if (coingeckoError) {
        setState({
          ...state,
          elfiPrice: 0,
          elPrice: 0,
          daiPrice: 0,
          tetherPrice: 0,
          ethPrice: 0,
        });
      }
    }
  }, [priceData, coingeckoError]);

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
