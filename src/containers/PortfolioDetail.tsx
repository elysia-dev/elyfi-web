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
import PortfolioInfo from 'src/assets/images/portfolio_info.png';

interface ipfsType {
  image: string;
  description: string;
  document: string[];
  address: {
    addressLine: string;
    city: string;
    "state/province/region": string;
    country: string;
  }
}

const PortfolioDetail: FunctionComponent = () => {
  const { id } = useParams<{ id: string }>();
  const {
    loading,
    data,
    error,
  } = useQuery<GetAllAssetBonds>(
    GET_ALL_ASSET_BONDS,
  )
  // fetch('https://slate.host/api/v2/get', {
  //   method: 'GET',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     Authorization: 'Basic SLAb45f7723-dba0-400d-827f-53c2e27e8c58TE',
  //   }
  // })
  // .then((response) => console.log("response:", response))
  // .catch((error) => console.log("error:", error));

  const { t } = useTranslation();
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
        <Title label={t("portfolio.asset_detail")}  style={{ marginTop: 100 }} />
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
                      차입자 정보
                    </p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p>
                      차입자
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
                      사업자 등록번호
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
                      지갑주소
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
                    style={{ display: mouseHover === 1 ? "block" : 'none'}}
                  >
                    엘리파이 머니풀에서 대출 발생 시 표기되는 번호를 의미합니다.
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
                    style={{ display: mouseHover === 2 ? "block" : 'none'}}
                  >
                    <p className="bold">To be repaid</p>
                    <p>- 상환 예정인 대출</p>
                    <br />
                    <p className="bold">Liquidation in progress</p>
                    <p>- 만기일 이후 유예기간(10일)까지 상환하지 못한 대출</p>
                    <br />
                    <p className="bold">Repayment Completed</p>
                    <p>- 상환 완료되어 대출 관계가 종료된 대출</p>
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
                    대출금 수취 계좌
                  </p>
                </td>
                <td colSpan={2}>
                  <p className="spoqa__bold">
                    여기에 정보를 입력해야 해요.
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
                    엘리파이 머니풀에서 대출 받기 위해 담보 맡긴 대체 불가능한 토큰(NFT)을 의미합니다.
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
            <Title label={"담보 NFT 정보"} />
            <div className="portfolio__info__details__content">
              <b className="spoqa__bold">ABToken이란?</b>
              <p>
                ABToken 은 담보법인인 Elyloan Corp와 부동산 소유주 간의 대출 계약에서 형성된 대출 채권을 기반으로 발행된 대체 불가능한 토큰(NFT) 입니다.<br/>
                ABToken 소유자는 해당 채권과 1대 1로 교환할 수 있으며, 엘리파이에서 해당 토큰을 담보로 가상자산을 대출할 수 있습니다.
              </p>
              <div className="portfolio__info__details__image">
                <img src={PortfolioInfo} />
              </div>
            </div>
          </div>
          <div>
            <b className="spoqa__bold">
              ABToken 상세정보
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
                    <p title={abToken?.id} style={{ color: "#00A7FF", cursor: "pointer" }} onClick={() => AddressCopy(abToken?.id)}>
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
                    <p>
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
                      style={{ display: mouseHover === 4 ? "block" : 'none'}}
                    >
                      담보법인과 부동산 소유주간의 계약에서의 대출 상품(주택담보대출 등)을 의미합니다.
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
                    <p className="portfolio__info__popup"
                      onMouseEnter={() => { setMouseHover(5) }}
                      onMouseLeave={() => { setMouseHover(0) }}
                    >?</p>
                    <p className="portfolio__info__popup__showing"
                      style={{ display: mouseHover === 5 ? "block" : 'none'}}
                    >
                      담보법인과 부동산 소유주간의 대출 계약에서의 담보물(아파트 등)의 종류를 의미합니다.
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
                    <p>
                      {abToken?.ipfsHash}
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