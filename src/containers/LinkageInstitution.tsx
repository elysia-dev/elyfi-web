import ServiceBackground from 'src/assets/images/service-background.png';
import 'src/stylesheets/style.scss';
import GoogleMapReact from 'google-map-react';

const LinkageInstitution = () => {

  const defaultLat = 37.5172;
  const defaultLng = 127.0473;

  return (
    <>
      <section className="dashboard main" style={{ backgroundImage: `url(${ServiceBackground})` }}>
        <div className="main__title-wrapper">
          <h2 className="main__title-text">Linkage institution</h2>
        </div>
      </section>
      <section className="linkage">
        <div className="linkage__title-line">
          <p className="bold">Collateral Service Providers</p>
          <hr />
        </div>
        <div className="linkage__collateral__providers__container">
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
          <div className="linkage__collateral__providers">
            <p className="linkage__collateral__providers__title bold">
              (주) 비스컴퍼니
            </p>
            <p className="linkage__collateral__providers__content">
              이런 저런 설명이 들어갑니다.
            </p>
            <p className="linkage__collateral__providers__link">
              https://beescompany.co.kr
            </p>
          </div>
        </div>
        <div className="linkage__status__title">
          <p className="bold">Borrow Status</p>
        </div>
        <div className="linkage__status__container">
          <div className="linkage__status__wrapper">
            <div className="linkage__status">
              <p>Deposit Balance</p>
              <p>The amount of deposits to engage in financial activities in ELYSIA</p>
            </div>
            <p className="linkage__status__value">$ 1,000.00</p>
          </div>
          <div className="linkage__status__wrapper">
            <div className="linkage__status">
              <p>Borrow Limit</p>
              <p>Deposit Balance * 10</p>
            </div>
            <p className="linkage__status__value">200%</p>
          </div>
          <div className="linkage__status__wrapper">
            <div className="linkage__status">
              <p>Total Borrowings</p>
              <p>The total amount of borrowings currently in loan</p>
            </div>
            <p className="linkage__status__value">$ 1,000.00</p>
          </div>
          <div className="linkage__status__wrapper">
            <div className="linkage__status">
              <p>Deposit Balance</p>
              <p>The amount of deposits to engage in financial activities in ELYSIA</p>
            </div>
            <p className="linkage__status__value">$ 1,000.00</p>
          </div>
          <div className="linkage__status__wrapper">
            <div className="linkage__status">
              <p>Borrow Limit Used</p>
              <p>The percentage of Total Borrowings in Borrow Limit</p>
            </div>
            <p className="linkage__status__value">$ 1,000.00</p>
          </div>
          <div className="linkage__status__wrapper">
            <div className="linkage__status">
              <p>Available amount out of Borrow Limit</p>
              <p>Borrow Limit – Total Borrowings</p>
            </div>
            <p className="linkage__status__value">$ 1,000.00</p>
          </div>
        </div>
        <div className="linkage__service__container">
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
        </div>
      </section>
    </>
  )
}
export default LinkageInstitution;