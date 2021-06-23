import { BigNumber, utils } from 'ethers';
import { FunctionComponent, useState } from 'react'
import { GetAllReserves_reserves } from 'src/queries/__generated__/GetAllReserves';
import { toPercent } from 'src/utiles/formatters';

const InvalidChars = ["-", "+", "e"];

const DepositBody: React.FunctionComponent<{
  tokenName: string, depositAPY: string, miningAPR: string, balance: BigNumber
}> = ({ tokenName, depositAPY, miningAPR, balance }) => {
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
                {`${utils.formatEther(balance)} ${tokenName}`}
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
            <p className="bold">{depositAPY}</p>
          </div>
          <div>
            <p className="bold">Mining APR</p>
            <p className="bold">{miningAPR}</p>
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

const WithdrawBody: React.FunctionComponent<{ tokenName: string }> = ({ tokenName }) => {
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
      </div>
      <div className="modal__withdraw__withdrawalable">
        <div className="modal__withdraw__withdrawalable-amount-wrapper">
          <div className="modal__withdraw__withdrawalable__title">
            <p className="bold">Withdrawalable Amount</p>
            <p className="bold">2,000.00 {tokenName}</p>
          </div>
          <div>
            <p className="bold">Deposit Balance</p>
            <p className="bold">1,000.00 {tokenName}</p>
          </div>
          <div>
            <p className="bold">Total Balance in ELYFI</p>
            <p className="bold">1,000.00 {tokenName}</p>
          </div>
        </div>
        <div className="modal__withdraw__withdrawalable-value-wrapper">
          <div className="modal__withdraw__withdrawalable__title">
            <p className="bold">Accrual Interest</p>
          </div>
          <div>
            <p className="bold">Interest after the prior withdraw</p>
            <p className="bold">1,000.00 {tokenName}</p>
          </div>
          <div>
            <p className="bold">Accumulated Interest</p>
            <p className="bold">1,000.00 {tokenName}</p>
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

const DepositOrWithdrawModal: FunctionComponent<{
  reserve: GetAllReserves_reserves,
  tokenName: string,
  visible: boolean,
  tokenImage: string,
  balance: BigNumber,
  onClose: () => void,
}> = ({ reserve, tokenName, visible, tokenImage, onClose, balance }) => {
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
              depositAPY={toPercent(reserve.depositAPY)}
              miningAPR={toPercent(reserve.depositAPY)}
              balance={balance}
            />
          ) : (
            <WithdrawBody
              tokenName={tokenName}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default DepositOrWithdrawModal;