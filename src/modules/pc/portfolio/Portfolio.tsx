import Navigation from "../component/Navigation"
import InvestmentStatus from './component/InvestmentStatus';
import PieChart from '../../../utiles/PieChart';
import AssetList from './component/AssetList';

const Portfolio = () => {
  // To Do = 에셋 리스트 3개 이상이면 flex 분리하기
  return (
    <div className="elysia--pc">
      <Navigation />
      <div className="portfolio">
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
                num1={20}
                num2={60}
                num3={30}
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
            <AssetList
              title={"Loan #1"}
              status={0}
              loan={1000}
              interest={12.5}
              expiration={1607110465663}
            />
            <AssetList
              title={"Loan #2"}
              status={1}
              loan={1300}
              interest={15}
              expiration={1623906828465}
            />
            <AssetList
              title={"Loan #3"}
              status={2}
              loan={4320}
              interest={1.2}
              expiration={1633906828465}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Portfolio;