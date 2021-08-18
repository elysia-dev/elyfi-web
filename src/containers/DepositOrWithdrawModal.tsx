import { useWeb3React } from '@web3-react/core';
import { BigNumber, constants, providers } from 'ethers';
import { useContext, useEffect } from 'react';
import { useMemo } from 'react';
import { FunctionComponent, useState } from 'react'
import { useTranslation } from 'react-i18next';
import LoadingIndicator from 'src/components/LoadingIndicator';
import { GetAllReserves_reserves } from 'src/queries/__generated__/GetAllReserves';
import { GetUser_user } from 'src/queries/__generated__/GetUser';
import calcMiningAPR from 'src/utiles/calcMiningAPR';
import calcAccumulatedYield from 'src/utiles/calcAccumulatedYield';
import { getAllowance, getErc20Balance, increaseAllownace } from 'src/utiles/contractHelpers';
import { toPercent } from 'src/utiles/formatters';
import DepositBody from '../components/DepositBody';
import WithdrawBody from '../components/WithdrawBody';
import { useCallback } from 'react';
import calcCurrentIndex from 'src/utiles/calcCurrentIndex';
import PriceContext from 'src/contexts/PriceContext';
import useMoneyPool from 'src/hooks/useMoneyPool';

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
}> = ({ tokenName, visible, tokenImage, balance, depositBalance, reserve, userData, onClose, afterTx }) => {
  const { account, library } = useWeb3React()
  const { elfiPrice } = useContext(PriceContext);
  const [selected, select] = useState<boolean>(true)
  const [allowance, setAllowance] = useState<{ value: BigNumber, loaded: boolean }>({ value: constants.Zero, loaded: false });
  const [liquidity, setLiquidity] = useState<{ value: BigNumber, loaded: boolean }>({ value: constants.Zero, loaded: false });
  const [txWating, setWating] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<BigNumber>(
    calcCurrentIndex(
      BigNumber.from(reserve.lTokenInterestIndex),
      reserve.lastUpdateTimestamp,
      BigNumber.from(reserve.depositAPY)
    )
  )
  const { t } = useTranslation();
  const moneyPool = useMoneyPool();

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
  }, [accumulatedYield, reserve, userData, balance])

  const loadAllowance = useCallback(async () => {
    if (!account) return;

    setAllowance({
      value: await getAllowance(account, reserve.id, library),
      loaded: true
    })
  }, [account, library, reserve]);

  const requestAllowance = async () => {
    if (!account) return;

    waitTx(await increaseAllownace(account, reserve.id, library)).then(() => {
      loadAllowance();
    });
  }

  const requestDeposit = async (amount: BigNumber) => {
    if (!account) return;

    const tx = await moneyPool.deposit(reserve.id, account, amount)

    waitTx(tx.hash).then(() => {
      afterTx();
      onClose();
    })
  }

  const reqeustWithdraw = async (amount: BigNumber, max: boolean) => {
    if (!account) return;

    const tx = await moneyPool.withdraw(reserve.id, account, max ? constants.MaxUint256 : amount)

    waitTx(tx.hash).then(() => {
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
  }, [account, loadAllowance])

  useEffect(() => {
    if (!reserve) return

    getErc20Balance(reserve.id, reserve.lToken.id, library).then((value) => {
      setLiquidity({
        value,
        loaded: true
      })
    })
  }, [reserve, library])

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
          {/* {txWating ? (
            <></>
          ) : ( */}
          <div className="close-button" onClick={onClose}>
            <div className="close-button--1">
              <div className="close-button--2" />
            </div>
          </div>
          {/* )} */}

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
          {txWating ? (
            <LoadingIndicator />
          ) : (
            selected ? (
              <DepositBody
                tokenName={tokenName}
                depositAPY={toPercent(reserve.depositAPY || '0')}
                miningAPR={toPercent(calcMiningAPR(elfiPrice, BigNumber.from(reserve.totalDeposit)))}
                balance={balance}
                isApproved={!allowance.loaded || allowance.value.gt(balance)}
                increaseAllownace={requestAllowance}
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