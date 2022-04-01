import { fireEvent, render, screen } from '@testing-library/react';
import { act } from 'react-test-renderer';
import MainnetProvider from 'src/providers/MainnetProvider';
import NetworkChangeModal from './NetworkChangeModal';

jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (str: string): string => str,
    };
  },
}));

describe('NetworkChangeModal', () => {
  test('bsc click', async () => {
    const onClose = jest.fn();

    const { container } = render(
      <MainnetProvider>
        <NetworkChangeModal visible={true} closeHandler={onClose} />
      </MainnetProvider>,
    );
    const networkBtn = screen.getByText('BSC');

    await act(async () => {
      fireEvent.click(networkBtn);
    });

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledWith();
  });

  test('ethereum click', async () => {
    const onClose = jest.fn();

    const { container } = render(
      <MainnetProvider>
        <NetworkChangeModal visible={true} closeHandler={onClose} />
      </MainnetProvider>,
    );
    const networkBtn = screen.getByText('Ethereum');

    await act(async () => {
      fireEvent.click(networkBtn);
    });

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledWith();
  });
});
