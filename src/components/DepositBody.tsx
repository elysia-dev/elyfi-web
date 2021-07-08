import { BigNumber, utils } from 'ethers';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatCommaWithDigits } from 'src/utiles/formatters';

const DepositBody: React.FunctionComponent<{
  tokenName: string,
  depositAPY: string,
  miningAPR: string,
  balance: BigNumber,
  isApproved: boolean,
  increaseAllownace: () => void,
  deposit: (amount: BigNumber) => void,
}> = ({ tokenName, depositAPY, miningAPR, balance, isApproved, increaseAllownace, deposit }) => {
  const [amount, setAmount] = useState<string>('');

  const amountGtBalance = utils.parseEther(amount || '0').gt(balance);
  const amountLteZero = !amount || parseFloat(amount) <= 0;

  const { t } = useTranslation();

  return (
    <div className="modal__deposit">
      <div className="modal__deposit__value-wrapper">
        <p className="modal__deposit__maximum bold" onClick={() => { setAmount((Math.floor(parseFloat(utils.formatEther(balance)) * 100000000) / 100000000).toFixed(8).toString()) }}>
          {t("dashboard.max")}
        </p>
        <p className="modal__deposit__value bold">
          <input
            type="number"
            className="modal__text-input"
            placeholder="0"
            value={amount}
            style={{ fontSize: amount.length < 8 ? 60 : amount.length > 12 ? 35 : 45 }}
            onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => { 
              ["-", "+", "e"].includes(e.key) && e.preventDefault();


            }}
            onChange={({ target }) => setAmount(target.value)}
          />
        </p>
      </div>
      <div className="modal__deposit__container">
        <div className="modal__deposit__despositable-amount-container">
          <p className="spoqa__bold">
            {t("dashboard.deposit_available")}
          </p>
          <div className="modal__deposit__despositable-amount-wrapper">
            <p className="spoqa__bold">
              {t("dashboard.wallet_balance")}
            </p>
            <div className="modal__deposit__despositable-wallet-balance-wrapper">
              <p className="spoqa__bold">
                {`${formatCommaWithDigits(balance, 4)} ${tokenName}`}
              </p>
            </div>
          </div>
        </div>
        <div className="modal__deposit__despositable-value-wrapper">
          <p className="spoqa__bold">
            {t("dashboard.total_deposit_yield")}
          </p>
          <div>
            <p className="spoqa__bold">{t("dashboard.deposit_apy")}</p>
            <p className="spoqa__bold">{depositAPY}</p>
          </div>
          <div>
            <p className="spoqa__bold">{t("dashboard.mining_apr")}</p>
            <p className="spoqa__bold">{miningAPR}</p>
          </div>
        </div>
      </div>
      {
        isApproved ?
          <div
            className={`modal__button${amountLteZero || amountGtBalance ? "--disable" : ""}`}
            onClick={() => !amountLteZero && !amountGtBalance && deposit(utils.parseEther(amount))}
          >
            <p>
              {
                amountLteZero ? t("dashboard.enter_amount") :
                  amountGtBalance ? t("dashboard.insufficient_balance", { tokenName: tokenName }) : t("dashboard.deposit--button")
              }
            </p>
          </div>
          :
          <div className="modal__button" onClick={() => increaseAllownace()}>
            <p>
              {t("dashboard.protocol_allow", { tokenName: tokenName })}
            </p>
          </div>
      }
    </div>

  )
}

export default DepositBody;