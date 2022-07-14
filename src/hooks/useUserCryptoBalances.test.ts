import { act, renderHook } from '@testing-library/react-hooks';
import { walletCryptoFetcher } from 'src/clients/BalancesFetcher';
import useSWR from 'swr';
import envs from 'src/core/envs';
import { result } from 'cypress/types/lodash';
import useUserCryptoBalances from './useUserCryptoBalances';

jest.setTimeout(30000);

jest.mock('@web3-react/core', () => {
  return {
    useWeb3React: () => {
      return { account: '0xB0B02B984083dFF47A6CFD86Bc7E6DbeA2005dab' };
    },
  };
});

describe('useUserCryptoBalances', () => {
  it('balance of useSWR', async () => {
    const { result } = renderHook(() =>
      useSWR(
        [
          {
            usdc: envs.token.usdcAddress,
            account: '0xB0B02B984083dFF47A6CFD86Bc7E6DbeA2005dab',
            key: 'asdasda',
          },
        ],
        {
          fetcher: walletCryptoFetcher(),
        },
      ),
    );

    await act(async () => {
      await result.current.mutate();
    });
    console.log(result.current.data);
  });

  it('balance', () => {
    renderHook(() => useUserCryptoBalances());
  });
});
