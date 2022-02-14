import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import ModalHeader from 'src/components/ModalHeader';
import { Web3Context } from 'src/providers/Web3Provider';

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
              onClose();
            }}>
            <p>
              {window.ethereum?.isMetaMask
                ? t('modal.connect_wallet.button')
                : t('navigation.install_metamask')}
            </p>
          </div>
        </>
      </div>
    </div>
  );
};

export default ConnectWalletModal;
