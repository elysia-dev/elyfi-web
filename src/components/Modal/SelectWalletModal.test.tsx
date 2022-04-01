import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { AbstractConnector } from '@web3-react/abstract-connector';
import walletConnectConnector from 'src/utiles/walletConnectProvider';
import SelectWalletModal from './SelectWalletModal';

jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (str: string): string => str,
    };
  },
}));

const walletConnectProvider = walletConnectConnector();

jest.mock('@web3-react/core', () => ({
  useWeb3React: () => {
    return {
      activate: (
        connector: AbstractConnector,
        onError?: (error: Error) => void,
        throwErrors?: boolean,
      ) => Promise,
    };
  },
}));

describe('selectwalletModal', () => {
  test('connect walletconnect', () => {
    const onClose = jest.fn();
    render(
      <SelectWalletModal
        modalClose={onClose}
        selectWalletModalVisible={true}
      />,
    );

    const btn = screen.getByText('WalletConnect');
    fireEvent.click(btn);

    expect(onClose).toHaveBeenCalledTimes(0);
  });
});
