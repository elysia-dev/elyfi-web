import ServiceBackground from 'src/assets/images/service-background.png';
import 'src/stylesheets/style.scss';
import Logo from 'src/assets/images/ELYFI.png';
import { useTranslation } from 'react-i18next';

const LinkageInstitution = () => {
  const { t } = useTranslation();
  return (
    <>
      <section className="dashboard main" style={{ backgroundImage: `url(${ServiceBackground})` }}>
        <div className="main__title-wrapper">
          <h2 className="main__title-text">{t("navigation.partners")}</h2>
        </div>
      </section>
      <section className="linkage">
        <div className="linkage__title-line">
          <p className="bold">{t("partners.collateral_provider")}</p>
          <hr />
        </div>
        <div className="linkage__collateral__providers__container">
          <div className="linkage__logo__wrapper">
            <img className="linkage__logo" src={Logo} alt="Logo" />
          </div>
          <div className="linkage__collateral__providers">
            <p className="linkage__collateral__providers__title bold">
              주식회사 엘리파이대부
            </p>
            <p className="linkage__collateral__providers__content">
              {t("partners.license_number")}: 115-88-01240
            </p>
            <p className="linkage__collateral__providers__link">
              {t("partners.website")}: -
            </p>
          </div>
        </div>
        <div className="linkage__status__title">
          <p className="bold">{t("partners.borrow_status")}</p>
        </div>
        <div className="linkage__status__container">
          <div className="linkage__status__wrapper">
            <div className="linkage__status">
              <p>{t("partners.collateral_provider_deposit")}</p>
              <p>{t("partners.collateral_provider_deposit--content")}</p>
            </div>
            <p className="linkage__status__value">-</p>
          </div>
          <div className="linkage__status__wrapper">
            <div className="linkage__status">
              <p>{t("partners.borrow_limit")}</p>
              <p>{t("partners.borrow_limit--content")}</p>
            </div>
            <p className="linkage__status__value">-</p>
          </div>
          <div className="linkage__status__wrapper">
            <div className="linkage__status">
              <p>{t("partners.borrowed")}</p>
              <p>{t("partners.borrowed--content")}</p>
            </div>
            <p className="linkage__status__value">-</p>
          </div>
          <div className="linkage__status__wrapper">
            <div className="linkage__status">
              <p>{t("partners.limit_used")}</p>
              <p>{t("partners.limit_used--content")}</p>
            </div>
            <p className="linkage__status__value">- %</p>
          </div>
          <div className="linkage__status__wrapper">
            <div className="linkage__status">
              <p>{t("partners.available_borrow_limit")}</p>
              <p>{t("partners.available_borrow_limit--content ")}</p>
            </div>
            <p className="linkage__status__value">-</p>
          </div>
        </div>
        {/* <div className="linkage__service__container">
          <div className="linkage__title-line">
            <p className="bold">Legal Service Provider</p>
            <hr />
          </div>
        </div>
        <div className="linkage__legal__providers__container">
          <div className="linkage__google-map__wrapper">
            <GoogleMapReact
              bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAP_API_KEY! }}
              defaultCenter={{
                lat: defaultLat,
                lng: defaultLng,
              }}
              
              defaultZoom={10}
            />
          </div>
          <div className="linkage__legal__providers">
            <p className="linkage__legal__providers__title bold">
              (주) 비스컴퍼니
            </p>
            <p className="linkage__legal__providers__content">
              이런 저런 설명이 들어갑니다.
            </p>
            <p className="linkage__legal__providers__link">
              https://beescompany.co.kr
            </p>
          </div>
        </div> */}
      </section>
    </>
  )
}
export default LinkageInstitution;