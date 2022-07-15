import { ICardType, PFType } from 'src/components/Market/index';
import TempAsset from 'src/assets/images/market/tempAssets.jpg';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NFTCard: React.FC<{ data: ICardType }> = ({ data }) => {
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation();

  return (
    <Link
      className={data.onClickLink === undefined ? 'disable' : ''}
      to={{
        pathname: `/${lng}/market/${data.onClickLink}`,
      }}>
      <section>
        <figure>
          <img
            src={data.cardImage === undefined ? TempAsset : data.cardImage}
            alt="NFT Images"
            onError={(e: any) => {
              console.log('123');
              e.target.src = TempAsset;
            }}
          />
          <figcaption
            className={data.PFType === PFType.BOND ? 'bond' : 'share'}>
            {data.PFType === PFType.BOND
              ? t('market.nftType.0')
              : t('market.nftType.1')}
          </figcaption>
        </figure>
        <div>
          <p>{data.PFType === PFType.SHARE ? 'Coming soon!' : data.Location}</p>
          <b>
            {t('market.apy')} <span>{data.APY <= 0 ? '-' : data.APY}</span>
          </b>
        </div>
        <progress value={data.currentSoldNFTs} max={data.totalNFTs} />
      </section>
    </Link>
  );
};

export default NFTCard;
