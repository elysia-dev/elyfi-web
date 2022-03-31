import { useTranslation } from 'react-i18next';
import ModalHeader from 'src/components/Modal/ModalHeader';

const ClaimDisableModal: React.FunctionComponent<{
  visible: boolean;
  onClose: () => void;
}> = ({ visible, onClose }) => {
  const { t } = useTranslation();
  return (
    <div className="modal" style={{ display: visible ? 'block' : 'none' }}>
      <div className="modal__container">
        <ModalHeader title={t('modal.claim_disable.title')} onClose={onClose} />
        <div className="modal__connect__content">
          <p>{t('modal.claim_disable.content')}</p>
        </div>
        <div className={`modal__button`} onClick={() => onClose()}>
          <p>{t('modal.claim_disable.button')}</p>
        </div>
      </div>
    </div>
  );
};

export default ClaimDisableModal;
