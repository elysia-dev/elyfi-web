import { BigNumber } from 'ethers';
import { useEffect, useRef, useState } from 'react';
import { Middleware, SWRHook } from 'swr';

const priceMiddleware: Middleware =
  (useSWRNext: SWRHook) => (key, fetcher, config) => {
    const swr = useSWRNext(key, fetcher, config);
    const dataRef = useRef<any>(null);
    const [priceLoading, setPriceLoading] = useState(true);
    const [price, setPrice] = useState<any>();

    useEffect(() => {
      try {
        if (swr.error) throw Error('error');
        if (swr.data !== undefined) {
          dataRef.current = swr.data;
          const priceData: any = swr.data;
          console.log('price', priceData);
          setPrice({
            ...price,
            elfiPrice: priceData.elyfi.usd,
            elPrice: priceData.elysia.usd,
            daiPrice: priceData.dai.usd,
            tetherPrice: priceData.tether.usd,
            ethPrice: priceData.ethereum.usd,
          });
        }
        setPriceLoading(false);
      } catch (error) {
        setPrice({
          elfiPrice: 0,
          elPrice: 0,
          daiPrice: 0,
          tetherPrice: 0,
          ethPrice: 0,
        });
        setPriceLoading(false);
      }
    }, [swr.data, swr.error]);

    const data = swr.data === undefined ? dataRef.current : price;

    return { ...swr, data, isValidating: priceLoading };
  };

export default priceMiddleware;
