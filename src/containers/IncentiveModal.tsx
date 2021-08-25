import { useWeb3React } from '@web3-react/core';
import { BigNumber } from 'ethers';
import { FunctionComponent } from 'react'
import LoadingIndicator from 'src/components/LoadingIndicator';
import ElifyTokenImage from 'src/assets/images/ELFI.png';
import { formatCommaSmall } from 'src/utiles/formatters';
import useIncentivePool from 'src/hooks/useIncentivePool';
import useWaitingTx from 'src/hooks/useWaitingTx';
import { formatEther } from 'ethers/lib/utils';
import useTxTracking from 'src/hooks/useTxTracking';

// Create deposit & withdraw
const IncentiveModal: FunctionComponent<{
  balance: BigNumber,
  visible: boolean,
  onClose: () => void,
  afterTx: () => Promise<void>,
}> = ({ visible, balance, onClose, afterTx }) => {
  const { account } = useWeb3React()
  const { waiting, wait } = useWaitingTx()
  const incentivePool = useIncentivePool();
  const initTxTracker = useTxTracking();

  const reqeustClaimIncentive = async () => {
    if (!account) return;

    const tracker = initTxTracker(
      'IncentiveModal',
      'Claim',
      `${formatEther(balance)} ${incentivePool.address}`
    );

    tracker.clicked();

    incentivePool.claimIncentive().then((tx) => {
      tracker.created();
      wait(tx as any, () => {
        afterTx()
        onClose()
      })
    }).catch(() => {
      tracker.canceled();
    })
  }

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
          <div className="close-button" onClick={onClose}>
            <div className="close-button--1">
              <div className="close-button--2" />
            </div>
          </div>
        </div>
        <div className="modal__body">
          {waiting ?
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
                onClick={() => { reqeustClaimIncentive() }}
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

export default IncentiveModal;