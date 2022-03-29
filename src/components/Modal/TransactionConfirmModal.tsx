import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import TransactinConfirm from 'src/assets/images/transaction_confirm.png';
import ModalHeader from 'src/components/Modal/ModalHeader';

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
        <ModalHeader title={'ELYFI'} onClose={() => closeHandler()} />
        <div className="modal__confirm">
          <img src={TransactinConfirm} />
          <div>
            <h2>{t('transaction.confirm')}</h2>
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
