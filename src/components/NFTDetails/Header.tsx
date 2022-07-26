import { useWeb3React } from '@web3-react/core';
import { Trans, useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import { Link, useParams } from 'react-router-dom';
import Questionmark from 'src/components/Questionmark';
import MainnetType from 'src/enums/MainnetType';
import NewTab from 'src/assets/images/market/new_tab--button.svg';

interface Props {
  onButtonClick: () => void;
  onRewardButtonClick: () => void;
  purchasedNFT?: number;
  isDisabled: boolean;
  mainnetType: MainnetType;
  openseaLink: string;
}

const Header: React.FC<Props> = ({
  onButtonClick,
  purchasedNFT,
  isDisabled,
  mainnetType,
  openseaLink,
  onRewardButtonClick,
}) => {
  const { t } = useTranslation();
  const { account } = useWeb3React();
  const { lng } = useParams<{ lng: string }>();

  const currentPurchaseAmount = () => {
    return account === undefined ? (
      t('nftMarket.purchaseStatus.walletConnect')
    ) : mainnetType === MainnetType.Ethereum ? (
      purchasedNFT !== undefined ? (
        purchasedNFT === 0 ? (
          t('nftMarket.purchaseStatus.nullPurchase')
        ) : (
          `${purchasedNFT} NFT(s)`
        )
      ) : (
        <Skeleton width={100} height={24} />
      )
    ) : (
      t('nftMarket.purchaseStatus.invalidNetwork')
    );
  };

  const AnchorLinkComponent = (): JSX.Element => {
    return (
      <a href={openseaLink} target="_blank">
        {t('nftMarket.tradeOnOpensea')}{' '}
        <img src={NewTab} alt="New tab link icon" />
      </a>
    );
  };

  const ButtonComponent = (): JSX.Element => {
    return (
      <button onClick={onButtonClick} className={isDisabled ? '' : 'disabled'}>
        {t('nftMarket.purchase')}
      </button>
    );
  };
  const RewardComponent = (): JSX.Element => {
    return (
      <button
        onClick={onRewardButtonClick}
        className={isDisabled ? '' : 'disabled'}>
        수령하기
      </button>
    );
  };

  return (
    <>
      <Link
        className="nft-details__guide mobile-only"
        to={{
          pathname: `/${lng}/market/guide`,
        }}>
        {t('nftMarket.guide')}
      </Link>
      <article>
        <section className="nft-details__current-nfts__expected-reward">
          <div>
            <b>
              나의 예상수익금
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
          </div>
          <section>
            <b>{currentPurchaseAmount()}</b>
            <section>
              <RewardComponent />
            </section>
          </section>
        </section>
        <section className="nft-details__current-nfts__holds">
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
          </div>
          <section>
            <b>{currentPurchaseAmount()}</b>
            <section>
              <AnchorLinkComponent />
              <ButtonComponent />
            </section>
          </section>
        </section>
      </article>
    </>
  );
};

export default Header;
