import { renderHook } from '@testing-library/react-hooks/dom';
import envs from 'src/core/envs';
import React from 'react';
import useCurrentMoneypoolAddress from './useCurrnetMoneypoolAddress';

describe('useCurrentMoneyPoolAddress hooks', () => {
  test('return pool address', async () => {
    jest.spyOn(React, 'useContext').mockReturnValue({
      type: 'BSC',
    });
    const { result } = renderHook(() => useCurrentMoneypoolAddress());

    expect(result.current).toEqual(envs.moneyPool.bscMoneyPoolAddress);
  });
  test('return pool address', async () => {
    jest.spyOn(React, 'useContext').mockReturnValue({
      type: 'Ethereum',
    });
    const { result } = renderHook(() => useCurrentMoneypoolAddress());

    expect(result.current).toEqual(envs.moneyPool.moneyPoolAddress);
  });
});
