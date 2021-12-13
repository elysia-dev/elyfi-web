import { BigNumber, utils } from 'ethers';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatCommaWithDigits } from 'src/utiles/formatters';
import { IReserve } from 'src/core/data/reserves';

const DepositBody: React.FunctionComponent<{
  tokenInfo: IReserve,
  depositAPY: string,
  miningAPR: string,
  balance: BigNumber,
  isApproved: boolean,
  increaseAllownace: () => void,
  deposit: (amount: BigNumber, max: boolean) => void,
}> = ({ tokenInfo, depositAPY, miningAPR, balance, isApproved, increaseAllownace, deposit }) => {
  const [amount, setAmount] = useState({ value: "", max: false });

  const amountGtBalance = !amount.max && utils.parseUnits((amount.value || '0'), tokenInfo.decimals).gt(balance);
  const amountLteZero = !amount.value || parseFloat(amount.value) <= 0;

  const { t } = useTranslation();

  return (
    <>
      <div className="modal__deposit">
        <div className="modal__input">
          <h2 className="modal__input__maximum" onClick={() => {
            if (balance.isZero()) {
              return
            }
            setAmount({
              value: Math.floor(parseFloat(utils.formatUnits(balance, tokenInfo.decimals))).toFixed(8),
              max: true,
            })
          }}>
            {t("dashboard.max")}
          </h2>
          <h2 className="modal__input__value">
            <input
              type="number"
              className="modal__input__value__amount"
              placeholder="0"
              value={
                // Intl.NumberFormat('en').format(parseFloat(amount))
                amount.value
              }
              style={{ fontSize: amount.value.length < 8 ? 60 : amount.value.length > 12 ? 35 : 45 }}
              onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                ['-', '+', 'e'].includes(e.key) && e.preventDefault();
              }}
              onChange={({ target }) => {
                target.value = target.value.replace(/(\.\d{18})\d+/g, '$1');
                setAmount({ value: target.value, max: false });
              }}
            />
          </h2>
        </div>
        <div className="modal__deposit__container">
          <div className="modal__deposit__despositable-amount">
            <p>{t('dashboard.deposit_available')}</p>
            <div>
              <h2>{t('dashboard.wallet_balance')}</h2>
              <h2>{`${formatCommaWithDigits(balance, 4, tokenInfo.decimals)} ${tokenInfo.name}`}</h2>
            </div>
          </div>
          <div className="modal__deposit__despositable-value">
            <p>{t('dashboard.total_deposit_yield')}</p>
            <div>
              <h2>{t('dashboard.deposit_apy')}</h2>
              <h2>{depositAPY}</h2>
            </div>
            <div>
              <h2>{t('dashboard.mining_apr')}</h2>
              <h2>{miningAPR}</h2>
            </div>
          </div>
        </div>
      </div>
      {
        isApproved ?
          <div
            className={`modal__button${amountLteZero || amountGtBalance ? " disable" : ""}`}
            onClick={() => !amountLteZero && !amountGtBalance && deposit(utils.parseUnits(amount.value, tokenInfo.decimals), amount.max)}
          >
            <p>
              {
                amountLteZero ? t("dashboard.enter_amount") :
                  amountGtBalance ? t("dashboard.insufficient_balance", { tokenName: tokenInfo.name }) : t("dashboard.deposit--button")
              }
            </p>
          </div>
          :
          <div className="modal__button" onClick={() => increaseAllownace()}>
            <p>
              {t("dashboard.protocol_allow", { tokenName: tokenInfo.name })}
            </p>
          </div>
      }
    </>
  );
};

export default DepositBody;
