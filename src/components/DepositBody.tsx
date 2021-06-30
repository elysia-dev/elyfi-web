import { BigNumber, utils } from 'ethers';
import { useState } from 'react'

const DepositBody: React.FunctionComponent<{
  tokenName: string,
  depositAPY: string,
  miningAPR: string,
  balance: BigNumber,
  isApproved: boolean,
  txWating: boolean,
  increaseAllownace: () => void,
  deposit: (amount: BigNumber) => void,
}> = ({ tokenName, depositAPY, miningAPR, balance, isApproved, txWating, increaseAllownace, deposit }) => {
  const [amount, setAmount] = useState<string>('');

  const amountGtBalance = utils.parseEther(amount || '0').gt(balance);
  const amountLteZero = !amount || parseInt(amount) <= 0;

  return (
    <div className="modal__deposit">
      <div className="modal__deposit__value-wrapper">
        <p className="modal__deposit__maximum bold" onClick={() => { setAmount((Math.floor(parseFloat(utils.formatEther(balance)) * 100000) / 100000).toString()) }}>
          MAX
        </p>
        <p className="modal__deposit__value bold">
          <input
            type="number"
            className="modal__text-input"
            value={amount}
            onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => { ["-", "+", "e"].includes(e.key) && e.preventDefault() }}
            onChange={({ target }) => !txWating && setAmount(target.value)}
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
                {`${Math.floor(parseFloat(utils.formatEther(balance)) * 100000) / 100000} ${tokenName}`}
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
      {
        txWating ? (
          <div className="modal__button">Wating...</div>
        )
          : isApproved ?
            <div
              className={`modal__button${amountLteZero || amountGtBalance ? "--disable" : ""}`}
              onClick={() => !amountLteZero && !amountGtBalance && deposit(utils.parseEther(amount))}
            >
              <p>
                {
                  amountLteZero ? "Enter an amount" :
                    amountGtBalance ? `Insufficient ${tokenName} balance` : "Deposit"
                }
              </p>
            </div>
            :
            <div className="modal__button" onClick={() => increaseAllownace()}>
              <p>
                {`Allow the Elyfi Protocol to use your ${tokenName}`}
              </p>
            </div>
      }
    </div>

  )
}

export default DepositBody;