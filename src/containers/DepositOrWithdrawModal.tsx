import { useWeb3React } from '@web3-react/core';
import { BigNumber, constants, utils } from 'ethers';
import { useContext, useEffect } from 'react';
import { useMemo } from 'react';
import { FunctionComponent, useState } from 'react'
import { useTranslation } from 'react-i18next';
import LoadingIndicator from 'src/components/LoadingIndicator';
import { GetAllReserves_reserves } from 'src/queries/__generated__/GetAllReserves';
import { GetUser_user } from 'src/queries/__generated__/GetUser';
import calcMiningAPR from 'src/utiles/calcMiningAPR';
import calcAccumulatedYield from 'src/utiles/calcAccumulatedYield';
import envs from 'src/core/envs';
import { toPercent } from 'src/utiles/formatters';
import DepositBody from '../components/DepositBody';
import WithdrawBody from '../components/WithdrawBody';
import calcCurrentIndex from 'src/utiles/calcCurrentIndex';
import PriceContext from 'src/contexts/PriceContext';
import useMoneyPool from 'src/hooks/useMoneyPool';
import useERC20Info from 'src/hooks/useERC20Info';
import useWaitingTx from 'src/hooks/useWaitingTx';
import ReactGA from "react-ga";
import useTxTracking from 'src/hooks/useTxTracking';
import TxContext from 'src/contexts/TxContext';

