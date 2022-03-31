import { renderHook } from '@testing-library/react-hooks';
import useSWR from 'swr';
import { act } from 'react-test-renderer';
import envs from 'src/core/envs';
import { poolDataFetcher } from 'src/clients/CachedUniswapV3';
import poolDataMiddleware from 'src/middleware/poolDataMiddleware';
import { pricesFetcher } from 'src/clients/Coingecko';
import priceMiddleware from 'src/middleware/priceMiddleware';
import usePricePerLiquidity from './usePricePerLiquidity';

jest.mock('react-responsive', () => {
  return {
    useMediaQuery: () => {
      return true;
    },
  };
});

describe('usePriceLiquidity hooks', () => {
  test('get pool data', async () => {
    const { result } = renderHook(() =>
      useSWR(envs.externalApiEndpoint.cachedUniswapV3URL, poolDataFetcher, {
        use: [poolDataMiddleware],
      }),
    );
    await act(async () => {
      await result.current.mutate();
    });
  });
  test('get price data', async () => {
    const { result } = renderHook(() =>
      useSWR(envs.externalApiEndpoint.coingackoURL, pricesFetcher, {
        use: [priceMiddleware],
      }),
    );
    await act(async () => {
      await result.current.mutate();
    });
  });

  test('return price per liquidity', async () => {
    const { result } = renderHook(() => usePricePerLiquidity());

    expect(result.current.pricePerDaiLiquidity).toBeDefined();
    expect(result.current.pricePerEthLiquidity).toBeDefined();
  });
});
