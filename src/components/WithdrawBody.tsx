import { BigNumber, utils } from 'ethers';
import { useState } from 'react'
import { useTranslation } from 'react-i18next';
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

  const { t } = useTranslation();

  return (
    <div className="modal__withdraw">
      <div className="modal__withdraw__value-wrapper">
        <p className="modal__withdraw__maximum bold" onClick={() => { setAmount(utils.formatEther(depositBalance)) }}>
          {t("dashboard.max")}
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
            <p className="bold">{t("dashboard.withdraw_availble")}</p>
            <p className="bold">{`${formatComma(depositBalance)} ${tokenName}`}</p>
          </div>
          <div>
            <p className="bold">{t("dashboard.deposit_balance")}</p>
            <p className="bold">{`${formatComma(depositBalance)} ${tokenName}`}</p>
          </div>
          <div>
            <p className="bold">{t("dashboard.reserves_elyfi", { tokenName: tokenName })}</p>
            <p className="bold"> - {tokenName}</p>
          </div>
        </div>
        <div className="modal__withdraw__withdrawalable-value-wrapper">
          <div className="modal__withdraw__withdrawalable__title">
            <p className="bold">{t("dashboard.yield")}</p>
          </div>
          <div>
            <p className="bold">{t("dashboard.yield_produced")}</p>
            <p className="bold"> - {tokenName}</p>
          </div>
          <div>
            <p className="bold">{t("dashboard.accumulated")}</p>
            <p className="bold"> - {tokenName}</p>
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
                amountLteZero ? t("dashboard.enter_amount") :
                  amountGtBalance ? t("dashboard.insufficient_balance", { tokenName: tokenName }) : t("dashboard.withdraw")
              }
            </p>
          </div>
      }
    </div>
  )
}

export default WithdrawBody;
