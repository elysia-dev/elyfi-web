import { useContext, useState } from 'react';
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
  const selectAttribute = [
    'Empty',
    'Settled',
    'Confirmed',
    'Collateralized',
    'Matured',
    'Redeemed',
    'Not_performed'
  ]
  const [select, setSelect] = useState("")

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
            <p className="portfolio__asset-allocation__title bold">Portfolio Asset Components</p>
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
                <p>Mortgage Loans</p>
              </div>
              <div>
                <div />
                <p>Auction Balance Loans</p>
              </div>
              <div>
                <div />
                <p>Short-term loans with charter returns</p>
              </div>
            </div>
          </div>
        </div>
        <div className="portfolio__asset-list__container">
          <div className="portfolio__asset-list__title__wrapper">
            <p className="portfolio__asset-list__title bold">Portolio List</p>
            <hr className="portfolio__asset-list__title__line" />
            {/* <div className="portfolio__asset-list__title__button">
              <p>Lending</p>
              To do // Repayment Complete
              'Empty',
              'Settled',
              'Confirmed',
              'Collateralized',
              'Matured',
              'Redeemed',
              'Not_performed',
              <select value={this.state.value} onChange={this.handleChange}>
                <option value="grapefruit">Grapefruit</option>
                <option value="lime">Lime</option>
                <option value="coconut">Coconut</option>
                <option value="mango">Mango</option>
              </select>
            </div> */}
          </div>
          <div className="portfolio__asset-list__info__container">
            {data?.assetBondTokens.map((abToken, index) => {
              return (
                <AssetList
                  key={index}
                  abToken={abToken}
                  onClick={() => {
                    history.push({
                      pathname: `/portfolio/${abToken.id}`,
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