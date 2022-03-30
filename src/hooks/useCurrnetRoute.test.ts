import { renderHook } from '@testing-library/react-hooks';
import useCurrentRoute from './useCurrnetRoute';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: '/ko/deposit',
    hash: '',
    search: '',
    state: '',
  }),
}));
describe('useCurrentRoute hooks', () => {
  test('return deposit 0', () => {
    const { result } = renderHook(() => useCurrentRoute());

    expect(result.current).toEqual(0);
  });
});
