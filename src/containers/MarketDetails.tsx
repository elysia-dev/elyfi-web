import 'src/stylesheets/style.scss';
import ServiceBackground from 'src/assets/images/service-background.png';
import { useHistory, useParams } from 'react-router-dom';
import { useContext, useState } from 'react';
import DaiImage from 'src/assets/images/dai.png';

/* temp */
import { Circle } from 'src/utiles/Circle';
import { daiToUsd, toPercent } from 'src/utiles/formatters';
import { BigNumber } from 'ethers';
import { Chart } from "react-google-charts";

import ErrorPage from 'src/components/ErrorPage';
import ReservesContext from 'src/contexts/ReservesContext';
import { GetAllReserves_reserves_reserveHistory } from 'src/queries/__generated__/GetAllReserves';
import { useTranslation } from 'react-i18next';
import calcMiningAPR from 'src/utiles/calcMiningAPR';
import calcHistoryChartData from 'src/utiles/calcHistoryChartData';

const MarketDetail: React.FunctionComponent = () => {
  const history = useHistory();
  const [mouseHover, setMouseHover] = useState(false);
  const [graphConverter, setGraphConverter] = useState(false);
  const { reserves } = useContext(ReservesContext);
  const { id } = useParams<{ id: string }>();
  const data = reserves.find((reserve) => reserve.id === id);

  const { t } = useTranslation();

  // FIXME
  // const miningAPR = utils.parseUnits('10', 25);

  if (!data) return (<ErrorPage />)

  const miningAPR = calcMiningAPR(BigNumber.from(data.totalDeposit));
  const utilization = BigNumber.from(data.totalBorrow || '0').div(data.totalDeposit || '1').toNumber();

  return (
    <>
      <section className="market__detail main" style={{ backgroundImage: `url(${ServiceBackground})` }} />
      <div className="market__detail">
        <div className="market__detail__title-token">
          <div className="market__detail__title-token__token-wrapper">
            <img src={DaiImage} className="market__detail__title-token__token-image" alt='token' />
            <p className="market__detail__title-token__token-type bold">DAI</p>
          </div>
          <div className="market__detail__title-token__data-container">
            <div className="market__detail__title-token__data-wrapper">
              <div className="market__detail__title-token__data-wrapper--popup">
                <p>
                  {t("market.total_deposit_yield")}
                </p>
                <p
                  className="market__detail__title-token__data-wrapper--popup__icon"
                  onMouseEnter={() => { setMouseHover(true) }}
                  onMouseLeave={() => { setMouseHover(false) }}
                >
                  ?
                </p>
              </div>
              <p>
                {toPercent(BigNumber.from(data.depositAPY).add(miningAPR))}
              </p>
            </div>
            <div className="market__detail__title-token__data-wrapper">
              <p>
                {t("market.deposit_apy")}
              </p>
              <p>
                {toPercent(data.depositAPY)}
              </p>
            </div>
            <div className="market__detail__title-token__data-wrapper">
              <p>
                {t("market.mining_apr")}
              </p>
              <p>
                {toPercent(miningAPR)}
              </p>
            </div>
            <div className="market__detail__title-token__data-wrapper">
              <p>
                {t("market.borrow_apy")}
              </p>
              <p>
                {toPercent(data.borrowAPY)}
              </p>
            </div>
          </div>
          <div className="market__detail__title-token--popup" style={{ opacity: mouseHover ? 1 : 0 }}>
            <h2>
              {t("market.total_deposit_yield")}
            </h2>
            <p>
              {t("market.deposit_info")}
            </p>
          </div>
        </div>
      </div>
      <div className="market__detail__container">
        <div className="market__detail__title__wrapper">
          <p className="bold">
            {t("market.details")}
          </p>
          <hr />
        </div>
        <div className="market__detail__wrapper">
          <div className="market__detail__pie-chart__wrapper">
            <div className="market__detail__pie-chart__data__wrapper--total">
              <p className="bold">
                {t("market.total_deposit")}
              </p>
              <p className="bold">
                {daiToUsd(data.totalDeposit)}
              </p>
            </div>
            <div>
              <div className="market__detail__pie-chart__data__wrapper">
                <div className="market__detail__pie-chart__data__block__wrapper" >
                  <div className="market__detail__pie-chart__data__block"
                    style={{
                      backgroundColor: "#00A7FF"
                    }}
                  />
                  <p>
                    {t("market.total_borrowed")}
                  </p>
                </div>
                <p>
                  {daiToUsd(data.totalBorrow)}
                </p>
              </div>
              <div className="market__detail__pie-chart__data__wrapper">
                <div className="market__detail__pie-chart__data__block__wrapper" >
                  <div className="market__detail__pie-chart__data__block"
                    style={{
                      backgroundColor: "#1C5E9A"
                    }}
                  />
                  <p>
                    {t("market.available_liquidity")}
                  </p>
                </div>
                <p>
                  {daiToUsd(BigNumber.from(data.totalDeposit).sub(data.totalBorrow))}
                </p>
              </div>
            </div>
            <div className="market__detail__pie-chart">
              <Circle
                progress={100 - utilization}
                style={{
                  width: 240
                }}
              />
            </div>
            <div className="market__detail__pie-chart__data">
              <div>
                <p>
                  {t("market.utilization")}
                </p>
                <p>
                  {`${utilization}%`}
                </p>
              </div>
              <div>
                <p>
                  {t("market.depositers")}
                </p>
                <p>
                  {data.lTokenUserBalanceCount}
                </p>
              </div>
              <div>
                <p>
                  {t("market.borrowers")}
                </p>
                <p>
                  {data.dTokenUserBalanceCount}
                </p>
              </div>
            </div>
          </div>
          <div className="market__detail__graph__wrapper">
            <div className="market__detail__graph__converter__wrapper">
              <div
                className={`market__detail__graph__converter${graphConverter ? "--disable" : ""}`}
                onClick={() => setGraphConverter(false)}
              >
                <p className="bold">
                  {t("market.deposit")}
                </p>
              </div>
              <div
                className={`market__detail__graph__converter${!graphConverter ? "--disable" : ""}`}
                onClick={() => setGraphConverter(true)}
              >
                <p className="bold">
                  {t("market.borrow")}
                </p>
              </div>
            </div>
            <div className="market__detail__graph">
              <Chart
                width={'700px'}
                height={'500px'}
                chartType="ComboChart"
                loader={<div>Loading Chart</div>}
                data={[
                  [
                    'Month',
                    graphConverter ? t("market.total_borrowed") : t("market.total_deposit"),
                    { role: 'tooltip', p: { html: true } },
                    graphConverter ? t("market.borrow_apy") : t("market.total_deposit_yield"),
                    { role: 'tooltip', p: { html: true } }
                  ],
                  ...(
                    calcHistoryChartData(data, graphConverter ? "borrow" : "deposit")
                  ),
                ]}
                options={{
                  chartArea: { left: 0, top: 100, width: "100%", height: "400px" },
                  backgroundColor: "transparent",
                  tooltip: {
                    textStyle: {
                      color: '#FF0000'
                    },
                    showColorCode: true,
                    isHtml: true,
                    ignoreBounds: true
                  },
                  seriesType: 'bars',
                  bar: {
                    groupWidth: 30
                  },
                  vAxis: {
                    gridlines: {
                      count: 0
                    },
                    textPosition: 'none'
                  },
                  focusTarget: "category",
                  curveType: "function",
                  legend: { position: 'none' },
                  series: {
                    0: {
                      color: "#E6E6E6",
                    },
                    1: {
                      type: 'line',
                      color: "#1C5E9A"
                    }
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="market__detail__button" onClick={() => { history.push(`/dashboard?reserveId=${id}`) }}>
        <p>
          {t("market.button")}
        </p>
      </div>
    </>
  );
}

export default MarketDetail;