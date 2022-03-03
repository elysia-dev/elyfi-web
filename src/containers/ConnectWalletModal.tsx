import { useWeb3React } from '@web3-react/core';
import { useTranslation } from 'react-i18next';
import ModalHeader from 'src/components/ModalHeader';

const ConnectWalletModal: React.FunctionComponent<{
  visible: boolean;
  onClose: () => void;
  selectWalletModalVisible: () => void;
}> = ({ visible, onClose, selectWalletModalVisible }) => {
  const { t } = useTranslation();
  return (
    <div
      className="modal modal__connect"
      style={{ display: visible ? 'block' : 'none' }}>
      <div className="modal__container">
        <ModalHeader
          title={t('modal.connect_wallet.title')}
          onClose={onClose}
        />
        <>
          <div className="modal__connect__content">
            <p>{t('modal.connect_wallet.content')}</p>
          </div>
          <div
            className={`modal__button`}
            onClick={() => {
              selectWalletModalVisible();
              // onClose();
            }}>
            <p>{t('modal.connect_wallet.button')}</p>
          </div>
        </>
      </div>
    </div>
  );
};

export default ConnectWalletModal;
