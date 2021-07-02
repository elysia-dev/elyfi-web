import { BigNumber, utils } from 'ethers';
import { useState } from 'react'
import { formatComma } from 'src/utiles/formatters';

// TODO
// * Interest values
const WithdrawBody: React.FunctionComponent<{
  tokenName: string
  depositBalance: BigNumber
  txWating: boolean
  withdraw: (amount: BigNumber) => void
}> = ({ tokenName, depositBalance, txWating, withdraw }) => {
  const [amount, setAmount] = useState<string>('');

  const amountGtBalance = utils.parseEther(amount || '0').gt(depositBalance);
  const amountLteZero = !amount || parseFloat(amount) <= 0;

  return (
    <div className="modal__withdraw">
      <div className="modal__withdraw__value-wrapper">
        <p className="modal__withdraw__maximum bold" onClick={() => { setAmount(utils.formatEther(depositBalance)) }}>
          MAX
        </p>
        <p className="modal__withdraw__value bold">
          <input
            type="number"
            className="modal__text-input"
            placeholder="0"
            value={amount}
            style={{ fontSize: amount.length < 8 ? 60 : amount.length > 12 ? 35 : 45 }}
            onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => { ["-", "+", "e"].includes(e.key) && e.preventDefault() }}
            onChange={({ target }) => { !txWating && setAmount(target.value) }}
          />
        </p>
      </div>
      <div className="modal__withdraw__withdrawalable">
        <div className="modal__withdraw__withdrawalable-amount-wrapper">
          <div className="modal__withdraw__withdrawalable__title">
            <p className="bold">Withdraw Available</p>
            <p className="bold">{`${formatComma(depositBalance)} ${tokenName}`}</p>
          </div>
          <div>
            <p className="bold">Deposit Balance</p>
            <p className="bold">{`${formatComma(depositBalance)} ${tokenName}`}</p>
          </div>
          <div>
            <p className="bold">{tokenName} reserves in ELYFI</p>
            <p className="bold">1,000.00 {tokenName}</p>
          </div>
        </div>
        <div className="modal__withdraw__withdrawalable-value-wrapper">
          <div className="modal__withdraw__withdrawalable__title">
            <p className="bold">Yield</p>
          </div>
          <div>
            <p className="bold">Yield produced after the prior withdrawal</p>
            <p className="bold">1,000.00 {tokenName}</p>
          </div>
          <div>
            <p className="bold">Accumulated Yield</p>
            <p className="bold">1,000.00 {tokenName}</p>
          </div>
        </div>
      </div>
      {
        txWating ? <div className="modal__button">Wating...</div>
          :
          <div
            className={`modal__button${amountGtBalance || amountLteZero ? "--disable" : ""}`}
            onClick={() => !(amountLteZero || amountGtBalance) && withdraw(utils.parseEther(amount))}
          >
            <p>
              {
                amountLteZero ? "Enter an amount" :
                  amountGtBalance ? `INSUFFICIENT BALANCE` : "WITHDRAW"
              }
            </p>
          </div>
      }
    </div>
  )
}

export default WithdrawBody;
