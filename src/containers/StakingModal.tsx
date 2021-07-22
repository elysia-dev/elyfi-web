
import { BigNumber, utils } from 'ethers';
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

const StakingModal: React.FunctionComponent<{
  visible: boolean,
  closeHandler: () => void,
  afterTx: () => void,
  stakedBalance: BigNumber,
  round: number,
}> = ({ visible, closeHandler, afterTx, stakedBalance, round }) => {
  const { t } = useTranslation();
  const { account, library } = useWeb3React();
  const [stakingMode, setStakingMode] = useState<boolean>(true)
  const [amount, setAmount] = useState<string>('');
  const {
    allowance,
    loading: allowanceLoading,
    increaseAllowance,
    loadAllowance,
  } = useAllownace(envs.elAddress, envs.elStakingPoolAddress)
  const {
    balance,
  } = useBalance(envs.elAddress);
  const elStakingPool = useMemo(() => {
    return new StakingPool('EL', library)
  }, [library]);
  const [txInfo, setTxHash] = useState({ hash: "", closeAfterTx: false })
  const { wating } = useWatingTx(txInfo.hash)

  const amountLteZero = !amount || parseFloat(amount) <= 0;
  const amountGtBalance = utils.parseEther(amount || '0').gt(balance);
  const amountGtStakedBalance = utils.parseEther(amount || '0').gt(stakedBalance);

  useEffect(() => {
    if (!wating) {
      loadAllowance()
      afterTx()
      if (txInfo.closeAfterTx) closeHandler()
    }
  }, [wating])

  return (
    <div className="modal" style={{ display: visible ? "block" : "none" }}>
      <div className="modal__container">
        <div className="modal__header">
          <div className="modal__header__token-info-wrapper">
            <img className="modal__header__image" src={ELFI} alt="Token" />
            <div className="modal__header__name-wrapper">
              <p className="modal__header__name spoqa__bold">EL</p>
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
            <p className="bold">STAKING</p>
          </div>
          <div
            className={`modal__converter__column${!stakingMode ? "--selected" : ""}`}
            onClick={() => { setStakingMode(false) }}
          >
            <p className="bold">UNSTAKING</p>
          </div>
        </div>
        {wating ? (
          <LoadingIndicator />
        ) : (
          <div className="modal__body">
            <div>
              <div className="modal__value-wrapper">
                <p className="modal__maximum bold" onClick={() => { }}>
                  MAX
                </p>
                <p className="modal__value bold">
                  <input
                    type="number"
                    className="modal__text-input"
                    placeholder="0"
                    value={amount}
                    style={{ fontSize: amount.length < 8 ? 60 : amount.length > 12 ? 35 : 45 }}
                    onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                      ["-", "+", "e"].includes(e.key) && e.preventDefault();
                    }}
                    onChange={({ target }) => {
                      target.value = target.value.replace(/(\.\d{18})\d+/g, '$1');

                      setAmount(target.value);
                    }}
                  />
                </p>
              </div>
              <div className="modal__staking__container">
                <p className="spoqa__bold">
                  스테이킹 가능한 양
                </p>
                <div>
                  <p className="spoqa__bold">
                    {
                      stakingMode ? "지갑 잔고" : `${round}차 스테이킹 수량`
                    }
                  </p>
                  <p className="spoqa__bold">
                    {`${formatComma(stakingMode ? balance : stakedBalance)} EL`}
                  </p>
                </div>
              </div>
              {
                !stakingMode ?
                  <div
                    className={`modal__button${amountLteZero || amountGtStakedBalance ? "--disable" : ""}`}
                    onClick={() => {
                      if (!account || amountLteZero || amountGtStakedBalance) return

                      elStakingPool.withdraw(account, utils.parseEther(amount), round.toString()).then((hash) => {
                        if (hash) setTxHash({ hash, closeAfterTx: true });
                      })
                    }}
                  >
                    <p>
                      UNSTAKING
                    </p>
                  </div> :
                  !allowanceLoading && allowance.gte(balance) ?
                    <div
                      className={`modal__button${amountLteZero || amountGtBalance ? "--disable" : ""}`}
                      onClick={() => {
                        if (!account || amountLteZero || amountGtBalance) return

                        elStakingPool.stake(account, utils.parseEther(amount)).then((hash) => {
                          if (hash) setTxHash({ hash, closeAfterTx: true });
                        })
                      }}
                    >
                      <p>
                        STAKING
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
                        {t("dashboard.protocol_allow", { tokenName: "EL" })}
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