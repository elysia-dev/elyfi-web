import { useTranslation } from 'react-i18next';
import BondAsset from 'src/assets/images/market/bondAssets.png';

interface Props {
  assetName: string;
  location: string;
  buildingArea: string;
  assetType: string;
  comment: string;
}
const RealEstateInfo: React.FC<Props> = ({
  assetName,
  location,
  buildingArea,
  assetType,
  comment,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <h2>{t('nftMarket.realEstateInfo')}</h2>
      <div>
        <figure>
          <img src={BondAsset} alt="Bond Asset" />
        </figure>
        <section>
          <b>{assetName}</b>
          <table>
            <tr>
              <th>{t('nftMarket.realEstateInfoTable.0')}</th>
              <td>{location}</td>
            </tr>
            <tr>
              <th>{t('nftMarket.realEstateInfoTable.1')}</th>
              <td>{buildingArea}</td>
            </tr>
            <tr>
              <th>{t('nftMarket.realEstateInfoTable.2')}</th>
              <td>{assetType}</td>
            </tr>
            <tr>
              <th>{t('nftMarket.realEstateInfoTable.3')}</th>
              <td>{comment}</td>
            </tr>
          </table>
        </section>
      </div>
    </>
  );
};

export default RealEstateInfo;
