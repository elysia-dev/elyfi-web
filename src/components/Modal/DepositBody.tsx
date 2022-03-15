import { BigNumber, utils } from 'ethers';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatCommaWithDigits } from 'src/utiles/formatters';
import { IReserve } from 'src/core/data/reserves';
import ModalButton from 'src/components/ModalButton';
import LoadingIndicator from '../LoadingIndicator';

const DepositBody: React.FunctionComponent<{
  tokenInfo: IReserve;
  depositAPY: string;
  miningAPR: string;
  balance: BigNumber;
  deposit: (amount: BigNumber, max: boolean) => void;
  txWait: boolean;
}> = ({
  tokenInfo,
  depositAPY,
  miningAPR,
  balance,
  deposit,
  txWait
}) => {
  const [amount, setAmount] = useState({ value: '', max: false });
  const inputRef = useRef<HTMLInputElement>(null);

  const amountGtBalance =
    !amount.max &&
    utils.parseUnits(amount.value || '0', tokenInfo.decimals).gt(balance);
  const amountLteZero = !amount.value || parseFloat(amount.value) <= 0;

  const { t } = useTranslation();

  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.addEventListener('wheel', (e) => {
      e.preventDefault();
    });

    inputRef.current.removeEventListener('wheel', (e) => {
      e.preventDefault();
    });
  }, []);

  return (
    <>
    {
      txWait ? (
        <LoadingIndicator isTxActive={txWait} />
      ) : (
        <>
          <div className="modal__deposit">
            <div className="modal__input">
              <h2
                className="modal__input__maximum"
                onClick={() => {
                  if (balance.isZero()) {
                    return;
                  }
                  setAmount({
                    value: parseFloat(
                      utils.formatUnits(balance, tokenInfo.decimals || 18),
                    ).toString(),
                    max: true,
                  });
                }}>
                {t('dashboard.max')}
              </h2>
              <h2 className="modal__input__value">
                <input
                  ref={inputRef}
                  type="number"
                  className="modal__input__value__amount"
                  placeholder="0"
                  value={parseFloat(
                    amount.value.substring(0, amount.value.indexOf('.') + 9),
                  )}
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
                  <h2>{`${formatCommaWithDigits(balance, 4, tokenInfo.decimals)} ${
                    tokenInfo.name
                  }`}</h2>
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
        </>
      )
    }
      <ModalButton
        className={`modal__button${(amountLteZero || amountGtBalance || txWait) ? ' disable' : ''}`}
        onClick={() => {
          !txWait &&
          !amountLteZero &&
          !amountGtBalance &&
          deposit(
            utils.parseUnits(amount.value, tokenInfo.decimals),
            amount.max,
          )
        }}
        content={
            amountLteZero
            ? t('dashboard.enter_amount')
            : amountGtBalance
            ? t('staking.insufficient_balance', {
                tokenName: tokenInfo.name,
              })
            : t('dashboard.deposit--button')
        }
      />
    </>
  );
};

export default DepositBody;
