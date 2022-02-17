import { useEffect, useState } from 'react';
import { utils } from 'ethers';
import useSWR from 'swr';

import envs from 'src/core/envs';
import PriceContext, {
  initialPriceContext,
  PriceContextType,
} from 'src/contexts/PriceContext';
import { ICoinPriceResponse, pricesFetcher } from 'src/clients/Coingecko';
import calcPriceFromSqrtPriceX96 from 'src/utiles/calcPriceFromSqrtPriceX96';
import { ILpInfo, poolDataFetcher } from 'src/clients/CachedUniswapV3';

const PriceProvider: React.FC = (props) => {
  const [state, setState] = useState<PriceContextType>(initialPriceContext);

  const { data: poolData, error: cachedUniswapError } = useSWR(
    envs.cachedUniswapV3URL,
    poolDataFetcher,
  );
  const { data: priceData, error: coingeckoError } = useSWR(
    envs.coingackoURL,
    pricesFetcher,
  );

  const fetchPrices = async (
    poolData: ILpInfo,
    priceData: ICoinPriceResponse,
  ) => {
    const uniswapPoolData = poolData?.data.data.data;

    setState({
      ...state,
      elfiPrice: parseFloat(uniswapPoolData.daiPool.poolDayData[0].token1Price),
      elPrice: priceData.elysia.usd,
      daiPrice: priceData.dai.usd,
      tetherPrice: priceData.tether.usd,
      ethPrice: priceData.ethereum.usd,
      elfiDaiPool: {
        price: calcPriceFromSqrtPriceX96(uniswapPoolData.daiPool.sqrtPrice),
        liquidity: parseFloat(
          utils.formatEther(uniswapPoolData.daiPool.liquidity),
        ),
      },
      elfiEthPool: {
        price: calcPriceFromSqrtPriceX96(uniswapPoolData.ethPool.sqrtPrice),
        liquidity: parseFloat(
          utils.formatEther(uniswapPoolData.ethPool.liquidity),
        ),
      },
      loading: false,
    });
  };

  const bothError = () => {
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
  };

  const pricesDataError = (poolData: ILpInfo) => {
    const uniswapPoolData = poolData?.data.data.data;

    setState({
      ...state,
      elfiPrice: parseFloat(uniswapPoolData.daiPool.poolDayData[0].token1Price),
      elPrice: 0,
      daiPrice: 0,
      tetherPrice: 0,
      ethPrice: 0,
      elfiDaiPool: {
        price: calcPriceFromSqrtPriceX96(uniswapPoolData.daiPool.sqrtPrice),
        liquidity: parseFloat(
          utils.formatEther(uniswapPoolData.daiPool.liquidity),
        ),
      },
      elfiEthPool: {
        price: calcPriceFromSqrtPriceX96(uniswapPoolData.ethPool.sqrtPrice),
        liquidity: parseFloat(
          utils.formatEther(uniswapPoolData.ethPool.liquidity),
        ),
      },
      loading: false,
    });
  };

  const poolDataError = (priceData: ICoinPriceResponse) => {
    setState({
      ...state,
      elfiPrice: 0.103,
      elPrice: priceData.elysia.usd,
      daiPrice: priceData.dai.usd,
      tetherPrice: priceData.tether.usd,
      ethPrice: priceData.ethereum.usd,
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
  };

  useEffect(() => {
    try {
      if (cachedUniswapError || coingeckoError) throw Error;
      if (poolData && priceData) {
        fetchPrices(poolData, priceData);
      }
    } catch (error) {
      if (cachedUniswapError && priceData) {
        poolDataError(priceData);
        return;
      }
      if (coingeckoError && poolData) {
        pricesDataError(poolData);
        return;
      }
      bothError();
    }
  }, [poolData, priceData, cachedUniswapError, coingeckoError]);

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
