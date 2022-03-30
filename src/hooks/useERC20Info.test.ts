import { renderHook } from '@testing-library/react-hooks';
import { constants } from 'ethers';
import { act } from 'react-test-renderer';
import useERC20 from './useERC20';
import useERC20Info from './useERC20Info';

const account = '0xB0B02B984083dFF47A6CFD86Bc7E6DbeA2005dab';

jest.mock('@web3-react/core', () => {
  return {
    useWeb3React: () => ({
      account,
    }),
  };
});

describe('useERC20Info hooks', () => {
  test('get balance', async () => {
    let balance: any;
    const { result } = renderHook(() =>
      useERC20('0x4da34f8264cb33a5c9f17081b9ef5ff6091116f4'),
    );

    await act(async () => {
      balance = await result.current.balanceOf(account);
    });
    expect(balance).toBeDefined();
  });

  test('get allowance', async () => {
    let allowance: any;
    const { result } = renderHook(() =>
      useERC20('0x4da34f8264cb33a5c9f17081b9ef5ff6091116f4'),
    );

    await act(async () => {
      allowance = await result.current.allowance(
        account,
        '0xCD668B44C7Cf3B63722D5cE5F655De68dD8f2750',
      );
    });
    expect(allowance).toBeDefined();
  });

  test('return state', async () => {
    const { result } = renderHook(() =>
      useERC20Info(
        '0x4da34f8264cb33a5c9f17081b9ef5ff6091116f4',
        '0xCD668B44C7Cf3B63722D5cE5F655De68dD8f2750',
        true,
      ),
    );

    await act(async () => {
      await result.current.contract.allowance(
        account,
        '0xCD668B44C7Cf3B63722D5cE5F655De68dD8f2750',
      );
    });

    await act(async () => {
      await result.current.contract.balanceOf(account);
    });

    expect(result.current.balance).toBeDefined();
    expect(result.current.allowance).toBeDefined();
    expect(result.current.loading).toEqual(false);
  });
});
