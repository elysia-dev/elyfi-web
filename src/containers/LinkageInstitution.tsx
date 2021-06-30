import ServiceBackground from 'src/assets/images/service-background.png';
import 'src/stylesheets/style.scss';
import Logo from 'src/assets/images/ELYFI.png';

const LinkageInstitution = () => {

  return (
    <>
      <section className="dashboard main" style={{ backgroundImage: `url(${ServiceBackground})` }}>
        <div className="main__title-wrapper">
          <h2 className="main__title-text">PARTNERS</h2>
        </div>
      </section>
      <section className="linkage">
        <div className="linkage__title-line">
          <p className="bold">Collateral Service Providers</p>
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
              Business License Number : 115-88-01240
            </p>
            <p className="linkage__collateral__providers__link">
              Website: -
            </p>
          </div>
        </div>
        <div className="linkage__status__title">
          <p className="bold">Borrow Status</p>
        </div>
        <div className="linkage__status__container">
          <div className="linkage__status__wrapper">
            <div className="linkage__status">
              <p>Collateral Service Provider Deposit</p>
              <p>Deposits by Collateral Service Providers</p>
            </div>
            <p className="linkage__status__value">-</p>
          </div>
          <div className="linkage__status__wrapper">
            <div className="linkage__status">
              <p>Borrow Limit</p>
              <p>Collateral Service Provider Deposit * 10</p>
            </div>
            <p className="linkage__status__value">-</p>
          </div>
          <div className="linkage__status__wrapper">
            <div className="linkage__status">
              <p>Borrowed</p>
              <p>Current Loan Receivable</p>
            </div>
            <p className="linkage__status__value">-</p>
          </div>
          <div className="linkage__status__wrapper">
            <div className="linkage__status">
              <p>Borrow Limit Used</p>
              <p>% of Borrowed relative to Borrow Limit</p>
            </div>
            <p className="linkage__status__value">- %</p>
          </div>
          <div className="linkage__status__wrapper">
            <div className="linkage__status">
              <p>Available Borrow Limit</p>
              <p>Borrow Limit minus Borrowed</p>
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