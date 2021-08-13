import { BigNumber, constants, utils } from 'ethers';
import React, { useState } from 'react'
import ELFI from 'src/assets/images/ELFI.png';
import useAllownace from 'src/hooks/useAllowance';
import { formatComma } from 'src/utiles/formatters';
import envs from 'src/core/envs';
import { useTranslation } from 'react-i18next';
import useWatingTx from 'src/hooks/useWatingTx';
import LoadingIndicator from 'src/components/LoadingIndicator';
import { useEffect } from 'react';
import useBalance from 'src/hooks/useBalance';
import { useMemo } from 'react';
import StakingPool from 'src/core/contracts/StakingPool';
import { useWeb3React } from '@web3-react/core';
import Token from 'src/enums/Token';
import LanguageType from 'src/enums/LanguageType';
import ArrowUp from 'src/assets/images/arrow-up.png';
import ArrowDown from 'src/assets/images/arrow-down.png';
import ArrowLeft from 'src/assets/images/arrow-left.png';
import stakingRoundTimes from 'src/core/data/stakingRoundTimes';
import moment from 'moment';

const MigrationWithElfiModal: React.FunctionComponent<{
  visible: boolean,
  closeHandler: () => void,
  afterTx: () => void,
  stakedToken: Token.ELFI | Token.EL
  stakedBalance: BigNumber,
  round: number
}> = ({ visible, closeHandler, afterTx, stakedBalance, stakedToken, round }) => {
  const { t, i18n } = useTranslation();
  const { account, library } = useWeb3React();
  const [stakingMode, setStakingMode] = useState<boolean>(true)
  const [amount, setAmount] = useState({ value: "", max: false });
  const [migrationAmount, setMigrationAmount] = useState({ value: "", max: false });
  const [mouseHover, setMouseHover] = useState(false);
  const {
    allowance,
    loading: allowanceLoading,
    increaseAllowance,
    loadAllowance,
  } = useAllownace(
    stakedToken === Token.EL ? envs.elAddress : envs.governanceAddress,
    stakedToken === Token.EL ? envs.elStakingPoolAddress : envs.elfyStakingPoolAddress,
  );
  const {
    balance,
  } = useBalance(
    stakedToken === Token.EL ? envs.elAddress : envs.governanceAddress
  );
  const elStakingPool = useMemo(() => {
    return new StakingPool(stakedToken, library)
  }, [library]);
  const [txInfo, setTxHash] = useState({ hash: "", closeAfterTx: false })
  const { wating } = useWatingTx(txInfo.hash)

  const amountLteZero = !amount || utils.parseEther(amount.value || '0').isZero();
  const amountGtBalance = utils.parseEther(amount.value || '0').gt(balance);
  const amountGtStakedBalance = utils.parseEther(amount.value || '0').gt(stakedBalance);

  const migrationAmountLteZero = !migrationAmount || utils.parseEther(migrationAmount.value || '0').isZero();
  const migrationAmountGtBalance = utils.parseEther(migrationAmount.value || '0').gt(balance);
  const migrationAmountGtStakedBalance = utils.parseEther(migrationAmount.value || '0').gt(stakedBalance);
  const current = moment();

  const currentPhase = useMemo(() => {
    return stakingRoundTimes.filter((round) =>
      current.diff(round.startedAt) >= 0
    ).length
  }, [current]);

  useEffect(() => {
    if (!wating) {
      loadAllowance()
      afterTx()
      if (txInfo.closeAfterTx) closeHandler()
    }
  }, [wating])

  useEffect(() => {
    setAmount({
      max: false,
      value: ''
    });
  }, [stakingMode, visible])

  const OrdinalNumberConverter = (value: number) => {
    switch (value) {
      case 1: return i18n.language === LanguageType.EN ? "1st" : i18n.language === LanguageType.ZHHANS ? "一" : "1"
      case 2: return i18n.language === LanguageType.EN ? "2nd" : i18n.language === LanguageType.ZHHANS ? "二" : "2"
      case 3: return i18n.language === LanguageType.EN ? "3rd" : i18n.language === LanguageType.ZHHANS ? "三" : "3"
      case 4: return i18n.language === LanguageType.EN ? "4th" : i18n.language === LanguageType.ZHHANS ? "四" : "4"
      case 5: return i18n.language === LanguageType.EN ? "5th" : i18n.language === LanguageType.ZHHANS ? "五" : "5"
      case 6: return i18n.language === LanguageType.EN ? "6th" : i18n.language === LanguageType.ZHHANS ? "六" : "6"
      default: return ""
    }
  }

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
        <div className="modal__migration">
          <div className="modal__migration__wrapper">
            <div>
              <p>{t("staking.unstaking")}</p>
              <div className="modal__migration__input">
                <p
                  className="modal__input__maximum bold"
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
                    value={migrationAmount.value}
                    style={{ fontSize: migrationAmount.value.length < 8 ? 60 : migrationAmount.value.length > 12 ? 35 : 45 }}
                    onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                      ["-", "+", "e"].includes(e.key) && e.preventDefault();
                    }}
                    onChange={({ target }) => {
                      target.value = target.value.replace(/(\.\d{18})\d+/g, '$1');

                      setMigrationAmount({
                        value: target.value,
                        max: false
                      })
                    }}
                  />
                </p>
              </div>
              <div className="modal__migration__content">
                <p>
                  {t("staking.migration_location")} : 
                </p>
                <p>{t("staking.nth", { nth: OrdinalNumberConverter(round) })}</p>
                <img src={ArrowLeft} />
                <p>{t("staking.nth", { nth: OrdinalNumberConverter(currentPhase) })}</p>
              </div>
            </div>
          </div>

          <div className="modal__staking__container">
            <p className="spoqa__bold">
              {t("staking.available_amount")}
            </p>
            <div>
              <p className="spoqa__bold">
                {t("staking.nth_staking_amount", { nth: OrdinalNumberConverter(round) })}
              </p>
              <p className="spoqa__bold">
                {`${formatComma(stakedBalance)} ${stakedToken}`}
              </p>
            </div>
            <div style={{ height: 30 }} />
            <p className="spoqa__bold">
              {t("staking.reward_token_claim")}
            </p>
            <div>
              <p className="spoqa__bold">
                {t("staking.elfi_token")}
              </p>
              <p className="spoqa__bold">
                {`${formatComma(balance)} ${stakedToken}`}
              </p>
            </div>
          </div>
          <div
            className={`modal__button${amountLteZero || amountGtStakedBalance ? "--disable" : ""}`}
            onClick={() => {
              if (!account || amountLteZero || amountGtStakedBalance) return
              elStakingPool
                .migrate(
                  account,
                  round.toString()
                ).then((hash) => {
                  if (hash) setTxHash({ hash, closeAfterTx: true });
                })
            }}
          >
            <p>
              {amountGtStakedBalance ? t("staking.insufficient_balance") : t("staking.transfer")}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MigrationWithElfiModal;
