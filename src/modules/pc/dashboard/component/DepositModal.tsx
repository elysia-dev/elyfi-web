import { FunctionComponent, useState } from 'react'
import { DepositTokenType } from "../../../../types/DepositTokenType";
import DownArrow from "../images/down-arrow.png";

interface Props {
  visible?: boolean
  tokenlist: DepositTokenType;
  onClose: () => void;
}

const DepositModal: FunctionComponent<Props> = (props: Props) => {
  const [state, setState] = useState({
    selectColumn: 1
  })

  const DepositBody = () => {
    return (
      <div className="modal__deposit">
        <div className="modal__deposit__value-wrapper">
          <p className="modal__deposit__value bold">
            $ 0
          </p>
        </div>
        <div className="modal__deposit__value-converter-wrapper">
          <p className="modal__deposit__value-converter">
            0 {props.tokenlist.tokenName}
          </p>
        </div>
        <div className="modal__deposit__container">
          <div className="modal__deposit__despositable-amount-container">
            <p className="bold">
              Depositable Amount
            </p>
            <div className="modal__deposit__despositable-amount-wrapper">
              <p className="bold">
                Wallet Balance
              </p>
              <div className="modal__deposit__despositable-wallet-balance-wrapper">
                <p className="bold">
                  $ 1,000.00
                </p>
                <p className="bold">
                  0 EL
                </p>
              </div>
            </div>
          </div>
          <div className="modal__deposit__despositable-value-wrapper">
            <p className="bold">
              Deposit Balance
            </p>
            <div>
              <p className="bold">Before this deposit</p>
              <p className="bold">$ 1,000.00</p>
            </div>
            <div>
              <p className="bold">After this deposit</p>
              <p className="bold">$ 2,000.00</p>
            </div>
          </div>
        </div>
        <div className="modal__button">
          <p>
            Deposit
          </p>
        </div>
      </div>
    )
  }
  const WithdrawBody = () => {
    return (
      <div className="modal__withdraw">
        <div className="modal__withdraw__value-wrapper">
          <p className="modal__withdraw__maximum bold">
            MAX
          </p>
          <p className="modal__withdraw__value bold">
            $ 0
          </p>
        </div>
        <div className="modal__withdraw__value-converter-wrapper">
          <p className="modal__withdraw__value-converter">
            0 {props.tokenlist.tokenName}
          </p>
        </div>
        <div className="modal__withdraw__withdrawalable">
          <div className="modal__withdraw__withdrawalable-amount-wrapper">
            <p className="bold">Withdrawalable Amount</p>
            <p className="bold">$ 2,000.00</p>
          </div>
          <div className="modal__withdraw__withdrawalable-value-wrapper">
            <div>
              <p>Deposit Balance</p>
              <p>$ 1,000.00</p>
            </div>
            <div>
              <p>Accrual Interest</p>
              <p>$ 1,000.00</p>
            </div>
            <div>
              <p>BUSD Balance in ELYFI</p>
              <p>$ 1,000.00</p>
            </div>
          </div>
        </div>
        <div className="modal__button">
          <p>
            WITHDRAW
          </p>
        </div>
      </div>
    )
  }


  return (
    <div className="modal modal--deposit" style={{ display: props.visible ? "block" : "none" }}>
      <div className="modal__container">
        <div className="modal__header">
          <div className="modal__header__token-info-wrapper">
            <img className="modal__header__image" src={props.tokenlist!.image} />
            <div className="modal__header__name-wrapper">
              <p className="modal__header__name bold">{props.tokenlist!.tokenName}</p>
              <p className="modal__header__type">(On dollar basis) <div>(?)</div></p>
            </div>
          </div>
          <div className="close-button" onClick={props.onClose}>
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
            <DepositBody />
          ) : (
            <WithdrawBody />
          )}
        </div>
      </div>
    </div>
  )
}

export default DepositModal;