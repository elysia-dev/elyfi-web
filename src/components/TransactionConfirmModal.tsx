import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import TransactinConfirm from 'src/assets/images/transaction_confirm.png';

const TransactionConfirmModal: React.FunctionComponent<{
  visible: boolean;
  closeHandler: () => void;
}> = ({ visible, closeHandler }) => {
  const { t } = useTranslation();

  const [Time, setTime] = useState(0);

  useEffect(() => {
    setTime(3000);
  }, [visible]);

  useEffect(() => {
    setTimeout(() => {
      closeHandler();
    }, Time);
  }, [visible]);

  return (
    <div className="modal" style={{ display: visible ? 'block' : 'none' }}>
      <div className="modal__container">
        <div className="modal__header">
          <div className="modal__header__token-info-wrapper">
            <div className="modal__header__name-wrapper">
              <p className="modal__header__name spoqa__bold">ELYFI</p>
            </div>
          </div>
          <div className="close-button" onClick={() => closeHandler()}>
            <div className="close-button--1">
              <div className="close-button--2" />
            </div>
          </div>
        </div>
        <div className="modal__confirm">
          <img src={TransactinConfirm} />
          <div>
            <p className="spoqa__bold">{t('transaction.confirm')}</p>
            <p>
              {t('transaction.nth_close', { nth: Math.floor(Time / 1000) })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionConfirmModal;
