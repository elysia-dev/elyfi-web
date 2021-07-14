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
import { useTranslation } from 'react-i18next';
import calcPortfolioRatio from 'src/utiles/calcPortfolioRatio';
import { useMemo } from 'react';
import { Title } from 'src/components/Texts';

const Portfolio = () => {
  const { reserves } = useContext(ReservesContext);
  const {
    loading,
    data,
    error,
  } = useQuery<GetAllAssetBonds>(
    GET_ALL_ASSET_BONDS,
  )
  const history = useHistory();
  const { t } = useTranslation();
  const ratioProduct1 = useMemo(() => {
    return calcPortfolioRatio(data?.assetBondTokens || [], 1)
  }, [data])
  const ratioProduct2 = useMemo(() => {
    return calcPortfolioRatio(data?.assetBondTokens || [], 2)
  }, [data])
  const ratioProduct3 = useMemo(() => {
    return 100 - (ratioProduct1 + ratioProduct2)
  }, [ratioProduct1, ratioProduct2])

  if (error) return (<ErrorPage />)

  return (
    <div className="elysia--pc">
      <section className="main" style={{ backgroundImage: `url(${ServiceBackground})` }}>
        <div className="main__title-wrapper">
          <h1 className="main__title-text">{t("navigation.portfolio")}</h1>
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
            <p className="portfolio__asset-allocation__title bold">{t("portfolio.portfolio_asset")}</p>
            <div className="portfolio__chart-wrapper">
              <PieChart
                num1={ratioProduct1}
                num2={ratioProduct2}
                num3={ratioProduct3}
              />
            </div>
            <div className="portfolio__asset-allocation__wrapper">
              <div>
                <div />
                <p className="spoqa">{t("portfolio.mortgage")}</p>
              </div>
              <div>
                <div />
                <p className="spoqa">{t("portfolio.auction_balance")}</p>
              </div>
              <div>
                <div />
                <p className="spoqa">{t("portfolio.charter_returns")}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="portfolio__asset-list__container">
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
          <Title label={t("portfolio.portfolio_list")} />
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