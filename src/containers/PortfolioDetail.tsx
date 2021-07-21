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
import isLng from 'src/utiles/isLng';
import isLat from 'src/utiles/isLat';
import { useEffect } from 'react';
import { useState } from 'react';
import reverseGeocoding from 'src/utiles/reverseGeocoding';
import { useContext } from 'react';
import LanguageContext from 'src/contexts/LanguageContext';
import LanguageType from 'src/enums/LanguageType';
import CollateralLogo from 'src/assets/images/ELYFI.png';
import { Title } from 'src/components/Texts';

import PortfolioInfoKor from 'src/assets/images/portfolio_info--kor.png';
import PortfolioInfoEng from 'src/assets/images/portfolio_info--eng.png';
import PortfolioInfoCha from 'src/assets/images/portfolio_info--cha.png';


const PortfolioDetail: FunctionComponent = () => {
  const { id } = useParams<{ id: string }>();
  const {
    loading,
    data,
    error,
  } = useQuery<GetAllAssetBonds>(
    GET_ALL_ASSET_BONDS,
  )

  const { t, i18n } = useTranslation();
  const { language } = useContext(LanguageContext);
  const abToken = data?.assetBondTokens.find((ab) => ab.id === id);
  const parsedTokenId = useMemo(() => { return parseTokenId(abToken?.id) }, [abToken]);
  const lat = parsedTokenId.collateralLatitude / 100000 || 37.3674541706433;
  const lng = parsedTokenId.collateralLongitude / 100000 || 126.64780198475671;
  const [address, setAddress] = useState('-');
  const [mouseHover, setMouseHover] = useState(0);

  const loadAddress = async (lat: number, lng: number, language: LanguageType) => {
    setAddress(
      await reverseGeocoding(lat, lng, language)
    )
  }

  useEffect(() => {
    if (!isLat(lat) || !isLng(lng)) return

    loadAddress(lat, lng, language);
  }, [lat, lng, language])

  if (error) return (<ErrorPage />)

  const AddressCopy = (add: string | undefined) => {
    if (!document.queryCommandSupported("copy")) {
      return alert("This browser does not support the copy function.");
    }
    if (add === undefined) {
      return alert("There was a problem reading the ABToken.");
    } else {
      const area = document.createElement('textarea');
      area.value = add;
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      document.body.removeChild(area);
      alert("Copied!!");
    }
  }

  return (
    <section id="portfolio">
      <section className="main" style={{ backgroundImage: `url(${ServiceBackground})` }}>
        <div className="main__title-wrapper">
          <h1 className="main__title-text">{t("navigation.portfolio")}</h1>
        </div>
      </section>
      <div className="portfolio__info">
        <Title label={t("portfolio.asset_detail")} style={{ marginTop: 100 }} />
        {
          loading ? <Skeleton height={900} /> :
            <div className="portfolio__info__container">
              <div className="portfolio__info__collateral">
                <div>
                  <img src={CollateralLogo} />
                </div>
                <table>
                  <tr>
                    <td colSpan={2}>
                      <p className="bold">
                        {t("portfolio.borrower_info")}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p>
                        {t("portfolio.borrower--loan")}
                      </p>
                    </td>
                    <td>
                      <p>
                        Elyloan Corp
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p>
                        {t("portfolio.license_number")}
                      </p>
                    </td>
                    <td>
                      <p>
                        110-88-01240
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p>
                        {t("portfolio.wallet_address")}
                      </p>
                    </td>
                    <td>
                      <p>
                        0x21..4K9
                      </p>
                    </td>
                  </tr>
                </table>
              </div>
              <table className="portfolio__info__table portfolio-loan-table" style={{ height: 360 }}>
                <tr>
                  <td className="portfolio__info__table__title">
                    <p>
                      {t("portfolio.loan_number--table")}
                    </p>
                    <p className="portfolio__info__popup"
                      onMouseEnter={() => { setMouseHover(1) }}
                      onMouseLeave={() => { setMouseHover(0) }}
                    >?</p>
                    <p className="portfolio__info__popup__showing"
                      style={{ display: mouseHover === 1 ? "block" : 'none' }}
                    >
                      {t("portfolio.infomation_popup.0")}
                    </p>
                  </td>
                  <td colSpan={2}>
                    <p className="spoqa__bold">
                      {parsedTokenId.nonce}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td className="portfolio__info__table__title">
                    <p>
                      {t("portfolio.loan_status")}
                    </p>
                    <p className="portfolio__info__popup"
                      onMouseEnter={() => { setMouseHover(2) }}
                      onMouseLeave={() => { setMouseHover(0) }}
                    >?</p>
                    <p className="portfolio__info__popup__showing"
                      style={{ display: mouseHover === 2 ? "block" : 'none' }}
                    >
                      <p className="bold">{t("portfolio.infomation_popup.1")}</p>
                      <p>- {t("portfolio.infomation_popup.2")}</p>
                      <br />
                      <p className="bold">{t("portfolio.infomation_popup.3")}</p>
                      <p>- {t("portfolio.infomation_popup.4")}</p>
                      <br />
                      <p className="bold">{t("portfolio.infomation_popup.5")}</p>
                      <p>- {t("portfolio.infomation_popup.6")}</p>
                    </p>
                  </td>
                  <td colSpan={2}>
                    <p className="spoqa__bold">
                      {
                        t(`words.${LoanStatus[toLoanStatus(abToken?.state as ABTokenState)]}`)
                      }
                    </p>
                  </td>
                </tr>
                <tr>
                  <td className="portfolio__info__table__title">
                    <p>
                      {t("portfolio.receiving_address")}
                    </p>
                  </td>
                  <td colSpan={2}>
                    <p className="spoqa__bold">
                      {
                        abToken?.borrower?.id || '-'
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
                    <p className="spoqa__bold">
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
                    <p className="spoqa__bold">
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
                    <p className="spoqa__bold">
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
                    <p className="spoqa__bold">
                      {abToken?.maturityTimestamp ? moment(abToken?.maturityTimestamp * 1000).format('YYYY.MM.DD') : '-'} </p>
                  </td>
                </tr>
                <tr>
                  <td className="portfolio__info__table__title">
                    <p>
                      {t("portfolio.collateral_nft")}
                    </p>
                    <p className="portfolio__info__popup"
                      onMouseEnter={() => { setMouseHover(3) }}
                      onMouseLeave={() => { setMouseHover(0) }}
                    >?</p>
                    <p className="portfolio__info__popup__showing"
                      style={{
                        display: mouseHover === 3 ? "block" : 'none',
                        top: 60
                      }}
                    >
                      {t("portfolio.infomation_popup.7")}
                    </p>
                  </td>
                  <td colSpan={2} style={{ height: 80 }}>
                    <p className="spoqa__bold">
                      ABToken ID
                    </p>
                    <p title={abToken?.id} style={{ color: "#00A7FF", cursor: "pointer", marginTop: 5 }} onClick={() => AddressCopy(abToken?.id)}>
                      {abToken?.id.slice(0, 12)} ... {abToken?.id.slice(-12)}
                    </p>
                  </td>
                </tr>
              </table>
            </div>
        }
        <div className="portfolio__info__details">
          <Title label={t("portfolio.nft_details")} />
          <div className="portfolio__info__details__content">
            <b className="spoqa__bold">{t("portfolio.abtoken_title")}</b>
            <p>
              {t("portfolio.abtoken_content")}
            </p>
            <div className="portfolio__info__details__image">
              {
                i18n.language === LanguageType.KO ?
                  <img src={PortfolioInfoKor} />
                  :
                  i18n.language === LanguageType.ZHHANS ?
                    <img src={PortfolioInfoCha} />
                    :
                    <img src={PortfolioInfoEng} />
              }
            </div>
          </div>
        </div>
        <div>
          <b className="spoqa__bold">
            {t("portfolio.abtoken_details")}
          </b>
          <div className="portfolio__info__abtoken-info">
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
                      <p title={abToken?.id} style={{ color: "#00A7FF", cursor: "pointer" }} onClick={() => AddressCopy(abToken?.id)} className="spoqa__bold">
                        {abToken?.id.slice(0, 12)} ... {abToken?.id.slice(-12)}
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
                      <p className="spoqa__bold">
                        Elyloan Corp
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td className="portfolio__info__table__title">
                      <p>
                        {t("portfolio.loan_product")}
                      </p>
                      <p className="portfolio__info__popup"
                        onMouseEnter={() => { setMouseHover(4) }}
                        onMouseLeave={() => { setMouseHover(0) }}
                      >?</p>
                      <p className="portfolio__info__popup__showing"
                        style={{ display: mouseHover === 4 ? "block" : 'none' }}
                      >
                        {t("portfolio.infomation_popup.8")}
                      </p>
                    </td>
                    <td colSpan={2}>
                      <p className="spoqa__bold">
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
                      <p className="spoqa__bold">
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
                      <p className="spoqa__bold">
                        {toPercent(abToken?.interestRate || '0')}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td className="portfolio__info__table__title">
                      <p>
                        {t('portfolio.overdue_interest_rate')}
                      </p>
                    </td>
                    <td colSpan={2}>
                      <p className="spoqa__bold">
                        {toPercent(abToken?.delinquencyRate || '0')}
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
                      <p className="spoqa__bold">
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
                      <p className="spoqa__bold">
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
                      <p className="spoqa__bold">
                        {daiToUsd(abToken?.debtCeiling || '0')}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td className="portfolio__info__table__title">
                      <p>
                        {t("portfolio.collateral_type")}
                      </p>
                      <p className="portfolio__info__popup"
                        onMouseEnter={() => { setMouseHover(5) }}
                        onMouseLeave={() => { setMouseHover(0) }}
                      >?</p>
                      <p className="portfolio__info__popup__showing"
                        style={{ display: mouseHover === 5 ? "block" : 'none' }}
                      >
                        {t("portfolio.infomation_popup.9")}
                      </p>
                    </td>
                    <td colSpan={2}>
                      <p className="spoqa__bold">
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
                      <p className="spoqa__bold">
                        {address}
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
                      <p className="spoqa__bold">
                        {abToken?.ipfsHash || '-'}
                      </p>
                    </td>
                  </tr>
                </table>
            }
          </div>
        </div>
      </div>
    </section >
  );
}

export default PortfolioDetail;