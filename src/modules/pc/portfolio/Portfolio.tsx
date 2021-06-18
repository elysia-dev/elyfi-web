import { useContext } from 'react';
import Navigation from "../component/Navigation"
import InvestmentStatus from './component/InvestmentStatus';
import PieChart from '../../../utiles/PieChart';
import AssetList from './component/AssetList';
import ServiceBackground from '../../../shared/images/service-background.png'
import AssetContext from '../../../contexts/AssetContext';

const Portfolio = () => {
  // To Do = 에셋 리스트 3개 이상이면 flex 분리하기
  const { assets, getABToken } = useContext(AssetContext);
  console.log(getABToken("0x123456789c"))

  const Main = () => {
    return (
      <>
        <div className="portfolio__container">
          <InvestmentStatus
            loan={1000}
            totalLoan={1000}
            interest={100}
            overdueInterest={100} 
            mortgageRate={0.08}
            abToken={500}
          />
          {/* loan: 대출금, totalLoan: 총 대출금, interest: 이자, overdueInterest: 연체이자, mortgageRate: 금리, abToken: 부실토큰 판매금 */}
          <div className="portfolio__asset-allocation__container">
            <p className="portfolio__asset-allocation__title bold">Asset Allocation</p>
            <div className="portfolio__chart-wrapper">
              <PieChart
                num1={40}
                num2={25}
                num3={35}
              />
            </div>
            <div className="portfolio__asset-allocation__wrapper">
              <div>
                <div />
                <p>주택담보대출</p>
              </div>
              <div>
                <div />
                <p>경매잔금대출</p>
              </div>
              <div>
                <div />
                <p>전세반환금 담보대출</p>
              </div>
            </div>
          </div>
        </div>
        <div className="portfolio__asset-list__container">
          <div className="portfolio__asset-list__title__wrapper">
            <p className="portfolio__asset-list__title bold">List of Assets</p>
            <hr className="portfolio__asset-list__title__line"/>
            <div className="portfolio__asset-list__title__button">
              <p>Repayment Completed</p>
            </div>
          </div>
          <div className="portfolio__asset-list__info__container">
            {assets.map((asset) => {
              return (
                <AssetList
                  assets={asset}
                  onClick={() => {
                    console.log("dz")
                  }}
                />
              )
            })}
          </div>
        </div>
      </>
    )
  }
  return (
    <div className="elysia--pc">
      <section className="main" style={{ backgroundImage: `url(${ServiceBackground})` }}>
        <Navigation />
        <div className="main__title-wrapper">
          <h1 className="main__title-text">PORTFOLIO</h1>
        </div>
      </section>
      <div className="portfolio">
        <Main />
      </div>
    </div>
  )
}

export default Portfolio;