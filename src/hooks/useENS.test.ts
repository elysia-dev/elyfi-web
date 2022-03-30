import { renderHook } from '@testing-library/react-hooks';
import { providers } from 'ethers';
import { act } from 'react-test-renderer';
import { useENS } from './useENS';

const provider = new providers.JsonRpcProvider(process.env.REACT_APP_JSON_RPC);

const address = '0xB0B02B984083dFF47A6CFD86Bc7E6DbeA2005dab';

describe('', () => {
  test('', async () => {
    let ensName;
    const { result } = renderHook(() => useENS(address));

    // await act(async () => {
    //   ensName = await provider.lookupAddress(address);
    // });

    expect(result.current.ensName).toBeNull();
  });
});
