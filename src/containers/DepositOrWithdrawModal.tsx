import { useWeb3React } from '@web3-react/core';
import { BigNumber, constants, providers } from 'ethers';
import { useEffect } from 'react';
import { FunctionComponent, useState } from 'react'
import { GetAllReserves_reserves } from 'src/queries/__generated__/GetAllReserves';
import { deposit, getAllowance, increaseAllownace, withdraw } from 'src/utiles/contractHelpers';
import { toPercent } from 'src/utiles/formatters';
import DepositBody from '../components/DepositBody';
import WithdrawBody from '../components/WithdrawBody';

// Create deposit & withdraw
const DepositOrWithdrawModal: FunctionComponent<{
  tokenName: string,
  visible: boolean,
  tokenImage: string,
  balance: BigNumber,
  depositBalance: BigNumber
  reserve: GetAllReserves_reserves,
  onClose: () => void,
}> = ({ tokenName, visible, tokenImage, balance, depositBalance, reserve, onClose, }) => {
  const { account, library } = useWeb3React()
  const [selected, select] = useState<boolean>(true)
  const [allownace, setAllowance] = useState<BigNumber>(constants.Zero);
  const [txWating, setWating] = useState<boolean>(false);

  const loadAllowance = async () => {
    if (!account) return;

    setAllowance(await getAllowance(account, reserve.id, library))
  }

  const requestAllowance = async () => {
    if (!account) return;

    waitTx(await increaseAllownace(account, reserve.id, library));
  }

  const requestDeposit = async (amount: BigNumber) => {
    if (!account) return;

    waitTx(
      await deposit(account, reserve.id, amount, library),
      true
    );
  }

  const reqeustWithdraw = async (amount: BigNumber) => {
    if (!account) return;

    waitTx(
      await withdraw(account, reserve.id, amount, library),
      true
    );
  }

  const waitTx = async (txHash: string | undefined, withClose?: boolean) => {
    if (!txHash) return;

    setWating(true);
    try {
      await (library as providers.Web3Provider).waitForTransaction(txHash);
    } finally {
      setWating(false);
      if (withClose) onClose();
    }
  }

  useEffect(() => {
    loadAllowance();
  }, [account])

  return (
    <div className="modal modal--deposit" style={{ display: visible ? "block" : "none" }}>
      <div className="modal__container">
        <div className="modal__header">
          <div className="modal__header__token-info-wrapper">
            <img className="modal__header__image" src={tokenImage} alt="Token" />
            <div className="modal__header__name-wrapper">
              <p className="modal__header__name bold">{tokenName}</p>
            </div>
          </div>
            <div className="close-button" onClick={onClose}>
              <div className="close-button--1">
                <div className="close-button--2" />
              </div>
            </div>
        </div>
        <div className='modal__converter'>
          <div
            className={`modal__converter__column${selected ? "--selected" : ""}`}
            onClick={() => select(true)}
          >
            <p className="bold">Deposit</p>
          </div>
          <div
            className={`modal__converter__column${!selected ? "--selected" : ""}`}
            onClick={() => select(false)}
          >
            <p className="bold">Withdraw</p>
          </div>
        </div>
        <div className="modal__body">
          {txWating ? (
            <div className="loading-indicator">
              <div className="loader">
                <div className="l_main">
                  <div className="l_square"><span></span><span></span><span></span></div>
                  <div className="l_square"><span></span><span></span><span></span></div>
                  <div className="l_square"><span></span><span></span><span></span></div>
                  <div className="l_square"><span></span><span></span><span></span></div>
                </div>
              </div>
              <div className="loading-indicator__text">
                <p className="bold">Transaction is now loading</p>
              </div>
            </div>
          ) : (
            selected ? (
              <DepositBody
                tokenName={tokenName}
                depositAPY={toPercent(reserve.depositAPY || '0')}
                miningAPR={toPercent(reserve.depositAPY || '0')}
                balance={balance}
                isApproved={allownace.gt(balance)}
                txWating={txWating}
                increaseAllownace={requestAllowance}
                deposit={requestDeposit}
              />
            ) : (
              <WithdrawBody
                tokenName={tokenName}
                depositBalance={depositBalance}
                txWating={txWating}
                withdraw={reqeustWithdraw}
              />
            )
          )}
        </div>
      </div>
    </div>
  )
}

export default DepositOrWithdrawModal;