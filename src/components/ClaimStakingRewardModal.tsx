import { useWeb3React } from '@web3-react/core';
import { BigNumber } from 'ethers';
import { FunctionComponent, useEffect, useState } from 'react'
import LoadingIndicator from 'src/components/LoadingIndicator';
import ElifyTokenImage from 'src/assets/images/ELFI.png';
import DaiImage from 'src/assets/images/dai.png';
import { formatCommaSmall } from 'src/utiles/formatters';
import useWatingTx from 'src/hooks/useWatingTx';
import Token from 'src/enums/Token';
import { useTranslation } from 'react-i18next';
import useStakingPool from 'src/hooks/useStakingPool';

// Create deposit & withdraw
const ClaimStakingRewardModal: FunctionComponent<{
  stakedToken: Token.ELFI | Token.EL,
  token: Token.ELFI | Token.DAI,
  balance: BigNumber,
  visible: boolean,
  round: number,
  closeHandler: () => void,
  afterTx: () => void,
}> = ({ visible, stakedToken, token, balance, round, closeHandler, afterTx }) => {
  const { account } = useWeb3React()
  const stakingPool = useStakingPool(stakedToken);
  const [txHash, setTxHash] = useState("")
  const { wating } = useWatingTx(txHash)
  const { t } = useTranslation();
  useEffect(() => {
    if (!wating) {
      afterTx()
      closeHandler()
    }
  }, [wating])

  return (
    <div className="modal modal--deposit" style={{ display: visible ? "block" : "none" }}>
      <div className="modal__container">
        <div className="modal__header">
          <div className="modal__header__token-info-wrapper">
            <img
              className="modal__header__image"
              src={token === Token.ELFI ? ElifyTokenImage : DaiImage}
              alt="Token"
            />
            <div className="modal__header__name-wrapper">
              <p className="modal__header__name bold">{token}</p>
            </div>
          </div>
          <div className="close-button" onClick={closeHandler}>
            <div className="close-button--1">
              <div className="close-button--2" />
            </div>
          </div>
        </div>
        <div className="modal__body">
          {wating ?
            <LoadingIndicator />
            :
            <div className="modal__withdraw">
              <div className="modal__withdraw__value-wrapper">
                <p></p>
                <p className="modal__withdraw__value bold">
                  {
                    formatCommaSmall(balance)
                  }
                </p>
              </div>
              <div
                className="modal__button"
                onClick={() => {
                  if (!account) return

                  stakingPool.claim(round.toString()).then((tx) => {
                    setTxHash(tx.hash);
                  })
                }}
              >
                <p>
                  {t("staking.claim_reward")}
                </p>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default ClaimStakingRewardModal;