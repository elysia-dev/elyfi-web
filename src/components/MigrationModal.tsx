import { BigNumber, constants, utils } from 'ethers';
import React, { useState, useContext } from 'react'
import ELFI from 'src/assets/images/ELFI.png';
import { formatComma } from 'src/utiles/formatters';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { useWeb3React } from '@web3-react/core';
import Token from 'src/enums/Token';
import ArrowUp from 'src/assets/images/arrow-up.png';
import ArrowDown from 'src/assets/images/arrow-down.png';
import ArrowLeft from 'src/assets/images/arrow-left.png';
import stakingRoundTimes from 'src/core/data/stakingRoundTimes';
import moment from 'moment';
import useStakingPool from 'src/hooks/useStakingPool';
import toOrdinalNumber from 'src/utiles/toOrdinalNumber';
import { formatEther, parseEther } from 'ethers/lib/utils';
import useWaitingTx from 'src/hooks/useWaitingTx';
import LoadingIndicator from './LoadingIndicator';
import useTxTracking from 'src/hooks/useTxTracking';
import TxContext from 'src/contexts/TxContext';

const MigrationModal: React.FunctionComponent<{
  visible: boolean,
  closeHandler: () => void,
  afterTx: () => void,
  stakedToken: Token.ELFI | Token.EL
  rewardToken: Token.ELFI | Token.DAI,
  stakedBalance: BigNumber,
  rewardBalance: BigNumber,
  round: number,
  transactionModal: () => void
}> = ({ visible, closeHandler, afterTx, stakedBalance, rewardBalance, stakedToken, rewardToken, round, transactionModal }) => {
  const current = moment();
  const { t, i18n } = useTranslation();
  const { account } = useWeb3React();
  const [state, setState] = useState({
    withdrawAmount: "",
    migrationAmount: "",
    withdrawMax: false,
    migrationMax: false
  });
  const [mouseHover, setMouseHover] = useState(false);
  const stakingPool = useStakingPool(stakedToken, round >= 3);
  const { waiting, wait } = useWaitingTx();
  const initTxTracker = useTxTracking();
  const { setTransaction, failTransaction } = useContext(TxContext);

  const amountGtStakedBalance = !state.withdrawMax && utils.parseEther(state.withdrawAmount || '0').gt(stakedBalance);
  const migrationAmountGtStakedBalance = !state.migrationMax && utils.parseEther(state.migrationAmount || '0').gt(stakedBalance);

  const currentRound = useMemo(() => {
    return stakingRoundTimes.filter((round) =>
      current.diff(round.startedAt) >= 0
    ).length
  }, [current]);

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
        {waiting ? (
          <LoadingIndicator />
        ) :
          <div className="modal__migration">
            <div className="modal__migration__wrapper">
              <div>
                <p>{t("staking.unstaking")}</p>
                <div className="modal__migration__input">
                  <p
                    className="modal__input__maximum bold"
                    onClick={() => {
                      setState({
                        migrationAmount: '0',
                        migrationMax: false,
                        withdrawAmount: (
                          Math.floor(parseFloat(utils.formatEther(stakedBalance)))
                        ).toFixed(8),
                        withdrawMax: true,
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
                      value={state.withdrawAmount}
                      style={{ fontSize: state.withdrawAmount.length < 8 ? 60 : state.withdrawAmount.length > 12 ? 35 : 45 }}
                      onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                        ["-", "+", "e"].includes(e.key) && e.preventDefault();
                      }}
                      onChange={({ target }) => {
                        target.value = target.value.replace(/(\.\d{18})\d+/g, '$1');

                        if (target.value) {
                          setState({
                            withdrawAmount: target.value,
                            migrationAmount: formatEther((stakedBalance.sub(parseEther(target.value)))),
                            withdrawMax: false,
                            migrationMax: false,
                          })
                        } else {
                          setState({
                            migrationAmount: '',
                            withdrawAmount: '',
                            withdrawMax: false,
                            migrationMax: false,
                          })
                        }
                      }}
                    />
                  </p>
                </div>
              </div>
              <div className="arrow-wrapper">
                <img src={ArrowUp} />
                <img src={ArrowDown} />
              </div>
              <div>
                <div className="modal__migration__popup__info">
                  <p>{t("staking.migration")}</p>
                  <p
                    className="modal__migration__popup__hover"
                    onMouseEnter={() => { setMouseHover(true) }}
                    onMouseLeave={() => { setMouseHover(false) }}
                  >
                    ?
                  </p>
                  <div className="modal__migration__popup" style={{ display: mouseHover ? "block" : "none" }}>
                    {t("staking.migration--content")}
                  </div>
                </div>
                <div className="modal__migration__input">
                  <p
                    className="modal__input__maximum bold"
                    onClick={() => {
                      setState({
                        withdrawAmount: '0',
                        withdrawMax: false,
                        migrationAmount: (
                          Math.floor(parseFloat(utils.formatEther(stakedBalance)))
                        ).toFixed(8),
                        migrationMax: true,
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
                      value={state.migrationAmount}
                      style={{ fontSize: state.migrationAmount.length < 8 ? 50 : state.migrationAmount.length > 12 ? 30 : 40 }}
                      onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                        ["-", "+", "e"].includes(e.key) && e.preventDefault();
                      }}
                      onChange={({ target }) => {
                        target.value = target.value.replace(/(\.\d{18})\d+/g, '$1');

                        if (target.value) {
                          setState({
                            migrationAmount: target.value,
                            withdrawAmount: formatEther((stakedBalance.sub(parseEther(target.value)))),
                            withdrawMax: false,
                            migrationMax: false,
                          })
                        } else {
                          setState({
                            migrationAmount: '',
                            withdrawAmount: '',
                            withdrawMax: false,
                            migrationMax: false,
                          })
                        }
                      }}
                    />
                  </p>
                </div>
                <div className="modal__migration__content">
                  <p>
                    {t("staking.migration_location")} :
                  </p>
                  <p>{t("staking.nth", { nth: toOrdinalNumber(i18n.language, round) })}</p>
                  <img src={ArrowLeft} />
                  <p>{t("staking.nth", { nth: toOrdinalNumber(i18n.language, currentRound) })}</p>
                </div>
              </div>
            </div>

            <div className="modal__staking__container">
              <p className="spoqa__bold">
                {t("staking.available_amount")}
              </p>
              <div>
                <p className="spoqa__bold">
                  {t("staking.nth_staking_amount", { nth: toOrdinalNumber(i18n.language, round) })}
                </p>
                <p className="spoqa__bold">
                  {`${formatComma(stakedBalance)} ${stakedToken}`}
                </p>
              </div>
            </div>

            <div className="modal__staking__container">
              <p className="spoqa__bold">
                {t("staking.reward_token_claim")}
              </p>
              <div>
                <p className="spoqa__bold">
                  {t("staking.nth_reward_amount", { nth: toOrdinalNumber(i18n.language, round) })}
                </p>
                <p className="spoqa__bold">
                  {`${formatComma(rewardBalance)} ${rewardToken}`}
                </p>
              </div>
            </div>
          </div>
        }
        <div
          className={`modal__button${stakedBalance.isZero() || amountGtStakedBalance || migrationAmountGtStakedBalance ? "--disable" : ""}`}
          onClick={() => {
            if (stakedBalance.isZero() || !account || amountGtStakedBalance || migrationAmountGtStakedBalance) return

            const tracker = initTxTracker(
              'MigrationModal',
              'Migrate',
              `${state.migrationAmount} ${formatEther(stakedBalance)} ${stakedToken} ${round}round`
            );

            tracker.clicked();

            // TRICKY
            // ELFI V2 StakingPool need round - 2 value
            stakingPool
              .migrate(
                state.migrationMax ? stakedBalance :
                  state.withdrawMax ? constants.Zero :
                    utils.parseEther(state.migrationAmount),
                ((round >= 3 && stakedToken === Token.ELFI) ? round - 2 : round).toString()
              ).then((tx) => {
                setTransaction(tx, tracker, () => {
                  transactionModal();
                  closeHandler();
                  window.localStorage.setItem("@txTracking", stakedToken + "Migration");
                },
                  () => {
                    afterTx();
                  })
              }).catch((e) => {
                failTransaction(tracker, closeHandler, e)
              })
          }}
        >
          <p>
            {amountGtStakedBalance ? t("staking.insufficient_balance") : t("staking.transfer")}
          </p>
        </div>
      </div>
    </div>
  )
}

export default MigrationModal;
