// import { useTranslation } from 'react-i18next';
import { FunctionComponent, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import GoogleMapReact from 'google-map-react';
import { GetAllAssetBonds } from 'src/queries/__generated__/GetAllAssetBonds';
import ErrorPage from 'src/components/ErrorPage';
import { useQuery } from '@apollo/client';
import { GET_ALL_ASSET_BONDS } from 'src/queries/assetBondQueries';
import { parseTokenId } from 'src/utiles/parseTokenId';
import { daiToUsd, toPercent } from 'src/utiles/formatters';
import moment from 'moment';
import ServiceBackground from 'src/assets/images/service-background.png'
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import Marker from 'src/components/Marker';
import LoanProduct from 'src/enums/LoanProduct';
import CollateralCategory from 'src/enums/CollateralCategory';
import LoanStatus from 'src/enums/LoanStatus';
import toLoanStatus from 'src/utiles/toLoanStatus';
import ABTokenState from 'src/enums/ABTokenState';

const PortfolioDetail: FunctionComponent = () => {
  const { id } = useParams<{ id: string }>();
  const {
    loading,
    data,
    error,
  } = useQuery<GetAllAssetBonds>(
    GET_ALL_ASSET_BONDS,
  )

  const { t } = useTranslation();
  const abToken = data?.assetBondTokens.find((ab) => ab.id === id);
  const parsedTokenId = useMemo(() => { return parseTokenId(abToken?.id) }, [abToken]);
  const lat = parsedTokenId.collateralLatitude / 100000 || 37.3674541706433;
  const lng = parsedTokenId.collateralLongitude / 100000 || 126.64780198475671;

  if (error) return (<ErrorPage />)

  return (
    <section id="portfolio">
      <section className="main" style={{ backgroundImage: `url(${ServiceBackground})` }}>
        <div className="main__title-wrapper">
          <h1 className="main__title-text">{t("navigation.portfolio")}</h1>
        </div>
      </section>
      <div className="portfolio__info">
        <div className="portfolio__asset-list__title__wrapper" style={{ marginTop: 100 }}>
          <p className="portfolio__asset-list__title bold">{t("portfolio.asset_detail")}</p>
          <hr className="portfolio__asset-list__title__line" />
        </div>
        {
          loading ? <Skeleton height={900} /> :
            <table className="portfolio__info__table">
              <tr>
                <td className="portfolio__info__table__title">
                  <p>
                    {t("portfolio.loan_number--table")}
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
                    {t("portfolio.loan_status")}
                  </p>
                </td>
                <td colSpan={2}>
                  <p>
                    {
                      t(`words.${LoanStatus[toLoanStatus(abToken?.state as ABTokenState)]}`)
                    }
                  </p>
                </td>
              </tr>
              <tr>
                <td className="portfolio__info__table__title">
                  <p>
                    {t("portfolio.borrowed")}
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
                    {t("portfolio.loan_interest_rate")}
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
                    {t("portfolio.loan_date")}
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
                    {t("portfolio.maturity_date")}
                  </p>
                </td>
                <td colSpan={2}>
                  <p>
                    {abToken?.maturityTimestamp ? moment(abToken?.maturityTimestamp * 1000).format('YYYY.MM.DD') : '-'} </p>
                </td>
              </tr>
              <tr>
                <td className="portfolio__info__table__title">
                  <p>
                    {t("portfolio.collateral_nft")}
                  </p>
                </td>
                <td colSpan={2}>
                  <b>ABToken ID</b>
                  <p>
                    {abToken?.id}
                  </p>
                </td>
              </tr>
            </table>
        }
        {
          loading ? <Skeleton height={900} /> :
            <table className="portfolio__info__table">
              <tr>
                <td className="portfolio__info__table__title">
                  <p>
                    {t("portfolio.abtokenid")}
                  </p>
                </td>
                <td colSpan={2}>
                  <p>
                    {abToken?.id}
                  </p>
                </td>
              </tr>
              <tr>
                <td className="portfolio__info__table__title">
                  <p>
                    {t("portfolio.borrower")}
                  </p>
                </td>
                <td colSpan={2}>
                  <p>
                    (주)엘리파이대부
                  </p>
                </td>
              </tr>
              <tr>
                <td className="portfolio__info__table__title">
                  <p>
                    {t("portfolio.loan_product")}
                  </p>
                </td>
                <td colSpan={2}>
                  <p>
                    {
                      t(`words.${LoanProduct[parsedTokenId.productNumber as LoanProduct]}`)
                    }
                  </p>
                </td>
              </tr>
              <tr>
                <td className="portfolio__info__table__title">
                  <p>
                    {t("portfolio.borrowed")}
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
                    {`${t("portfolio.loan_interest_rate")} | ${t('portfolio.overdue_interest_rate')}`}
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
                    {t("portfolio.loan_date")}
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
                    {t("portfolio.maturity_date")}
                  </p>
                </td>
                <td colSpan={2}>
                  <p>
                    {abToken?.maturityTimestamp ? moment(abToken?.maturityTimestamp * 1000).format('YYYY.MM.DD') : '-'} </p>
                </td>
              </tr>
              <tr>
                <td className="portfolio__info__table__title">
                  <p>
                    {t("portfolio.maximum_amount")}
                  </p>
                </td>
                <td colSpan={2}>
                  <p>
                    {daiToUsd(abToken?.debtCeiling || '0')}
                  </p>
                </td>
              </tr>
              <tr>
                <td className="portfolio__info__table__title">
                  <p>
                    {t("portfolio.collateral_type")}
                  </p>
                </td>
                <td colSpan={2}>
                  <p>
                    {
                      t(`words.${CollateralCategory[parsedTokenId.collateralCategory as CollateralCategory]}`)
                    }
                  </p>
                </td>
              </tr>
              <tr>
                <td className="portfolio__info__table__title">
                  <p>
                    {t("portfolio.collateral_address")}
                  </p>
                </td>
                <td colSpan={2}>
                  <p>
                    {'-'}
                  </p>
                </td>
              </tr>
              <tr>
                <td className="portfolio__info__table__title">
                  <p>
                    {t("portfolio.contract_image")}
                  </p>
                </td>
                <td colSpan={2}>
                  <p>
                    {abToken?.ipfsHash}
                  </p>
                </td>
              </tr>
            </table>
        }
      </div>
      <div className="portfolio__info__google-map__wrapper">
        <GoogleMapReact
          bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAP_API_KEY! }}
          defaultCenter={{
            lat,
            lng
          }}
          defaultZoom={15}
        >
          <Marker lat={lat} lng={lng} />
        </GoogleMapReact>
      </div>
    </section >
  );
}

export default PortfolioDetail;