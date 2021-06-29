import ServiceBackground from 'src/assets/images/service-background.png';
import 'src/stylesheets/style.scss';

const LinkageInstitution = () => {

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
          <iframe 
            style={{
              width: 287, height: 287, border: 0, borderRadius: 5
            }}
            title="Map"
            src={"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1620699.5027926632!2d126.25985618515162!3d37.49780551845179!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3564be80a579fa1d%3A0xd03511f6c7ffaae7!2z7LaU64W4!5e0!3m2!1sko!2skr!4v1624956237170!5m2!1sko!2skr"}
          />
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
          <iframe 
            style={{
              width: 287, height: 287, border: 0, borderRadius: 5
            }}
            title="Map"
            src={"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1620699.5027926632!2d126.25985618515162!3d37.49780551845179!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3564be80a579fa1d%3A0xd03511f6c7ffaae7!2z7LaU64W4!5e0!3m2!1sko!2skr!4v1624956237170!5m2!1sko!2skr"}
          />
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