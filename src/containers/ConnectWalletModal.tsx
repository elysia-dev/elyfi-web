import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import ModalHeader from 'src/components/ModalHeader';
import { Web3Context } from 'src/providers/Web3Provider';

const ConnectWalletModal: React.FunctionComponent<{
  visible: boolean;
  onClose: () => void;
}> = ({ visible, onClose }) => {
  const { t } = useTranslation();
  const { activate } = useContext(Web3Context);
  return (
    <div
      className="modal modal__connect"
      style={{ display: visible ? 'block' : 'none' }}>
      <div className="modal__container">
        <ModalHeader
          title={t('modal.connect_wallet.title')}
          onClose={onClose}
        />
        <div className="modal__connect__content">
          <p>{t('modal.connect_wallet.content')}</p>
        </div>
        {/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent,
        ) ? (
          <div
            className={`modal__button`}
            style={{
              background: '#BFBFBF',
            }}>
            <p>Comming Soon!</p>
          </div>
        ) : (
          <div
            className={`modal__button`}
              onClick={() => {
                activate().then(() => {
                  window.sessionStorage.setItem('@connect', 'true');
                  onClose();
                })
              }}>
              <p>
                {
               t('modal.connect_wallet.button')
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectWalletModal;
