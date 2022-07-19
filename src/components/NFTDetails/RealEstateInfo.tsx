import { useTranslation } from 'react-i18next';
import YouTube from 'react-youtube';
import Location from 'src/assets/images/market/location.svg';
import BondAsset from 'src/assets/images/market/bondAssets.png';

interface Props {
  youtubeLink: string;
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
  assetFeature: {
    title: string[];
    content: string[];
    image: string[];
  };
  aroundAssetInfo: {
    title: string;
    image: string;
    price: string;
    completion: string;
    landArea: string;
  }[];
}

const RealEstateInfo: React.FC<Props> = (props) => {
  const { t } = useTranslation();

  return (
    <>
      <YouTube
        videoId={props.youtubeLink}
        iframeClassName={'nft-details__borrower__youtube'}
      />
      <table className="nft-details__real-estate-info__table">
        <tr>
          <th>
            <b>{t('nftMarket.realEstateInfoTable.0')}</b>
          </th>
          <td colSpan={3}>
            <div>
              <a target="_blank" href={props.tableInfo.locationLink}>
                <img src={Location} alt={'Location link'} />
              </a>
              <p>{props.tableInfo.location}</p>
            </div>
          </td>
        </tr>
        <tr>
          <th>
            <b>{t('nftMarket.realEstateInfoTable.1')}</b>
          </th>
          <td>
            <p>{props.tableInfo.assetType}</p>
          </td>
          <th>
            <b>{t('nftMarket.realEstateInfoTable.2')}</b>
          </th>
          <td>
            <p>{props.tableInfo.landArea}</p>
          </td>
        </tr>
        <tr>
          <th>
            <b>{t('nftMarket.realEstateInfoTable.3')}</b>
          </th>
          <td>
            <p>{props.tableInfo.yearOfRemodeling}</p>
          </td>
          <th>
            <b>{t('nftMarket.realEstateInfoTable.4')}</b>
          </th>
          <td>
            <p>{props.tableInfo.buildingArea}</p>
          </td>
        </tr>
        <tr>
          <th>
            <b>{t('nftMarket.realEstateInfoTable.5')}</b>
          </th>
          <td>
            <p>{props.tableInfo.floor}</p>
          </td>
          <th>
            <b>{t('nftMarket.realEstateInfoTable.6')}</b>
          </th>
          <td>
            <p>{props.tableInfo.estimatedSalesPrice}</p>
          </td>
        </tr>
      </table>
      <section className="nft-details__real-estate-info__asset-feature">
        <h2>부동산 특징</h2>
        <div>
          <section>
            <img src={props.assetFeature.image[0]} />
            <div>
              <figure>
                <img src={props.assetFeature.image[0]} />
              </figure>
              <figure className="disable">
                <img src={props.assetFeature.image[1]} />
              </figure>
              <figure className="disable">
                <img src={props.assetFeature.image[2]} />
              </figure>
            </div>
          </section>
          <section>
            {Array(props.assetFeature.title.length)
              .fill(0)
              .map((_x, index) => {
                return (
                  <div key={index}>
                    <b>0{index + 1}</b>
                    <div>
                      <b>{props.assetFeature.title[index]}</b>
                      <p>{props.assetFeature.content[index]}</p>
                    </div>
                  </div>
                );
              })}
          </section>
        </div>
      </section>
      <section className="nft-details__real-estate-info__around-asset">
        <h2>주변 부동산 시세</h2>
        <p>
          해당 부동산 위치에서 차로 20분 이내의 거리에 있고 유사 면적을 가진
          주택의 최신 매매가입니다.
        </p>
        <section>
          {props.aroundAssetInfo.map((data, index) => {
            return (
              <div key={index}>
                <img src={data.image} />
                <b>{data.title}</b>
                <table>
                  <tr>
                    <th>가격</th>
                    <td>{data.price}</td>
                  </tr>
                  <tr>
                    <th>준공년도</th>
                    <td>{data.completion}</td>
                  </tr>
                  <tr>
                    <th>건축면적</th>
                    <td>{data.landArea}</td>
                  </tr>
                </table>
              </div>
            );
          })}
        </section>
        <span>출처 : https://www.zillow.com/</span>
      </section>
    </>
  );
};

export default RealEstateInfo;
