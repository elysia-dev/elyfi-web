import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react-test-renderer';
import useERC20 from './useERC20';

jest.mock('@web3-react/core', () => {
  return {
    useWeb3React: () => {
      return {
        chainId: 97,
      };
    },
  };
});

describe('useERC20 hooks', () => {
  test('return address', async () => {
    let provider: any;
    const { result } = renderHook(() =>
      useERC20('0xA1Dd9cDb09871e7dC0E050E7aE18BA385D192C75'),
    );
    await act(async () => {
      provider = await result.current.provider.getNetwork();
    });

    expect(result.current.address).toEqual(
      '0xA1Dd9cDb09871e7dC0E050E7aE18BA385D192C75',
    );
    expect(provider.chainId).toEqual(97);
  });
});
