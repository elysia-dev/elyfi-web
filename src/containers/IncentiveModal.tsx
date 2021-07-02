import { useWeb3React } from '@web3-react/core';
import { BigNumber, providers } from 'ethers';
import { FunctionComponent, useState } from 'react'
import LoadingIndicator from 'src/components/LoadingIndicator';
import ElifyTokenImage from 'src/assets/images/ELFI.png';
import { formatComma } from 'src/utiles/formatters';
import { claimIncentive } from 'src/utiles/contractHelpers';

// Create deposit & withdraw
const IncentiveModal: FunctionComponent<{
  balance: BigNumber,
  visible: boolean,
  onClose: () => void,
}> = ({ visible, balance, onClose, }) => {
  const { account, library } = useWeb3React()
  const [txWating, setWating] = useState<boolean>(false);

  const reqeustClaimIncentive = async () => {
    if (!account) return;

    const txHash = await claimIncentive(account, library);

    if (!txHash) return;

    setWating(true);

    try {
      await (library as providers.Web3Provider).waitForTransaction(txHash);
      onClose();
    } finally {
      setWating(false);
    }
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
          {txWating ?
            <LoadingIndicator />
            :
            <div className="modal__withdraw">
              <div className="modal__withdraw__value-wrapper">
                <p></p>
                <p className="modal__withdraw__value bold">
                  {
                    formatComma(balance)
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