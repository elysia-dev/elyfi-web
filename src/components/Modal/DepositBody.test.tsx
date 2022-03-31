/* eslint-disable no-use-before-define */
import { fireEvent, render, screen } from '@testing-library/react';
import { BigNumber, utils } from 'ethers';
import React from 'react';
import envs from 'src/core/envs';
import DepositBody from './DepositBody';

describe('DepositBody', () => {
  const setAmount = jest.fn();
  const deposit = jest.fn();
  let component: any;

  beforeEach(() => {
    React.useState = jest
      .fn()
      .mockImplementation(() => [
        { value: '1222200000000000000', max: true },
        setAmount,
      ]);

    component = render(
      <DepositBody
        tokenInfo={{
          name: 'DAI',
          image: '',
          decimals: 18,
          address: envs.token.daiAddress,
          tokenizer: envs.tokenizer.daiTokenizerAddress,
        }}
        depositAPY={'20%'}
        miningAPR={'30%'}
        balance={BigNumber.from('4000000000000000000')}
        deposit={deposit}
        txWait={false}
      />,
    );
  });

  test('balance, depositApy, miningApr', () => {
    expect(screen.getByText('4 DAI')).toBeInTheDocument();
    expect(screen.getByText('20%')).toBeInTheDocument();
    expect(screen.getByText('30%')).toBeInTheDocument();
  });

  test('click deposit', () => {
    const btn = screen.getByText('dashboard.deposit--button');
    fireEvent.click(btn);

    expect(deposit).toBeCalledTimes(1);
    expect(deposit).toHaveBeenCalledWith(
      utils.parseUnits('1222200000000000000', 18),
      true,
    );
  });

  test('input value', () => {
    expect(component.container.querySelector('input').value).toEqual(
      '12222000',
    );
  });
});
