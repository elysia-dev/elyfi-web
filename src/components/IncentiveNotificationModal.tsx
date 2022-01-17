import { useContext } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import ModalHeader from 'src/components/ModalHeader';
import ReservesContext from 'src/contexts/ReservesContext';

const IncentiveNotification: React.FunctionComponent<{
  visible: boolean;
  onClose: () => void;
  setIncentiveModalVisible: () => void;
}> = ({ visible, onClose, setIncentiveModalVisible }) => {
  const { t } = useTranslation();
  const { setRound } = useContext(ReservesContext);

  return (
    <div
      className="modal modal__connect"
      style={{ display: visible ? 'block' : 'none' }}>
      <div className="modal__container">
        <ModalHeader title={'Notification'} onClose={onClose} />

        <>
          <div className="modal__connect__content">
            <p>
              <Trans>{t('dashboard.claim_before_withraw_guide')}</Trans>
            </p>
            <p>
              <Trans>{t('dashboard.claim_question')}</Trans>
            </p>
          </div>
          <div
            className={`modal__button`}
            onClick={() => {
              setIncentiveModalVisible();
              onClose();
              setRound(1);
            }}>
            <p>{t('dashboard.claim_reward')}</p>
          </div>
        </>
      </div>
    </div>
  );
};

export default IncentiveNotification;
