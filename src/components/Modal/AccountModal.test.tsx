// eslint-disable-next-line no-use-before-define
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import AccountModal from './AccountModal';

jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (str: string): string => str,
    };
  },
}));

jest.mock('@web3-react/core', () => {
  return {
    useWeb3React: () => {
      return {
        deactivate: jest.fn(),
      };
    },
  };
});

describe('AccountModal', () => {
  test('close modal', () => {
    const setStateMock = jest.fn();
    const { container } = render(
      <AccountModal visible={true} closeHandler={setStateMock} />,
    );
    const closeButton = container.querySelector('.close-button');
    if (closeButton) fireEvent.click(closeButton);

    expect(setStateMock).toHaveBeenCalledTimes(1);
    expect(setStateMock).toHaveBeenCalledWith();
  });

  test('disconnect wallet', () => {
    const setStateMock = jest.fn();
    render(<AccountModal visible={true} closeHandler={setStateMock} />);

    const disconnect = screen.getByText('navigation.disconnect');
    fireEvent.click(disconnect);

    expect(setStateMock).toHaveBeenCalledTimes(1);
    expect(setStateMock).toHaveBeenCalledWith();
  });
});
