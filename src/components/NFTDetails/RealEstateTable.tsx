import { useTranslation } from 'react-i18next';
import Location from 'src/assets/images/market/location.svg';

interface Props {
  tableInfo: {
    location: string;
    locationLink: string;
    assetType: string;
    landArea: string;
    yearOfRemodeling: string;
    buildingArea: string;
    floor: string;
    estimatedSalesPrice: string;
  };
}

const RealEstateTable: React.FC<Props> = ({ tableInfo }) => {
  const { t } = useTranslation();

  return (
    <>
      <table className="nft-details__real-estate-info__table pc-only">
        <tr>
          <th>
            <b>{t('nftMarket.realEstateInfoTable.0')}</b>
          </th>
          <td colSpan={3}>
            <div>
              <a target="_blank" href={tableInfo.locationLink}>
                <img src={Location} alt={'Location link'} />
              </a>
              <p>{tableInfo.location}</p>
            </div>
          </td>
        </tr>
        <tr>
          <th>
            <b>{t('nftMarket.realEstateInfoTable.1')}</b>
          </th>
          <td>
            <p>{tableInfo.assetType}</p>
          </td>
          <th>
            <b>{t('nftMarket.realEstateInfoTable.2')}</b>
          </th>
          <td>
            <p>{tableInfo.landArea}</p>
          </td>
        </tr>
        <tr>
          <th>
            <b>{t('nftMarket.realEstateInfoTable.3')}</b>
          </th>
          <td>
            <p>{tableInfo.yearOfRemodeling}</p>
          </td>
          <th>
            <b>{t('nftMarket.realEstateInfoTable.4')}</b>
          </th>
          <td>
            <p>{tableInfo.buildingArea}</p>
          </td>
        </tr>
        <tr>
          <th>
            <b>{t('nftMarket.realEstateInfoTable.5')}</b>
          </th>
          <td>
            <p>{tableInfo.floor}</p>
          </td>
          <th>
            <b>{t('nftMarket.realEstateInfoTable.6')}</b>
          </th>
          <td>
            <p>{tableInfo.estimatedSalesPrice}</p>
          </td>
        </tr>
      </table>
      <table className="nft-details__real-estate-info__table mobile-only">
        <tr>
          <th>
            <b>{t('nftMarket.realEstateInfoTable.0')}</b>
          </th>
          <td>
            <div>
              <a target="_blank" href={tableInfo.locationLink}>
                <img src={Location} alt={'Location link'} />
              </a>
              <p>{tableInfo.location}</p>
            </div>
          </td>
        </tr>
        <tr>
          <th>
            <b>{t('nftMarket.realEstateInfoTable.1')}</b>
          </th>
          <td>
            <p>{tableInfo.assetType}</p>
          </td>
        </tr>
        <tr>
          <th>
            <b>{t('nftMarket.realEstateInfoTable.2')}</b>
          </th>
          <td>
            <p>{tableInfo.landArea}</p>
          </td>
        </tr>
        <tr>
          <th>
            <b>{t('nftMarket.realEstateInfoTable.3')}</b>
          </th>
          <td>
            <p>{tableInfo.yearOfRemodeling}</p>
          </td>
        </tr>
        <tr>
          <th>
            <b>{t('nftMarket.realEstateInfoTable.4')}</b>
          </th>
          <td>
            <p>{tableInfo.buildingArea}</p>
          </td>
        </tr>
        <tr>
          <th>
            <b>{t('nftMarket.realEstateInfoTable.5')}</b>
          </th>
          <td>
            <p>{tableInfo.floor}</p>
          </td>
        </tr>
        <tr>
          <th>
            <b>{t('nftMarket.realEstateInfoTable.6')}</b>
          </th>
          <td>
            <p>{tableInfo.estimatedSalesPrice}</p>
          </td>
        </tr>
      </table>
    </>
  );
};

export default RealEstateTable;
