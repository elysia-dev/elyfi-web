// import { useTranslation } from 'react-i18next';
import { FunctionComponent } from 'react';
import { useParams } from 'react-router-dom';
import { StaticGoogleMap, Marker, Path } from 'react-static-google-map';
import { GetAllAssetBonds } from 'src/queries/__generated__/GetAllAssetBonds';
import ErrorPage from 'src/components/ErrorPage';
import { useQuery } from '@apollo/client';
import { GET_ALL_ASSET_BONDS } from 'src/queries/assetBondQueries';
import { parseTokenId } from 'src/utiles/parseTokenId';
import { daiToUsd, toPercent } from 'src/utiles/formatters';
import moment from 'moment';
import ABTokenState from 'src/enums/ABTokenState';
import Loading from 'src/components/Loading';

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

  return (
    <section id="portfolio">
      <div className="portfolio__info">
        <div className="portfolio__asset-list__title__wrapper" style={{ marginTop: 100 }}>
          <p className="portfolio__asset-list__title bold">Asset Detail</p>
          <hr className="portfolio__asset-list__title__line" />
        </div>
        <table className="portfolio__info__table">
          <tr>
            <td className="portfolio__info__table__title">
              <p>
                대출 번호
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
                대출 상태
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
                차입자
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
                차입자 주소
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
                대출금 수취인
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
                대출금
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
                대출 이자율 | 연체 이자율
              </p>
            </td>
            <td colSpan={2}>
              <p>
                {`${toPercent(abToken?.interestRate || '0')} | ${toPercent(abToken?.overdueInterestRate || '0')}`}
              </p>
            </td>
          </tr>
          <tr>
            <td className="portfolio__info__table__title">
              <p>
                대출일
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
                만기일
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
            <td rowSpan={9} className="portfolio__info__table__title--last">
              <p>
                담보물 정보
              </p>
            </td>
            <td className="portfolio__info__table__title--second">
              <p>
                대출 상품
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
                채권최고액
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
                담보 유형
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
                담보물 주소
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
                계약서 이미지
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
      <StaticGoogleMap size="600x600" apiKey="AIzaSyDoZyTjSHKbfP217yeEvWZhuH8p9DGC9m8">
        <Marker
          location={{ lat: 40.737102, lng: -73.990318 }}
          color="blue"
          label="P"
        />
        <Path
          points={[
            '40.737102,-73.990318',
            '40.749825,-73.987963',
            '40.752946,-73.987384',
            '40.755823,-73.986397',
          ]}
        />
      </StaticGoogleMap>
    </section>
  );
}

export default AssetDetail;