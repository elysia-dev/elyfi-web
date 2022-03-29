import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react-test-renderer';
import {
  bscReserveDataFetcher,
  ethReserveDataFetcher,
} from 'src/clients/ReserveSubgraph';
import {
  bscReserveMiddleware,
  ethReserveMiddleware,
} from 'src/middleware/reservesMiddleware';
import useSWR from 'swr';
import useReserveData from './useReserveData';

let bscReserveData: any;
let ethReserveData: any;

describe('useReserveData hooks', () => {
  test('bscReserveData useSWR', async () => {
    bscReserveData = renderHook(() =>
      useSWR('bscReserveData', bscReserveDataFetcher, {
        use: [bscReserveMiddleware],
      }),
    );
    await act(async () => {
      await bscReserveData.result.current.mutate();
    });
    expect(bscReserveData.result.current.data).toBeDefined();
    expect(bscReserveData.result.current.data![0].id).toEqual(
      '0xc93b97b01455454fba11b806ea645d021212c4c9',
    );
  });

  test('ethReserveData useSWR', async () => {
    ethReserveData = renderHook(() =>
      useSWR('ethReserveData', ethReserveDataFetcher, {
        use: [ethReserveMiddleware],
      }),
    );
    await act(async () => {
      await ethReserveData.result.current.mutate();
    });
    expect(ethReserveData.result.current.data).toBeDefined();
    expect(ethReserveData.result.current.data![0].id).toEqual(
      '0x6b175474e89094c44da98b954eedeac495271d0f',
    );
    expect(ethReserveData.result.current.data![1].id).toEqual(
      '0xdac17f958d2ee523a2206206994597c13d831ec7',
    );
  });

  test('return reserves state', async () => {
    const { result } = renderHook(() => useReserveData());

    console.log(result.current.reserveState.reserves);
    expect(result.current.reserveState.reserves).toEqual([
      ...bscReserveData.result.current.data,
      ...ethReserveData.result.current.data,
    ]);
  });
});
