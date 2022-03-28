import { renderHook } from '@testing-library/react-hooks';
import useBalances from './useBalances';

describe('useBalances hooks', () => {
  test('balances', () => {
    const { result } = renderHook(() => useBalances(() => {}));
    console.log(result.current);
  });
});
