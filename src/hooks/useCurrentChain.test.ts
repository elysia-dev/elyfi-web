import { renderHook } from '@testing-library/react-hooks';
import * as web3 from '@web3-react/core';
import useCurrentChain from './useCurrentChain';

jest.mock('@web3-react/core', () => {
  return {
    useWeb3React: () => {
      return {
        chainId: 97,
      };
    },
  };
});
describe('useCurrentChain hooks', () => {
  test('return ethereum', () => {
    const { result } = renderHook(() => useCurrentChain());

    expect(result.current?.name).toEqual('Ethereum');
  });

  test('return bsc', () => {
    const { result } = renderHook(() => useCurrentChain());

    expect(result.current?.name).toEqual('BSC');
  });

  test('return ganache', () => {
    const { result } = renderHook(() => useCurrentChain());

    expect(result.current?.name).toEqual('Ganache');
  });
  test('return BSC Test', () => {
    const { result } = renderHook(() => useCurrentChain());

    expect(result.current?.name).toEqual('BSC Test');
  });
});
