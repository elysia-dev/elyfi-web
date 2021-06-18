import { FunctionComponent, useRef, useState } from 'react'
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
  const InvalidChars = ["-", "+", "e"];

  console.log(props.tokenlist)
  const DepositBody = () => {
    const [deposit, setDeposit] = useState<number>(0);
    
    const handler = (e: any) => {
      const { value } = e.target;
      (value < 0) ? setDeposit(0) : setDeposit(value)
    }
    
    return (
      <div className="modal__deposit">
        <div className="modal__deposit__value-wrapper">
          <p className="modal__deposit__maximum bold">
            MAX
          </p>
          <p className="modal__deposit__value bold">
            <input 
              type="number"
              className="modal__text-input"
              placeholder="0"
              onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => { InvalidChars.includes(e.key) && e.preventDefault() }}
              onChange={(e: React.ChangeEvent<HTMLDivElement>) => handler(e)}
            />
          </p>
        </div>
        <div className="modal__deposit__value-converter-wrapper">
          {/* <p className="modal__deposit__value-converter">
            0 {props.tokenlist.tokenName}
          </p> */}
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
                  1,000.00 {props.tokenlist.tokenName}
                </p>
              </div>
            </div>
          </div>
          <div className="modal__deposit__despositable-value-wrapper">
            <p className="bold">
              Deposit Rates
            </p>
            <div>
              <p className="bold">Deposit APY</p>
              <p className="bold">{props.tokenlist.deposit!.apyRate / 100} %</p>
            </div>
            <div>
              <p className="bold">Mining APR</p>
              <p className="bold">{props.tokenlist.deposit!.aprRate / 100} %</p>
            </div>
          </div>
        </div>
        <div className={`modal__button${deposit > 0 ? "" : "--disable"}`} onClick={() => console.log(deposit)}>
          <p>
            {deposit > 0 ? "Deposit" : "NO FUNDS AVAILABLE"}
          </p>
        </div>
      </div>
    )
  }
  const WithdrawBody = () => {
    const [withdraw, setWithdraw] = useState<number>(0);
    
    const handler = (e: any) => {
      const { value } = e.target;
      (value < 0) ? setWithdraw(0) : setWithdraw(value)
    }

    return (
      <div className="modal__withdraw">
        <div className="modal__withdraw__value-wrapper">
          <p className="modal__withdraw__maximum bold">
            MAX
          </p>
          <p className="modal__withdraw__value bold">
          <input 
              type="number"
              className="modal__text-input"
              placeholder="0"
              onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => { InvalidChars.includes(e.key) && e.preventDefault() }}
              onChange={(e: React.ChangeEvent<HTMLDivElement>) => handler(e)}
            />
          </p>
        </div>
        <div className="modal__withdraw__value-converter-wrapper">
          {/* <p className="modal__withdraw__value-converter">
            0 {props.tokenlist.tokenName}
          </p> */}
        </div>
        <div className="modal__withdraw__withdrawalable">
          <div className="modal__withdraw__withdrawalable-amount-wrapper">
            <div className="modal__withdraw__withdrawalable__title">
              <p className="bold">Withdrawalable Amount</p>
              <p className="bold">2,000.00 {props.tokenlist.tokenName}</p>
            </div>
            <div>
              <p className="bold">Deposit Balance</p>
              <p className="bold">1,000.00 {props.tokenlist.tokenName}</p>
            </div>
            <div>
              <p className="bold">Total Balance in ELYFI</p>
              <p className="bold">1,000.00 {props.tokenlist.tokenName}</p>
            </div>
          </div>
          <div className="modal__withdraw__withdrawalable-value-wrapper">
            <div className="modal__withdraw__withdrawalable__title">
              <p className="bold">Accrual Interest</p>
            </div>
            <div>
              <p className="bold">Interest after the prior withdraw</p>
              <p className="bold">1,000.00 {props.tokenlist.tokenName}</p>
            </div>
            <div>
              <p className="bold">Accumulated Interest</p>
              <p className="bold">1,000.00 {props.tokenlist.tokenName}</p>
            </div>
          </div>
        </div>
        <div className={`modal__button${withdraw > 0 ? "" : "--disable"}`} onClick={() => console.log(withdraw)}>
          <p>
            {withdraw > 0 ? "WITHDRAW" : "NOT ENOUGH BALANCE TO WITHDRAW"}
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
              {/* <p className="modal__header__type">(On dollar basis) <div>(?)</div></p> */}
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