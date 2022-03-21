import { BigNumber, utils } from 'ethers';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  formatCommaWithDigits,
  formatCommaFillZero,
} from 'src/utiles/formatters';
import { IReserve } from 'src/core/data/reserves';
import ModalButton from 'src/components/Modal/ModalButton';
import LoadingIndicator from './LoadingIndicator';

const WithdrawBody: React.FunctionComponent<{
  tokenInfo: IReserve;
  depositBalance: BigNumber;
  liquidity: BigNumber;
  yieldProduced: BigNumber;
  accumulatedYield: BigNumber;
  withdraw: (amount: BigNumber, max: boolean) => void;
  txWait: boolean;
}> = ({
  tokenInfo,
  depositBalance,
  liquidity,
  yieldProduced,
  accumulatedYield,
  withdraw,
  txWait
}) => {
    const [amount, setAmount] = useState<{ value: string; max: boolean }>({
      value: '',
      max: false,
    });

    const amountGtBalance = !amount.max && utils.parseUnits((amount.value || '0'), tokenInfo.decimals).gt(depositBalance);
    const amountLteZero = !amount.value || parseFloat(amount.value) <= 0;

    const { t } = useTranslation();

    return (
      <>
      {
        txWait ? (
          <LoadingIndicator isTxActive={txWait} />
        ) : (
          <>
            <div className="modal__withdraw">
              <div className="modal__input">
                <h2 className="modal__input__maximum" onClick={() => {
                  if (depositBalance.isZero()) {
                    return
                  }
                  setAmount({
                    value: (Math.floor(parseFloat(utils.formatUnits((depositBalance.lte(liquidity) ? depositBalance : liquidity), tokenInfo.decimals)) * 100000000) / 100000000).toFixed(8).toString(),
                    max: depositBalance.lte(liquidity)
                  })
                }}
                >
                  {t("dashboard.max")}
                </h2>
                <h2 className="modal__input__value">
                  <input
                    type="number"
                    className="modal__input__value__amount"
                    placeholder="0"
                    value={amount.value}
                    style={{
                      fontSize:
                        amount.value.length < 8
                          ? 60
                          : amount.value.length > 12
                            ? 35
                            : 45,
                    }}
                    onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                      ['-', '+', 'e'].includes(e.key) && e.preventDefault();
                    }}
                    onChange={(e) => {
                      e.target.value = e.target.value.replace(/(\.\d{18})\d+/g, '$1');
                      setAmount({
                        value: e.target.value,
                        max: false,
                      });
                    }}
                  />
                </h2>
              </div>
              <div className="modal__withdraw__container">
                <div className="modal__withdraw__withdrawalable__amount">
                  <div className="modal__withdraw__withdrawalable__title">
                    <p>{t('dashboard.withdraw_availble')}</p>
                    <p>
                      {`${formatCommaWithDigits(
                        depositBalance.lte(liquidity) ? depositBalance : liquidity,
                        4,
                        tokenInfo.decimals,
                      )} ${tokenInfo.name}`}
                    </p>
                  </div>
                  <div className="modal__withdraw__withdrawalable__content">
                    <h2>{t('dashboard.deposit_balance')}</h2>
                    <h2>{`${formatCommaWithDigits(
                      depositBalance,
                      4,
                      tokenInfo.decimals,
                    )} ${tokenInfo.name}`}</h2>
                  </div>
                  <div className="modal__withdraw__withdrawalable__content">
                    <h2>
                      {t('dashboard.reserves_elyfi', { tokenName: tokenInfo.name })}
                    </h2>
                    <h2>{`${formatCommaWithDigits(
                      liquidity,
                      4,
                      tokenInfo.decimals,
                    )} ${tokenInfo.name}`}</h2>
                  </div>
                </div>
                <div className="modal__withdraw__withdrawalable__value">
                  <div className="modal__withdraw__withdrawalable__title">
                    <p>{t('dashboard.yield')}</p>
                  </div>
                  <div className="modal__withdraw__withdrawalable__content">
                    <h2>{t('dashboard.yield_produced')}</h2>
                    <h2>{`${formatCommaFillZero(
                      yieldProduced,
                      tokenInfo.decimals,
                    )} ${tokenInfo.name}`}</h2>
                  </div>
                  <div className="modal__withdraw__withdrawalable__content">
                    <h2>{t('dashboard.accumulated')}</h2>
                    <h2>{`${formatCommaFillZero(
                      accumulatedYield,
                      tokenInfo.decimals,
                    )} ${tokenInfo.name}`}</h2>
                  </div>
                </div>
              </div>
            </div>
          </>
        )
      }
        <ModalButton
          className={`modal__button${amountGtBalance || amountLteZero || txWait ? ' disable' : ''}`}
          onClick={() => {
            if (!(amountLteZero || amountGtBalance || txWait)) {
              withdraw(
                utils.parseUnits(amount.value, tokenInfo.decimals),
                amount.max,
              );
            }
          }}
          content={
            amountLteZero
            ? t('dashboard.enter_amount')
            : amountGtBalance
              ? t('dashboard.insufficient_balance', { tokenName: tokenInfo.name })
              : t('dashboard.withdraw--button')}
        />  
      </>
    );
  };

export default WithdrawBody;
