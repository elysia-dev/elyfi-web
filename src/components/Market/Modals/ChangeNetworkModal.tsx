import MainnetType from 'src/enums/MainnetType';
// eslint-disable-next-line import/order
import ETH from 'src/assets/images/eth_logo.svg';
import { Trans, useTranslation } from 'react-i18next';
import WalletSection from './components/WalletSection';
import WalletButton from './components/WalletButton';
import ModalHeader from './components/ModalHeader';

interface Props {
  network: MainnetType;
  modalClose: () => void;
  onClickHandler: () => void;
}

const ChangeNetworkModal: React.FC<Props> = ({
  network,
  modalClose,
  onClickHandler,
}) => {
  const { t } = useTranslation();
  return (
    <div className="market_modal" style={{ display: 'block' }}>
      <div className="market_modal__wrapper">
        <ModalHeader
          title={t('nftModal.changeNetwork.0')}
          modalClose={modalClose}
        />
        <WalletSection
          content={
            <p>
              <Trans>{t('nftModal.changeNetwork.1')}</Trans>
            </p>
          }
        />
        <WalletButton
          content="Ethereum"
          image={ETH}
          onClickHandler={onClickHandler}
        />
      </div>
    </div>
  );
};

export default ChangeNetworkModal;
