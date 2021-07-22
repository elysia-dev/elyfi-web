import { useWeb3React } from '@web3-react/core';
import { BigNumber } from 'ethers';
import { FunctionComponent, useEffect, useMemo, useState } from 'react'
import LoadingIndicator from 'src/components/LoadingIndicator';
import ElifyTokenImage from 'src/assets/images/ELFI.png';
import { formatCommaSmall } from 'src/utiles/formatters';
import StakingPool from 'src/core/contracts/StakingPool';
import useWatingTx from 'src/hooks/useWatingTx';

// Create deposit & withdraw
const ClaimStakingRewardModal: FunctionComponent<{
  balance: BigNumber,
  visible: boolean,
  round: number,
  closeHandler: () => void,
  afterTx: () => void,
}> = ({ visible, balance, round, closeHandler, afterTx }) => {
  const { account, library } = useWeb3React()
  const elStakingPool = useMemo(() => {
    return new StakingPool('EL', library)
  }, [library]);
  const [txHash, setTxHash] = useState("")
  const { wating } = useWatingTx(txHash)

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
            <img className="modal__header__image" src={ElifyTokenImage} alt="Token" />
            <div className="modal__header__name-wrapper">
              <p className="modal__header__name bold">ELFI</p>
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

                  elStakingPool.claim(account, round.toString()).then((hash) => {
                    if (hash) setTxHash(hash);
                  })
                }}
              >
                <p>
                  CLAIM REWARD
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