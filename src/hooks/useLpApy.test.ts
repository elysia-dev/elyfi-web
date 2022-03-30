import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react-test-renderer';
import { pricesFetcher } from 'src/clients/Coingecko';
import envs from 'src/core/envs';
import priceMiddleware from 'src/middleware/priceMiddleware';
import useSWR from 'swr';
import useLpApy from './useLpApy';

describe('useLpApy', () => {
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

  test('return apr', () => {
    const { result } = renderHook(() => useLpApy());

    expect(result.current.calcDaiElfiPoolApr(245752.49)).toBeDefined();
    expect(result.current.calcDaiElfiPoolApr(280850.3)).toBeDefined();
  });
});
