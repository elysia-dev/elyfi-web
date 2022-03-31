import { fireEvent, render, screen } from '@testing-library/react';
import ConnectWalletModal from './ConnectWalletModal';

jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (str: string): string => str,
    };
  },
}));

describe('', () => {
  const onClose = jest.fn();
  const selectWalletModalVisible = jest.fn();
  test('wallet modal', () => {
    render(
      <ConnectWalletModal
        visible={true}
        onClose={onClose}
        selectWalletModalVisible={selectWalletModalVisible}
      />,
    );

    const walletModalBtn = screen.getByText('modal.connect_wallet.button');
    fireEvent.click(walletModalBtn);

    expect(selectWalletModalVisible).toHaveBeenCalledTimes(1);
    expect(selectWalletModalVisible).toHaveBeenCalledWith();
  });
  test('close modal', () => {
    const { container } = render(
      <ConnectWalletModal
        visible={true}
        onClose={onClose}
        selectWalletModalVisible={selectWalletModalVisible}
      />,
    );
    const closeBtn = container.querySelector('.close-button');
    if (closeBtn) fireEvent.click(closeBtn);

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledWith();
  });
});
