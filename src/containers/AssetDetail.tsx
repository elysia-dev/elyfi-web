// import { useTranslation } from 'react-i18next';
import { FunctionComponent } from 'react';
import { useParams } from 'react-router-dom';
import GoogleMapReact from 'google-map-react';
import { GetAllAssetBonds } from 'src/queries/__generated__/GetAllAssetBonds';
import ErrorPage from 'src/components/ErrorPage';
import { useQuery } from '@apollo/client';
import { GET_ALL_ASSET_BONDS } from 'src/queries/assetBondQueries';
import { parseTokenId } from 'src/utiles/parseTokenId';
import { daiToUsd, toPercent } from 'src/utiles/formatters';
import moment from 'moment';
import ABTokenState from 'src/enums/ABTokenState';
import ServiceBackground from 'src/assets/images/service-background.png'

const AssetDetail: FunctionComponent = () => {
  const { id } = useParams<{ id: string }>();
  const {
    loading,
    data,
    error,
  } = useQuery<GetAllAssetBonds>(
    GET_ALL_ASSET_BONDS,
  )

  const abToken = data?.assetBondTokens.find((ab) => ab.id === id);

  if (error || (!abToken && !loading)) return (<ErrorPage />)

  const parsedTokenId = parseTokenId(abToken?.id || '');

  const mapLat = 37.3674541706433;
  const mapLng = 126.64780198475671;

  return (
    <section id="portfolio">
      <section className="main" style={{ backgroundImage: `url(${ServiceBackground})` }}>
        <div className="main__title-wrapper">
          <h1 className="main__title-text">PORTFOLIO</h1>
        </div>
      </section>
      <div className="portfolio__info">
        <div className="portfolio__asset-list__title__wrapper" style={{ marginTop: 100 }}>
          <p className="portfolio__asset-list__title bold">Asset Details</p>
          <hr className="portfolio__asset-list__title__line" />
        </div>
        <table className="portfolio__info__table">
          <tr>
            <td className="portfolio__info__table__title">
              <p>
                Loan Number
              </p>
            </td>
            <td colSpan={2}>
              <p>
                {parsedTokenId.nonce}
              </p>
            </td>
          </tr>
          <tr>
            <td className="portfolio__info__table__title">
              <p>
                Loan Status
              </p>
            </td>
            <td colSpan={2}>
              <p>
                {ABTokenState[(abToken?.state as ABTokenState)]}
              </p>
            </td>
          </tr>
          <tr>
            <td className="portfolio__info__table__title">
              <p>
                Borrower
              </p>
            </td>
            <td colSpan={2}>
              <p>
                {parsedTokenId.collateralServiceProviderIdentificationNumber}
              </p>
            </td>
          </tr>
          <tr>
            <td className="portfolio__info__table__title">
              <p>
                Collateral Service Provider Info
              </p>
            </td>
            <td colSpan={2}>
              <p>
                -
              </p>
            </td>
          </tr>
          <tr>
            <td className="portfolio__info__table__title">
              <p>
                Loan Receiver
              </p>
            </td>
            <td colSpan={2}>
              <p>
                {abToken?.borrower?.id}
              </p>
            </td>
          </tr>
          <tr>
            <td className="portfolio__info__table__title">
              <p>
                Borrowed
              </p>
            </td>
            <td colSpan={2}>
              <p>
                {daiToUsd(abToken?.principal || '0')}
              </p>
            </td>
          </tr>
          <tr>
            <td className="portfolio__info__table__title">
              <p>
                Borrow APY
              </p>
            </td>
            <td colSpan={2}>
              <p>
                {toPercent(abToken?.interestRate || '0')}
              </p>
            </td>
          </tr>
          <tr>
            <td className="portfolio__info__table__title">
              <p>
                Loan Date
              </p>
            </td>
            <td colSpan={2}>
              <p>
                {abToken?.loanStartTimestamp ? moment(abToken.loanStartTimestamp * 1000).format('YYYY.MM.DD') : '-'}
              </p>
            </td>
          </tr>
          <tr>
            <td className="portfolio__info__table__title">
              <p>
                Maturity Date
              </p>
            </td>
            <td colSpan={2}>
              <p>
                {abToken?.maturityTimestamp ? moment(abToken?.maturityTimestamp * 1000).format('YYYY.MM.DD') : '-'}
              </p>
            </td>
          </tr>
          <colgroup>
            <col style={{ width: 263 }} />
            <col style={{ width: 263 }} />
            <col style={{ width: "100%" }} />
          </colgroup>
          <tr>
            <td rowSpan={13} className="portfolio__info__table__title--last">
              <p>
                Collateral Infomration
              </p>
            </td>
            <td className="portfolio__info__table__title--second">
              <p>
                ABToken ID
              </p>
            </td>
            <td>
              <p>
                {'-'}
              </p>
            </td>
          </tr>
          <tr>
            <td className="portfolio__info__table__title--second">
              <p>
                Collateral Service Provider
              </p>
            </td>
            <td>
              <p>
                {'-'}
              </p>
            </td>
          </tr>
          <tr>
            <td className="portfolio__info__table__title--second">
              <p>
                Business License Number
              </p>
            </td>
            <td>
              <p>
                {'-'}
              </p>
            </td>
          </tr>
          <tr>
            <td className="portfolio__info__table__title--second">
              <p>
                Loan Product
              </p>
            </td>
            <td>
              <p>
                {parsedTokenId.collateralDetail}
              </p>
            </td>
          </tr>
          <tr>
            <td className="portfolio__info__table__title--second">
              <p>
                Loan Name
              </p>
            </td>
            <td>
              <p>
                {`-`}
              </p>
            </td>
          </tr>
          <tr>
            <td className="portfolio__info__table__title--second">
              <p>
                Loans
              </p>
            </td>
            <td>
              <p>
                {`-`}
              </p>
            </td>
          </tr>
          <tr>
            <td className="portfolio__info__table__title--second">
              <p>
                Loan Interest Rate
              </p>
            </td>
            <td>
              <p>
                {parsedTokenId.collateralDetail}
              </p>
            </td>
          </tr>
          <tr>
            <td className="portfolio__info__table__title--second">
              <p>
                Loan Date
              </p>
            </td>
            <td>
              <p>
                {parsedTokenId.collateralDetail}
              </p>
            </td>
          </tr>
          <tr>
            <td className="portfolio__info__table__title--second">
              <p>
                Maturity Date
              </p>
            </td>
            <td>
              <p>
                {parsedTokenId.collateralDetail}
              </p>
            </td>
          </tr>
          <tr>
            <td className="portfolio__info__table__title--second">
              <p>
                Maximum Pledge Amount
              </p>
            </td>
            <td>
              <p>
                {daiToUsd(abToken?.debtCeiling || '0')}
              </p>
            </td>
          </tr>
          <tr>
            <td className="portfolio__info__table__title--second">
              <p>
                Collateral Type
              </p>
            </td>
            <td>
              <p>
                {parsedTokenId.collateralCategory}
              </p>
            </td>
          </tr>
          <tr>
            <td className="portfolio__info__table__title--second">
              <p>
                Collateral Address
              </p>
            </td>
            <td>
              <p>
                {'-'}
              </p>
            </td>
          </tr>
          <tr>
            <td className="portfolio__info__table__title--second">
              <p>
                Contract Image
              </p>
            </td>
            <td>
              <p>
                {abToken?.ipfsHash}
              </p>
            </td>
          </tr>
        </table>
      </div>
      {/* To do */}
      <div className="portfolio__info__google-map__wrapper">
        <GoogleMapReact
          bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAP_API_KEY! }}
          defaultCenter={{ 
            lat: mapLat, 
            lng: mapLng 
          }}
          defaultZoom={15}
        >
        </GoogleMapReact>
      </div>
    </section>
  );
}

export default AssetDetail;