import { useWeb3React } from '@web3-react/core';
import { BigNumber } from 'ethers';
import { FunctionComponent, useContext } from 'react'
import LoadingIndicator from 'src/components/LoadingIndicator';
import ElifyTokenImage from 'src/assets/images/ELFI.png';
import { formatCommaSmall } from 'src/utiles/formatters';
import useWaitingTx from 'src/hooks/useWaitingTx';
import { formatEther } from 'ethers/lib/utils';
import useTxTracking from 'src/hooks/useTxTracking';
import TxContext from 'src/contexts/TxContext';
import RecentActivityType from 'src/enums/RecentActivityType';
import ReservesContext from 'src/contexts/ReservesContext';
import { IncentivePool__factory } from '@elysia-dev/contract-typechain';

// Create deposit & withdraw
const IncentiveModal: FunctionComponent<{
  balance: BigNumber,
  visible: boolean,
  onClose: () => void,
  afterTx: () => Promise<void>,
  transactionModal: () => void
}> = ({ visible, balance, onClose, afterTx, transactionModal }) => {
  const { account, library } = useWeb3React()
  const { waiting, wait } = useWaitingTx()
  const initTxTracker = useTxTracking();
  const { reserves } = useContext(ReservesContext);
  const { setTransaction, failTransaction } = useContext(TxContext);

  const reqeustClaimIncentive = async () => {
    if (!account) return;

    const tracker = initTxTracker(
      'IncentiveModal',
      'Claim',
      `${formatEther(balance)} ${reserves[0].incentivePool.id}`
    );

    tracker.clicked();

    IncentivePool__factory.connect(
      reserves[0].incentivePool.id,
      library.getSigner()
    ).claimIncentive().then((tx) => {
      tracker.created();
      setTransaction(
        tx,
        tracker,
        RecentActivityType.Claim,
        () => {
          transactionModal()
          onClose()
        },
        () => {
          afterTx()
        }
      )
    }).catch((e) => {
      failTransaction(tracker, onClose, e)
    })
  }


  return (
    <div className="modal modal--deposit" style={{ display: visible ? "block" : "none" }}>
      <div className="modal__container" style={{ height: window.sessionStorage.getItem("@MediaQuery") !== "PC" ? 260 : 360 }}>
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
            <div className="modal__withdraw" style={{ height: window.sessionStorage.getItem("@MediaQuery") !== "PC" ? 130 : 170, minHeight: 0, overflowY: "clip" }}>
              <div className="modal__withdraw__value-wrapper">
                <p></p>
                <p className="modal__withdraw__value bold" style={{ fontSize: window.sessionStorage.getItem("@MediaQuery") !== "PC" ? 30 : 60 }}>
                  {
                    formatCommaSmall(balance)
                  }
                </p>
              </div>

            </div>
          }
          <div
            className="modal__button"
            onClick={() => { reqeustClaimIncentive() }}
          >
            <p>
              CLAIM REWARD
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IncentiveModal;