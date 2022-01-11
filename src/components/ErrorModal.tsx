import { utils } from 'ethers';
import { FunctionComponent, useContext, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import TxContext from 'src/contexts/TxContext';
import TxStatus from 'src/enums/TxStatus';
import ethersJsErrors from 'src/utiles/ethersJsErrors';

type Props = {
  error: string;
};

const ErrorModal: FunctionComponent<Props> = ({ error }) => {
  const { t } = useTranslation();
  const errorDescription = useRef<HTMLTextAreaElement>(null);
  const totalHeight = document.documentElement.scrollHeight;
  const { initTransaction } = useContext(TxContext);
  const errorCopy = () => {
    errorDescription.current?.select();
    document.execCommand('copy');
  };

  const onCloseHandler = () => {
    initTransaction(TxStatus.IDLE, false);
  };

  return (
    <>
      <div
        className="error"
        style={{
          height: totalHeight,
        }}
      />
      <div className="error__container">
        <div className="error__container__header">
          <div className="bold">{t('staking.transaction_failed')}</div>
          <div className="close-button" onClick={() => onCloseHandler()}>
            <div className="close-button--1">
              <div className="close-button--2" />
            </div>
          </div>
        </div>
        <hr />
        <div className="error__container__inquiry">
          {ethersJsErrors.includes(error)
            ? t('staking.error_description_one')
            : t('staking.error_description_two')}
        </div>
        <div className="error__container__description">
          <div className="bold">{t('staking.error_code')}</div>
          <div>
            <div>
              <textarea
                ref={errorDescription}
                readOnly
                value={error}></textarea>
            </div>
          </div>
        </div>
        <div className={`modal__button`} onClick={() => errorCopy()}>
          <p>{t('staking.error_code_copy')}</p>
        </div>
      </div>
    </>
  );
};

export default ErrorModal;
