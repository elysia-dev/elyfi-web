import { BigNumber, utils } from 'ethers';
import { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { formatCommaWithDigits, formatCommaSmall, formatCommaFillZero } from 'src/utiles/formatters';

const WithdrawBody: React.FunctionComponent<{
  tokenName: string
  depositBalance: BigNumber
  liquidity: BigNumber,
  yieldProduced: BigNumber,
  accumulatedYield: BigNumber,
  withdraw: (amount: BigNumber, max: boolean) => void
}> = ({ tokenName, depositBalance, liquidity, yieldProduced, accumulatedYield, withdraw }) => {
  const [amount, setAmount] = useState<{ value: string, max: boolean }>({ value: '', max: false });

  const amountGtBalance = utils.parseEther(amount.value || '0').gt(depositBalance);
  const amountLteZero = !amount.value || parseFloat(amount.value) <= 0;
  
  const { t } = useTranslation();

  return (
    <div className="modal__withdraw">
      <div className="modal__withdraw__value-wrapper">
        <p className="modal__withdraw__maximum bold" onClick={() => {
          setAmount({
            value: (Math.floor(parseFloat(utils.formatEther((depositBalance.lte(liquidity) ? depositBalance : liquidity))) * 100000000) / 100000000).toFixed(8).toString(),
            max: depositBalance.lte(liquidity)
          })
        }}
        >
          {t("dashboard.max")}
        </p>
        <p className="modal__withdraw__value bold">
          <input
            type="number"
            className="modal__text-input"
            placeholder="0"
            value={amount.value}
            style={{ fontSize: amount.value.length < 8 ? 60 : amount.value.length > 12 ? 35 : 45 }}
            onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => { ["-", "+", "e"].includes(e.key) && e.preventDefault() }}
            onChange={({ target }) => {
              setAmount({
                value: target.value,
                max: false,
              })
            }}
          />
        </p>
      </div>
      <div className="modal__withdraw__withdrawalable">
        <div className="modal__withdraw__withdrawalable-amount-wrapper">
          <div className="modal__withdraw__withdrawalable__title">
            <p className="spoqa__bold">{t("dashboard.withdraw_availble")}</p>
            <p className="spoqa__bold">{`${formatCommaWithDigits(depositBalance.lte(liquidity) ? depositBalance : liquidity, 4)} ${tokenName}`}</p>
          </div>
          <div>
            <p className="spoqa__bold">{t("dashboard.deposit_balance")}</p>
            <p className="spoqa__bold">{`${formatCommaWithDigits(depositBalance, 4)} ${tokenName}`}</p>
          </div>
          <div>
            <p className="spoqa__bold">{t("dashboard.reserves_elyfi", { tokenName: tokenName })}</p>
            <p className="spoqa__bold">{`${formatCommaWithDigits(liquidity, 4)} ${tokenName}`}</p>
          </div>
        </div>
        <div className="modal__withdraw__withdrawalable-value-wrapper">
          <div className="modal__withdraw__withdrawalable__title">
            <p className="spoqa__bold">{t("dashboard.yield")}</p>
          </div>
          <div>
            <p className="spoqa__bold">{t("dashboard.yield_produced")}</p>
            <p className="spoqa__bold">{`${formatCommaFillZero(yieldProduced)} ${tokenName}`}</p>
          </div>
          <div>
            <p className="spoqa__bold">{t("dashboard.accumulated")}</p>
            <p className="spoqa__bold">{`${formatCommaFillZero(accumulatedYield)} ${tokenName}`}</p>
          </div>
        </div>
      </div>
      <div
        className={`modal__button${amountGtBalance || amountLteZero ? "--disable" : ""}`}
        onClick={() => {
          if (!(amountLteZero || amountGtBalance)) {
            withdraw(utils.parseEther(amount.value), amount.max)
          }
        }}
      >
        <p>
          {
            amountLteZero ? t("dashboard.enter_amount") :
              amountGtBalance ? t("dashboard.insufficient_balance", { tokenName: tokenName }) : t("dashboard.withdraw")
          }
        </p>
      </div>
    </div>
  )
}

export default WithdrawBody;
