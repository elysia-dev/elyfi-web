// eslint-disable-next-line no-use-before-define
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import MainnetSwitch from './MainnetSwitch';

describe('Mainnet switch test', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('change network Ethereum', () => {
    const setStateMock = jest.fn();
    const useStateMock: any = (useState: boolean) => [useState, setStateMock];
    jest.spyOn(React, 'useState').mockImplementation(useStateMock);
    render(<MainnetSwitch mainNetwork={false} setMainNetwork={setStateMock} />);

    expect(screen.getByText('Ethereum')).toBeInTheDocument();
    const button = screen.getByText('Ethereum');
    fireEvent.click(button);

    expect(setStateMock).toHaveBeenCalledWith(true);
  });

  it('change network BSC', () => {
    const setStateMock = jest.fn();
    const useStateMock: any = (useState: boolean) => [useState, setStateMock];
    jest.spyOn(React, 'useState').mockImplementation(useStateMock);
    render(<MainnetSwitch mainNetwork={true} setMainNetwork={setStateMock} />);

    expect(screen.getByText('BSC')).toBeInTheDocument();
    const button = screen.getByText('BSC');
    fireEvent.click(button);

    expect(setStateMock).toHaveBeenCalledWith(false);
  });
});
