import { useWeb3React } from '@web3-react/core';
import { Trans, useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import { Link, useParams } from 'react-router-dom';
import Questionmark from 'src/components/Questionmark';
import MainnetType from 'src/enums/MainnetType';
import NewTab from 'src/assets/images/market/new_tab--button.svg';
import { formatCommaSmallZeroDisits } from 'src/utiles/formatters';

interface Props {
  onButtonClick: () => void;
  onRewardButtonClick: () => void;
  rewardTitle: string;
  purchasedNFT?: number;
  isDisabled: boolean;
  mainnetType: MainnetType;
  openseaLink: string;
  isMoneypoolCharged: boolean;
  usdcPerNft: number;
  nftInterest: number;
  inviteFriendReward: number;
}

const Header: React.FC<Props> = ({
  onButtonClick,
  purchasedNFT,
  isDisabled,
  mainnetType,
  openseaLink,
  onRewardButtonClick,
  inviteFriendReward,
  rewardTitle,
  isMoneypoolCharged,
  usdcPerNft,
  nftInterest,
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
          <>
            {formatCommaSmallZeroDisits(purchasedNFT)}
            <span> NFT(s)</span>
          </>
        )
      ) : (
        <Skeleton width={100} height={24} />
      )
    ) : (
      t('nftMarket.purchaseStatus.invalidNetwork')
    );
  };

  const currentRewardAmount = () => {
    return account === undefined ? (
      t('nftMarket.purchaseStatus.walletConnect')
    ) : mainnetType === MainnetType.Ethereum ? (
      purchasedNFT !== undefined ? (
        purchasedNFT === 0 ? (
          t('nftMarket.purchaseStatus.nullPurchase')
        ) : (
          <>
            {formatCommaSmallZeroDisits(
              purchasedNFT * (usdcPerNft + nftInterest) + inviteFriendReward,
            )}
            <span> USDC</span>
          </>
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
        className={isMoneypoolCharged ? '' : 'disabled'}>
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
              {rewardTitle}
              <span>
                <Questionmark
                  content={
                    '나의 예상 수익금은 보유한 채권 NFT로 수령할 수 있는 수익금을 나타냅니다. 상환일에 따라 이자가 변경되기 때문에 실제 수익금이 예상 수익금과 달라질 수 있습니다.'
                  }
                />
              </span>
            </b>
          </div>
          <section>
            <b>{currentRewardAmount()}</b>
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
