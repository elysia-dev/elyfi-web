import { useTranslation } from 'react-i18next';

interface Props {
  aroundAssetInfo: {
    title: string;
    image: string;
    price: string;
    completion: string;
    landArea: string;
  }[];
}
const RealEstateAroundAssets: React.FC<Props> = ({ aroundAssetInfo }) => {
  const { t } = useTranslation();

  return (
    <section className="nft-details__real-estate-info__around-asset">
      <h2>{t('nftMarket.aroundAsset.0')}</h2>
      <p>{t('nftMarket.aroundAsset.1')}</p>
      <section>
        {aroundAssetInfo.map((data, index) => {
          return (
            <div key={index}>
              <img src={data.image} />
              <b>{data.title}</b>
              <table>
                <tr>
                  <th>{t('nftMarket.aroundAssetTable.0')}</th>
                  <td>{data.price}</td>
                </tr>
                <tr>
                  <th>{t('nftMarket.aroundAssetTable.1')}</th>
                  <td>{data.completion}</td>
                </tr>
                <tr>
                  <th>{t('nftMarket.aroundAssetTable.2')}</th>
                  <td>{data.landArea}</td>
                </tr>
              </table>
            </div>
          );
        })}
      </section>
      <span>{t('nftMarket.source')} : https://www.zillow.com/</span>
    </section>
  );
};

export default RealEstateAroundAssets;