const DepositOrWithdrawModal: FunctionComponent<{
  tokenName: string,
  visible: boolean,
  tokenImage: string,
  balance: BigNumber,
  depositBalance: BigNumber
  reserve: GetAllReserves_reserves,
  userData: GetUser_user | undefined | null,
  onClose: () => void,
  afterTx: () => Promise<void>,
  transactionModal: () => void
}> = ({ tokenName, visible, tokenImage, balance, depositBalance, reserve, userData, onClose, afterTx, transactionModal }) => {
  const { account } = useWeb3React()
  const { elfiPrice } = useContext(PriceContext);
  const [selected, select] = useState<boolean>(true)
  const {
    allowance,
    loading,
    contract: reserveERC20,
    refetch,
  } = useERC20Info(
    reserve.id,
    envs.moneyPoolAddress
  )
  const [liquidity, setLiquidity] = useState<{ value: BigNumber, loaded: boolean }>({ value: constants.Zero, loaded: false });
  const { waiting, wait } = useWaitingTx()
  const [currentIndex, setCurrentIndex] = useState<BigNumber>(
    calcCurrentIndex(
      BigNumber.from(reserve.lTokenInterestIndex),
      reserve.lastUpdateTimestamp,
      BigNumber.from(reserve.depositAPY)
    )
  )
  const { t } = useTranslation();
  const moneyPool = useMoneyPool();
  const initTxTracker = useTxTracking();
  const { setTransaction, FailTransaction } = useContext(TxContext);

  const accumulatedYield = useMemo(() => {
    return calcAccumulatedYield(
      balance,
      currentIndex,
      userData?.lTokenMint.filter((mint) => mint.lToken.id === reserve.lToken.id) || [],
      userData?.lTokenBurn.filter((burn) => burn.lToken.id === reserve.lToken.id) || []
    )
  }, [reserve, userData, currentIndex, balance])

  const yieldProduced = useMemo(() => {
    return accumulatedYield.sub(
      calcAccumulatedYield(
        // FIXME
        // Tricky constant.One
        // yieldProduced should be calculated with last burn index
        constants.One,
        BigNumber.from(userData?.lTokenBurn[userData.lTokenBurn.length - 1]?.index || reserve.lTokenInterestIndex),
        userData?.lTokenMint.filter((mint) => mint.lToken.id === reserve.lToken.id) || [],
        userData?.lTokenBurn.filter((burn) => burn.lToken.id === reserve.lToken.id) || []
      )
    );
  }, [accumulatedYield, reserve, userData])

  const increateAllowance = async () => {
    if (!account) return;
    const tracker = initTxTracker(
      'DepositOrWithdrawalModal',
      'Approve',
      `${reserve.id}`
    );

    tracker.clicked();

    reserveERC20.approve(envs.moneyPoolAddress, constants.MaxUint256).then((tx) => {
      tracker.created();
      wait(
        tx as any,
        () => {
          refetch();
        }
      )
    }).catch(() => {
      tracker.canceled();
    })
  }

  const requestDeposit = async (amount: BigNumber) => {
    if (!account) return;

    const tracker = initTxTracker(
      'DepositOrWithdrawalModal',
      'Deposit',
      `${utils.formatEther(amount)} ${reserve.id}`
    );

    tracker.clicked();

    moneyPool
      .deposit(reserve.id, account, amount)
      .then((tx) => {
        setTransaction(tx, tracker, () => {
          transactionModal();
          onClose();
          window.localStorage.setItem("@txTracking", "Deposit");
        }, 
        () => {
          afterTx();
        })
      }).catch(() => {
        FailTransaction(tracker, onClose)
      })
  }

  const reqeustWithdraw = (amount: BigNumber, max: boolean) => {
    if (!account) return;

    const tracker = initTxTracker(
      'DepositOrWithdrawalModal',
      'Withdraw',
      `${utils.formatEther(amount)} ${max} ${reserve.id}`
    );

    tracker.clicked();

    moneyPool
      .withdraw(reserve.id, account, max ? constants.MaxUint256 : amount)
      .then((tx) => {
        setTransaction(tx, tracker, () => {
          transactionModal();
          onClose();
          window.localStorage.setItem("@txTracking", "Withdraw");
        }, 
        () => {
          afterTx();
        })
      }).catch(() => {
        FailTransaction(tracker, onClose)
      })
  }

  useEffect(() => {
    if (!reserve) return

    reserveERC20.balanceOf(reserve.lToken.id).then((value) => {
      setLiquidity({
        value,
        loaded: true
      })
    })
  }, [reserve, reserveERC20])

  useEffect(() => {
    const interval = setInterval(() => setCurrentIndex(
      calcCurrentIndex(
        BigNumber.from(reserve.lTokenInterestIndex),
        reserve.lastUpdateTimestamp,
        BigNumber.from(reserve.depositAPY)
      ))
      , 500
    );

    return () => {
      clearInterval(interval);
    }
  })

  return (
    <div className="modal modal--deposit" style={{ display: visible ? "block" : "none" }}>
      <div className="modal__container">
        <div className="modal__header">
          <div className="modal__header__token-info-wrapper">
            <img className="modal__header__image" src={tokenImage} alt="Token" />
            <div className="modal__header__name-wrapper">
              <p className="modal__header__name spoqa__bold">{tokenName}</p>
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
            onClick={() => { select(true) }}
          >
            <p className="bold">{t("dashboard.deposit")}</p>
          </div>
          <div
            className={`modal__converter__column${!selected ? "--selected" : ""}`}
            onClick={() => { select(false) }}
          >
            <p className="bold">{t("dashboard.withdraw")}</p>
          </div>
        </div>
        <div className="modal__body">
          {waiting ? (
            <LoadingIndicator />
          ) : (
            selected ? (
              <DepositBody
                tokenName={tokenName}
                depositAPY={toPercent(reserve.depositAPY || '0')}
                miningAPR={toPercent(calcMiningAPR(elfiPrice, BigNumber.from(reserve.totalDeposit)))}
                balance={balance}
                isApproved={!loading && allowance.gt(balance)}
                increaseAllownace={increateAllowance}
                deposit={requestDeposit}
              />
            ) : (
              <WithdrawBody
                tokenName={tokenName}
                depositBalance={depositBalance}
                accumulatedYield={accumulatedYield}
                yieldProduced={yieldProduced}
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