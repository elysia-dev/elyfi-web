import { useWeb3React } from '@web3-react/core';
import { Trans, useTranslation } from 'react-i18next';
import Questionmark from 'src/components/Questionmark';
import MainnetType from 'src/enums/MainnetType';

interface Props {
  onButtonClick: () => void;
  purchasedNFT: number;
  mainnetType: MainnetType;
}

const Header: React.FC<Props> = ({
  onButtonClick,
  purchasedNFT,
  mainnetType,
}) => {
  const { t } = useTranslation();
  const { account } = useWeb3React();

  const currentPurchaseAmount = () => {
    return account === undefined
      ? t('nftMarket.purchaseStatus.walletConnect')
      : mainnetType === MainnetType.Ethereum
      ? purchasedNFT === 0
        ? t('nftMarket.purchaseStatus.nullPurchase')
        : purchasedNFT
      : '이더리움 네트워크로 변경해주세요.';
  };

  return (
    <>
      <div>
        <h1>{t('nftMarket.title')}</h1>
        <p>{t('nftMarket.subTitle')}</p>
      </div>
      <section>
        <div>
          <b>
            {t('nftMarket.myPurchase')}
            <span>
              <Questionmark
                content={
                  <Trans i18nKey={'nftMarket.myPurchaseInfo'}>
                    text
                    <u>
                      <a
                        target="_blank"
                        href="https://etherscan.io/"
                        style={{ color: '#00bfff' }}>
                        link
                      </a>
                    </u>
                  </Trans>
                }
              />
            </span>
          </b>
          <button onClick={() => onButtonClick()}>
            {t('nftMarket.purchase')}
          </button>
        </div>
        <b>{currentPurchaseAmount()}</b>
      </section>
    </>
  );
};

export default Header;
