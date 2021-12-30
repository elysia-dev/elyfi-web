import { useWeb3React } from '@web3-react/core';
import { useTranslation } from 'react-i18next';
import ModalHeader from 'src/components/ModalHeader';
import InjectedConnector from 'src/core/connectors/injectedConnector';

const ConnectWalletModal: React.FunctionComponent<{
  visible: boolean;
  onClose: () => void;
}> = ({ visible, onClose }) => {
  const { t } = useTranslation();
  const { activate } = useWeb3React();
  return (
    <div
      className="modal modal__connect"
      style={{ display: visible ? 'block' : 'none' }}>
      <div className="modal__container">
        <ModalHeader
          title={t('modal.connect_wallet.title')}
          onClose={onClose}
        />

        {/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent,
        ) ? (
          <>
            <div className="modal__connect__content">
              <p>{t('connect_metamask.content')}</p>
            </div>
            <div
              className={`modal__button`}
              style={{
                background: '#BFBFBF',
              }}>
              <p>{t('connect_metamask.button')}</p>
            </div>
          </>
        ) : (
          <>
            <div className="modal__connect__content">
              <p>{t('modal.connect_wallet.content')}</p>
            </div>
            <div
              className={`modal__button`}
              onClick={() => {
                window.ethereum?.isMetaMask
                  ? activate(InjectedConnector).then(() => {
                      window.sessionStorage.setItem('@connect', 'true');
                      onClose();
                    })
                  : window.open('https://metamask.io/download.html');
              }}>
              <p>
                {window.ethereum?.isMetaMask
                  ? t('modal.connect_wallet.button')
                  : t('navigation.install_metamask')}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ConnectWalletModal;
