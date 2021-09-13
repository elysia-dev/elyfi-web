import { BigNumber, constants, utils } from 'ethers';
import React, { useContext, useState } from 'react'
import ELFI from 'src/assets/images/ELFI.png';
import { formatComma } from 'src/utiles/formatters';
import envs from 'src/core/envs';
import { useTranslation } from 'react-i18next';
import useWatingTx from 'src/hooks/useWaitingTx';
import LoadingIndicator from 'src/components/LoadingIndicator';
import { useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import Token from 'src/enums/Token';
import moment from 'moment';
import stakingRoundTimes from 'src/core/data/stakingRoundTimes';
import useStakingPool from 'src/hooks/useStakingPool';
import useERC20Info from 'src/hooks/useERC20Info';
import toOrdinalNumber from 'src/utiles/toOrdinalNumber';
import ReactGA from "react-ga";
import useTxTracking from 'src/hooks/useTxTracking';
import { textSpanOverlapsWith } from 'typescript';
import txStatus from 'src/enums/txStatus';
import TxContext from 'src/contexts/TxContext';

const StakingModal: React.FunctionComponent<{
  visible: boolean,
  closeHandler: () => void,
  afterTx: () => void,
  stakedToken: Token.ELFI | Token.EL
  stakedBalance: BigNumber,
  round: number,
  endedModal: () => void,
  setTxStatus: (status: txStatus) => void,
  setTxWaiting: (status: boolean) => void,
  transactionModal: () => void
}> = ({ visible, closeHandler, afterTx, stakedBalance, stakedToken, round, endedModal, setTxStatus, setTxWaiting, transactionModal }) => {
  const { t, i18n } = useTranslation();
  const { account } = useWeb3React();
  const [stakingMode, setStakingMode] = useState<boolean>(true)
  const [amount, setAmount] = useState({ value: "", max: false });
  const current = moment();
  const { setTransaction, FailTransaction } = useContext(TxContext);
  const {
    allowance,
    balance,
    loading: allowanceLoading,
    refetch,
    contract,
  } = useERC20Info(
    stakedToken === Token.EL ? envs.elAddress : envs.governanceAddress,
    stakedToken === Token.EL ? envs.elStakingPoolAddress : envs.elfyStakingPoolAddress,
  );
  const stakingPool = useStakingPool(stakedToken);
  const { waiting, wait } = useWatingTx();
  const amountLteZero = !amount || utils.parseEther(amount.value || '0').isZero();
  const amountGtBalance = utils.parseEther(amount.value || '0').gt(balance);
  const amountGtStakedBalance = utils.parseEther(amount.value || '0').gt(stakedBalance);
  const initTxTracker = useTxTracking();

  useEffect(() => {
    setAmount({
      max: false,
      value: ''
    });
  }, [stakingMode, visible])

  return (
    <div className="modal" style={{ display: visible ? "block" : "none" }}>
      <div className="modal__container">
        <div className="modal__header">
          <div className="modal__header__token-info-wrapper">
            <img className="modal__header__image" src={ELFI} alt="Token" />
            <div className="modal__header__name-wrapper">
              <p className="modal__header__name spoqa__bold">{stakedToken}</p>
            </div>
          </div>
          <div className="close-button" onClick={() => closeHandler()}>
            <div className="close-button--1">
              <div className="close-button--2" />
            </div>
          </div>
        </div>
        <div className='modal__converter'>
          <div
            className={`modal__converter__column${stakingMode ? "--selected" : ""}`}
            onClick={() => { setStakingMode(true) }}
          >
            <p className="bold">{t("staking.staking")}</p>
          </div>
          <div
            className={`modal__converter__column${!stakingMode ? "--selected" : ""}`}
            onClick={() => { setStakingMode(false) }}
          >
            <p className="bold">{t("staking.unstaking")}</p>
          </div>
        </div>
        {waiting ? (
          <LoadingIndicator />
        ) : (
          <div className="modal__body">
            <div>
              <div className="modal__value-wrapper">
                <p
                  className="modal__maximum bold"
                  onClick={() => {
                    setAmount({
                      value: (
                        Math.floor(parseFloat(utils.formatEther(stakingMode ? balance : stakedBalance)))
                      ).toFixed(8),
                      max: true
                    })
                  }}
                >
                  {t("staking.max")}
                </p>
                <p className="modal__value bold">
                  <input
                    type="number"
                    className="modal__text-input"
                    placeholder="0"
                    value={amount.value}
                    style={{ fontSize: amount.value.length < 8 ? 60 : amount.value.length > 12 ? 35 : 45 }}
                    onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                      ["-", "+", "e"].includes(e.key) && e.preventDefault();
                    }}
                    onChange={({ target }) => {
                      target.value = target.value.replace(/(\.\d{18})\d+/g, '$1');

                      setAmount({
                        value: target.value,
                        max: false
                      })
                    }}
                  />
                </p>
              </div>
              <div className="modal__staking__container">
                <p className="spoqa__bold">
                  {!stakingMode ? t("staking.available_unstaking_amount") : t("staking.available_staking_amount")}
                </p>
                <div>
                  <p className="spoqa__bold">
                    {
                      stakingMode ? t("staking.wallet_balance") : t("staking.nth_staking_amount", { nth: toOrdinalNumber(i18n.language, round) })
                    }
                  </p>
                  <p className="spoqa__bold">
                    {`${formatComma(stakingMode ? balance : stakedBalance)} ${stakedToken}`}
                  </p>
                </div>
              </div>
              {
                !stakingMode ?
                  <div
                    className={`modal__button${amountLteZero || amountGtStakedBalance ? "--disable" : ""}`}
                    onClick={() => {
                      if (!account || amountLteZero || amountGtStakedBalance) return

                      const tracker = initTxTracker(
                        'StakingModal',
                        'Withdraw',
                        `${amount.value} ${amount.max} ${stakedToken} ${round}round`
                      )
                      tracker.clicked();

                      stakingPool
                        .withdraw(
                          amount.max ? constants.MaxUint256 : utils.parseEther(amount.value),
                          round.toString()
                        ).then((tx) => {
                          setTransaction(tx, tracker, () => {
                            closeHandler()
                            transactionModal()
                            window.localStorage.setItem("@txTracking", stakedToken + "StakingWithdraw");
                          }, 
                          () => {
                            refetch()
                            afterTx()
                          })
                        }).catch(() => {
                          FailTransaction(tracker, closeHandler);
                        })
                    }}
                  >
                    <p>
                      {amountGtStakedBalance ? t("staking.insufficient_balance") : t("staking.unstaking")}

                    </p>
                  </div> :
                  !allowanceLoading && allowance.gte(balance) ?
                    <div
                      className={`modal__button${amountLteZero || amountGtBalance ? "--disable" : ""}`}
                      onClick={() => {
                        if (!account || amountLteZero || amountGtBalance) return
                        if (current.diff(stakingRoundTimes[round - 1].endedAt) > 0) {
                          endedModal();
                          closeHandler();
                          return;
                        }

                        const tracker = initTxTracker(
                          'StakingModal',
                          `Stake`,
                          `${amount.value} ${amount.max} ${stakedToken} ${round}round`,
                        )

                        tracker.clicked();

                        // setTxWaiting(true)

                        stakingPool.stake(amount.max ? balance : utils.parseEther(amount.value)).then((tx) => {
                          setTransaction(tx, tracker, () => {
                            closeHandler()
                            transactionModal()
                            window.localStorage.setItem("@txTracking", stakedToken + "Stake");
                          }, 
                          () => {
                            refetch()
                            afterTx()
                          })
                        }).catch(() => {
                          FailTransaction(tracker, closeHandler);
                        })
                      }}
                    >
                      <p>
                        {amountGtBalance ? t("staking.insufficient_balance") : t("staking.staking")}
                      </p>
                    </div> :
                    <div
                      className={"modal__button"}
                      onClick={() => {
                        const tracker = initTxTracker(
                          'StakingModal',
                          `Approve`,
                          `${stakedToken} ${round}round`,
                        )

                        tracker.clicked();

                        contract.approve(
                          stakedToken === Token.EL ? envs.elStakingPoolAddress : envs.elfyStakingPoolAddress,
                          constants.MaxUint256,
                        ).then((tx) => {
                          setTransaction(tx, tracker, () => {
                            closeHandler()
                            transactionModal()
                          }, 
                          () => {
                            refetch()
                            afterTx()
                          })
                        }).catch(() => {
                          FailTransaction(tracker, closeHandler);
                        })
                      }}
                    >
                      <p>
                        {t("dashboard.protocol_allow", { tokenName: stakedToken })}
                      </p>
                    </div>
              }
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default StakingModal;