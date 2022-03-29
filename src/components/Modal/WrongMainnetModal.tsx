import { useTranslation } from 'react-i18next';
import ModalHeader from 'src/components/Modal/ModalHeader';

const WrongMainnetModal: React.FunctionComponent<{
  visible: boolean;
  onClose: () => void;
}> = ({ visible, onClose }) => {
  const { t } = useTranslation();
  return (
    <div
      className="modal modal__wrong-mainnet"
      style={{ display: visible ? 'block' : 'none' }}>
      <div className="modal__container">
        <ModalHeader title={t('modal.wrong_mainnet.title')} onClose={onClose} />
        <div className="modal__connect__content">
          <p>{t('modal.wrong_mainnet.content')}</p>
        </div>
        <div className={`modal__button`} onClick={onClose}>
          <p>{t('modal.wrong_mainnet.button')}</p>
        </div>
      </div>
    </div>
  );
};

export default WrongMainnetModal;
