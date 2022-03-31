import { renderHook } from '@testing-library/react-hooks';
import envs from 'src/core/envs';
import useSWR from 'swr';
import { poolDataFetcher } from 'src/clients/CachedUniswapV3';
import poolDataMiddleware from 'src/middleware/poolDataMiddleware';
import { act } from 'react-test-renderer';
import { pricesFetcher } from 'src/clients/Coingecko';
import priceMiddleware from 'src/middleware/priceMiddleware';
import useTvl from './useTvl';

describe('useTvl', () => {
  test('get pool data', async () => {
    const { result } = renderHook(() =>
      useSWR(envs.externalApiEndpoint.cachedUniswapV3URL, poolDataFetcher, {
        use: [poolDataMiddleware],
      }),
    );
    await act(async () => {
      await result.current.mutate();
    });
    expect(result.current.data).toBeDefined();
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
    expect(result.current.data).toBeDefined();
  });

  test('return tvl', () => {
    const { result } = renderHook(() => useTvl());

    expect(result.current.value).toBeGreaterThan(0);
  });
});
