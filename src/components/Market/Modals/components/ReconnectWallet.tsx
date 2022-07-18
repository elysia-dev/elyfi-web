import { useTranslation } from 'react-i18next';
import ModalHeader from './ModalHeader';
import WalletButton from './WalletButton';
import WalletSection from './WalletSection';

interface Props {
  modalClose: () => void;
  onClickHandler: () => void;
}

const ReconnectWallet: React.FC<Props> = ({ modalClose, onClickHandler }) => {
  const { t } = useTranslation();
  return (
    <div className="market_modal">
      <div className="market_modal__wrapper">
        <ModalHeader
          title={t('nftModal.changeNetwork.0')}
          modalClose={modalClose}
        />
        <WalletSection
          content={
            <>
              <p>{t('nftModal.changeNetwork.2')}</p>
              <p>{t('nftModal.changeNetwork.3')}</p>
            </>
          }
        />
        <WalletButton
          content={t('nftModal.changeNetwork.4')}
          onClickHandler={onClickHandler}
        />
      </div>
    </div>
  );
};

export default ReconnectWallet;
