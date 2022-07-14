import { useWeb3React } from '@web3-react/core';
import { Trans, useTranslation } from 'react-i18next';
import Questionmark from 'src/components/Questionmark';

interface Props {
  onButtonClick: () => void;
}

const Header: React.FC<Props> = ({ onButtonClick }) => {
  const { t } = useTranslation();
  const { account } = useWeb3React();

  const currentPurchaseAmount = () => {
    return account === undefined
      ? t('nftMarket.purchaseStatus.walletConnect')
      : t('nftMarket.purchaseStatus.nullPurchase');
  };

  return (
    <>
      <div>
        <h1>{t('nftMarket.title')}</h1>
        <p>{t('nftMarket.subTitle')}</p>
      </div>
      <section className="pc-only">
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
      <section className="mobile-only">
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
          <span>{currentPurchaseAmount()}</span>
        </div>
        <button onClick={onButtonClick}>{t('nftMarket.purchase')}</button>
      </section>
    </>
  );
};

export default Header;
