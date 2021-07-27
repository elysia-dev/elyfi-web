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

const StakingModal: React.FunctionComponent<{
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
  const {
    allowance,
    loading: allowanceLoading,
    increaseAllowance,
    loadAllowance,
  } = useAllownace(
    stakedToken === Token.EL ? envs.elAddress : envs.governanceAddress, envs.elStakingPoolAddress
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
    switch(value){
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
        {wating ? (
          <LoadingIndicator />
        ) : (
          <div className="modal__body">
            <div>
              <div className="modal__value-wrapper">
                <p
                  className="modal__maximum bold"
                  onClick={() => {
                    setAmount({
                      value: (Math.floor(parseFloat(utils.formatEther(stakingMode ? balance : stakedBalance)) * 100000000) / 100000000).toFixed(8).toString(),
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
                      stakingMode ? t("staking.wallet_balance") : t("staking.nth_staking_amount", { nth: OrdinalNumberConverter(round) })
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

                      elStakingPool
                        .withdraw(
                          account,
                          amount.max ? constants.MaxUint256 : utils.parseEther(amount.value),
                          round.toString()
                        ).then((hash) => {
                          if (hash) setTxHash({ hash, closeAfterTx: true });
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

                        elStakingPool.stake(account, amount.max ? balance : utils.parseEther(amount.value)).then((hash) => {
                          if (hash) setTxHash({ hash, closeAfterTx: true });
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
                        increaseAllowance().then((hash) => {
                          if (hash) setTxHash({ hash, closeAfterTx: false });
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

export default StakingModal
