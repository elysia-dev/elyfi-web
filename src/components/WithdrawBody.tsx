import { BigNumber, utils } from 'ethers';
import { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { formatCommaWithDigits, formatCommaFillZero } from 'src/utiles/formatters';
import { IReserve } from 'src/core/data/reserves';

const WithdrawBody: React.FunctionComponent<{
  tokenId: IReserve,
  depositBalance: BigNumber
  liquidity: BigNumber,
  yieldProduced: BigNumber,
  accumulatedYield: BigNumber,
  withdraw: (amount: BigNumber, max: boolean) => void
}> = ({ tokenId, depositBalance, liquidity, yieldProduced, accumulatedYield, withdraw }) => {
  const [amount, setAmount] = useState<{ value: string, max: boolean }>({ value: '', max: false });

  const amountGtBalance = utils.parseUnits((amount.value || '0'), tokenId.decimals).gt(depositBalance);
  const amountLteZero = !amount.value || parseFloat(amount.value) <= 0;

  const { t } = useTranslation();

  return (
    <>
      <div className="modal__withdraw">
        <div className="modal__withdraw__value-wrapper">
          <p className="modal__withdraw__maximum bold" onClick={() => {
            setAmount({
              value: (Math.floor(parseFloat(utils.formatUnits((depositBalance.lte(liquidity) ? depositBalance : liquidity), tokenId.decimals)) * 100000000) / 100000000).toFixed(8).toString(),
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
                target.value = target.value.replace(/(\.\d{18})\d+/g, '$1');
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
              <p className="spoqa__bold">{`${formatCommaWithDigits(depositBalance.lte(liquidity) ? depositBalance : liquidity, 4, tokenId.decimals)} ${tokenId.name}`}</p>
            </div>
            <div>
              <p className="spoqa__bold">{t("dashboard.deposit_balance")}</p>
              <p className="spoqa__bold">{`${formatCommaWithDigits(depositBalance, 4, tokenId.decimals)} ${tokenId.name}`}</p>
            </div>
            <div>
              <p className="spoqa__bold">{t("dashboard.reserves_elyfi", { tokenName: tokenId.name })}</p>
              <p className="spoqa__bold">{`${formatCommaWithDigits(liquidity, 4, tokenId.decimals)} ${tokenId.name}`}</p>
            </div>
          </div>
          <div className="modal__withdraw__withdrawalable-value-wrapper">
            <div className="modal__withdraw__withdrawalable__title">
              <p className="spoqa__bold">{t("dashboard.yield")}</p>
            </div>
            <div>
              <p className="spoqa__bold">{t("dashboard.yield_produced")}</p>
              <p className="spoqa__bold">{`${formatCommaFillZero(yieldProduced, tokenId.decimals)} ${tokenId.name}`}</p>
            </div>
            <div>
              <p className="spoqa__bold">{t("dashboard.accumulated")}</p>
              <p className="spoqa__bold">{`${formatCommaFillZero(accumulatedYield, tokenId.decimals)} ${tokenId.name}`}</p>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`modal__button${amountGtBalance || amountLteZero ? "--disable" : ""}`}
        onClick={() => {
          if (!(amountLteZero || amountGtBalance)) {
            withdraw(utils.parseUnits(amount.value, tokenId.decimals), amount.max)
          }
        }}
      >
        <p>
          {
            amountLteZero ? t("dashboard.enter_amount") :
              amountGtBalance ? t("dashboard.insufficient_balance", { tokenName: tokenId.name }) : t("dashboard.withdraw")
          }
        </p>
      </div>
    </>
  )
}

export default WithdrawBody;
