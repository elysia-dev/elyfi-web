import { fireEvent, render, screen } from '@testing-library/react';
import { useWeb3React } from '@web3-react/core';
import { fn } from 'moment';
// eslint-disable-next-line no-use-before-define
import React from 'react';
import AppColors from 'src/enums/AppColors';
import Wallet from './Wallet';

jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (str: string): string => str,
    };
  },
}));

describe('Wallet', () => {
  const setConnected = jest.fn();
  const setAccountModalVisible = jest.fn();
  const setSelectWalletModalVisible = jest.fn();
  const setNetworkChangeModalVisible = jest.fn();
  const setDisconnectModalVisible = jest.fn();
  const setENSName = jest.fn();
  const setEnsLoading = jest.fn();
  const setENSNameInAccountModal = jest.fn();
  const setEnsLoadingInAccountModal = jest.fn();
  const setHoverColor = jest.fn();

  beforeEach(() => {
    // React.useState = jest
    //   .fn()
    //   .mockImplementationOnce(() => [false, setConnected])
    //   .mockImplementationOnce(() => [false, setAccountModalVisible])
    //   .mockImplementationOnce(() => [false, setSelectWalletModalVisible])
    //   .mockImplementationOnce(() => [false, setNetworkChangeModalVisible])
    //   .mockImplementationOnce(() => [false, setDisconnectModalVisible])
    //   .mockImplementationOnce(() => [null, setENSName])
    //   .mockImplementationOnce(() => [true, setEnsLoading])
    //   .mockImplementationOnce(() => [true, setENSNameInAccountModal])
    //   .mockImplementationOnce(() => [true, setEnsLoadingInAccountModal])
    //   .mockImplementationOnce(() => [
    //     {
    //       metamask: AppColors.selectWalletBorderColor,
    //       walletconnect: AppColors.selectWalletBorderColor,
    //     },
    //     setHoverColor,
    //   ]);
  });

  test('selectWalletModal', () => {
    const { container } = render(<Wallet />);

    const button = container.querySelector('.navigation__wallet');

    if (button) fireEvent.click(button);

    // expect(setSelectWalletModalVisible).toHaveBeenCalledWith();
  });
});
