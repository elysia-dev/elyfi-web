import { useContext } from 'react';
import InvestmentStatus from 'src/components/InvestmentStatus';
import PieChart from 'src/utiles/PieChart';
import AssetList from 'src/components/AssetList';
import { useHistory } from 'react-router-dom';
import ServiceBackground from 'src/assets/images/service-background.png'
import { useQuery } from '@apollo/client';
import { GetAllAssetBonds } from 'src/queries/__generated__/GetAllAssetBonds';
import { GET_ALL_ASSET_BONDS } from 'src/queries/assetBondQueries';
import ReservesContext from 'src/contexts/ReservesContext';
import ErrorPage from 'src/components/ErrorPage';

const Portfolio = () => {
  const { reserves } = useContext(ReservesContext);
  const {
    loading,
    data,
    error,
  } = useQuery<GetAllAssetBonds>(
    GET_ALL_ASSET_BONDS,
  )
  let history = useHistory();

  if (error) return (<ErrorPage />)

  return (
    <div className="elysia--pc">
      <section className="main" style={{ backgroundImage: `url(${ServiceBackground})` }}>
        <div className="main__title-wrapper">
          <h1 className="main__title-text">PORTFOLIO</h1>
        </div>
      </section>
      <div className="portfolio">
        <div className="portfolio__container">
          <InvestmentStatus
            loading={loading}
            reserve={reserves[0]}
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
            <hr className="portfolio__asset-list__title__line" />
            <div className="portfolio__asset-list__title__button">
              <p>Repayment Completed</p>
            </div>
          </div>
          <div className="portfolio__asset-list__info__container">
            {data?.assetBondTokens.map((abToken, index) => {
              return (
                <AssetList
                  key={index}
                  abToken={abToken}
                  onClick={() => {
                    history.push({
                      pathname: "asset_detail",
                    })
                  }}
                />
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Portfolio;