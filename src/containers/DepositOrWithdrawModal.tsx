import { useWeb3React } from '@web3-react/core';
import { BigNumber, constants, providers } from 'ethers';
import { useEffect } from 'react';
import { FunctionComponent, useState } from 'react'
import { useTranslation } from 'react-i18next';
import LoadingIndicator from 'src/components/LoadingIndicator';
import { GetAllReserves_reserves } from 'src/queries/__generated__/GetAllReserves';
import calcMiningAPR from 'src/utiles/calcMiningAPR';
import { deposit, getAllowance, getErc20Balance, increaseAllownace, withdraw } from 'src/utiles/contractHelpers';
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
  afterTx: () => Promise<void>,
}> = ({ tokenName, visible, tokenImage, balance, depositBalance, reserve, onClose, afterTx }) => {
  const { account, library } = useWeb3React()
  const [selected, select] = useState<boolean>(true)
  const [allowance, setAllowance] = useState<{ value: BigNumber, loaded: boolean }>({ value: constants.Zero, loaded: false });
  const [liquidity, setLiquidity] = useState<{ value: BigNumber, loaded: boolean }>({ value: constants.Zero, loaded: false });
  const [txWating, setWating] = useState<boolean>(false);
  const { t } = useTranslation();

  const loadAllowance = async () => {
    if (!account) return;

    setAllowance({
      value: await getAllowance(account, reserve.id, library),
      loaded: true
    })
  }

  const requestAllowance = async () => {
    if (!account) return;

    waitTx(await increaseAllownace(account, reserve.id, library)).then(() => {
      loadAllowance();
    });
  }

  const requestDeposit = async (amount: BigNumber) => {
    if (!account) return;

    waitTx(await deposit(account, reserve.id, amount, library)).then(() => {
      afterTx();
      onClose();
    })
  }

  const reqeustWithdraw = async (amount: BigNumber, max: boolean) => {
    if (!account) return;

    waitTx(await withdraw(account, reserve.id, max ? constants.MaxUint256 : amount, library)).then(() => {
      afterTx();
      onClose()
    })
  }

  const waitTx = async (txHash: string | undefined) => {
    if (!txHash) return;

    setWating(true);
    try {
      await (library as providers.Web3Provider).waitForTransaction(txHash);
    } finally {
      setWating(false);
    }
  }

  useEffect(() => {
    loadAllowance();
  }, [account])

  useEffect(() => {
    if (!reserve) return

    getErc20Balance(reserve.id, reserve.lToken.id, library).then((value) => {
      setLiquidity({
        value,
        loaded: true
      })
    })
  }, [reserve, library])

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
            <p className="bold">{t("dashboard.deposit")}</p>
          </div>
          <div
            className={`modal__converter__column${!selected ? "--selected" : ""}`}
            onClick={() => select(false)}
          >
            <p className="bold">{t("dashboard.withdraw")}</p>
          </div>
        </div>
        <div className="modal__body">
          {txWating ? (
            <LoadingIndicator />
          ) : (
            selected ? (
              <DepositBody
                tokenName={tokenName}
                depositAPY={toPercent(reserve.depositAPY || '0')}
                miningAPR={toPercent(calcMiningAPR(BigNumber.from(reserve.totalDeposit)))}
                balance={balance}
                isApproved={!allowance.loaded || allowance.value.gt(balance)}
                increaseAllownace={requestAllowance}
                deposit={requestDeposit}
              />
            ) : (
              <WithdrawBody
                tokenName={tokenName}
                depositBalance={depositBalance}
                liquidity={liquidity.value}
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