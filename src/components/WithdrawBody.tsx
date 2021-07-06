import { BigNumber, utils } from 'ethers';
import { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { formatComma } from 'src/utiles/formatters';

// TODO
// 1) Accumulated reward
// 2) Acuumulated reward after last withdrawal event
const WithdrawBody: React.FunctionComponent<{
  tokenName: string
  depositBalance: BigNumber
  liquidity: BigNumber
  txWating: boolean
  withdraw: (amount: BigNumber, max: boolean) => void
}> = ({ tokenName, depositBalance, liquidity, txWating, withdraw }) => {
  const [amount, setAmount] = useState<{ value: string, max: boolean }>({ value: '', max: false });

  const amountGtBalance = utils.parseEther(amount.value || '0').gt(depositBalance);
  const amountLteZero = !amount.value || parseFloat(amount.value) <= 0;

  const { t } = useTranslation();

  return (
    <div className="modal__withdraw">
      <div className="modal__withdraw__value-wrapper">
        <p className="modal__withdraw__maximum bold" onClick={() => {
          setAmount({
            value: utils.formatEther(depositBalance.lte(liquidity) ? depositBalance : liquidity),
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
              !txWating && setAmount({
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
            <p className="bold">{t("dashboard.withdraw_availble")}</p>
            <p className="bold">{`${formatComma(depositBalance.lte(liquidity) ? depositBalance : liquidity)} ${tokenName}`}</p>
          </div>
          <div>
            <p className="bold">{t("dashboard.deposit_balance")}</p>
            <p className="bold">{`${formatComma(depositBalance)} ${tokenName}`}</p>
          </div>
          <div>
            <p className="bold">{t("dashboard.reserves_elyfi", { tokenName: tokenName })}</p>
            <p className="bold">{`${formatComma(liquidity)} ${tokenName}`}</p>
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
