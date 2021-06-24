import { BigNumber } from 'ethers';
import { FunctionComponent, useState } from 'react'
import { GetAllReserves_reserves } from 'src/queries/__generated__/GetAllReserves';
import { toPercent } from 'src/utiles/formatters';
import DepositBody from './DepositBody';
import WithdrawBody from './WithdrawBody';

const DepositOrWithdrawModal: FunctionComponent<{
  tokenName: string,
  visible: boolean,
  tokenImage: string,
  balance: BigNumber,
  depositBalance: BigNumber
  reserve: GetAllReserves_reserves,
  onClose: () => void,
}> = ({ tokenName, visible, tokenImage, balance, depositBalance, reserve, onClose, }) => {
  const [state, setState] = useState({
    selectColumn: 1
  })

  return (
    <div className="modal modal--deposit" style={{ display: visible ? "block" : "none" }}>
      <div className="modal__container">
        <div className="modal__header">
          <div className="modal__header__token-info-wrapper">
            <img className="modal__header__image" src={tokenImage} alt="Token" />
            <div className="modal__header__name-wrapper">
              <p className="modal__header__name bold">{tokenName}</p>
            </div>
          </div>
          <div className="close-button" onClick={onClose}>
            <div className="close-button--1">
              <div className="close-button--2" />
            </div>
          </div>
        </div>
        <div className='modal__converter'>
          <div
            className={`modal__converter__column${state.selectColumn === 1 ? "--selected" : ""}`}
            onClick={() => setState({ ...state, selectColumn: 1 })}
          >
            <p className="bold">Deposit</p>
          </div>
          <div
            className={`modal__converter__column${state.selectColumn === 2 ? "--selected" : ""}`}
            onClick={() => setState({ ...state, selectColumn: 2 })}
          >
            <p className="bold">Withdraw</p>
          </div>
        </div>
        <div className="modal__body">
          {state.selectColumn === 1 ? (
            <DepositBody
              tokenName={tokenName}
              depositAPY={toPercent(reserve.depositAPY || '0')}
              miningAPR={toPercent(reserve.depositAPY || '0')}
              balance={balance}
            />
          ) : (
            <WithdrawBody
              tokenName={tokenName}
              depositBalance={depositBalance}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default DepositOrWithdrawModal;