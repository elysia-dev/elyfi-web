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
import calcMiningAPR from 'src/utiles/calcMiningAPR';
import calcHistoryChartData from 'src/utiles/calcHistoryChartData';

const MarketDetail: React.FunctionComponent = () => {
  const history = useHistory();
  const [mouseHover, setMouseHover] = useState(false);
  const [graphConverter, setGraphConverter] = useState(false);
  const { reserves } = useContext(ReservesContext);
  const { id } = useParams<{ id: string }>();
  const data = reserves.find((reserve) => reserve.id === id);

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
                  Total Deposit Yield
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
                Deposit APY
              </p>
              <p>
                {toPercent(data.depositAPY)}
              </p>
            </div>
            <div className="market__detail__title-token__data-wrapper">
              <p>
                Mining APR
              </p>
              <p>
                {toPercent(miningAPR)}
              </p>
            </div>
            <div className="market__detail__title-token__data-wrapper">
              <p>
                Loan APY
              </p>
              <p>
                {toPercent(data.borrowAPY)}
              </p>
            </div>
          </div>
          <div className="market__detail__title-token--popup" style={{ opacity: mouseHover ? 1 : 0 }}>
            <h2>
              Total Deposit Yield
            </h2>
            <p>
              Combines Deposit APY and Mining APR
            </p>
          </div>
        </div>
      </div>
      <div className="market__detail__container">
        <div className="market__detail__title__wrapper">
          <p className="bold">
            Liquidity Details
          </p>
          <hr />
        </div>
        <div className="market__detail__wrapper">
          <div className="market__detail__pie-chart__wrapper">
            <div className="market__detail__pie-chart__data__wrapper--total">
              <p className="bold">
                Total Deposits
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
                    Total Borrowed
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
                    Available Liquidity
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
                  Utilization Rate
                </p>
                <p>
                  {`${utilization}%`}
                </p>
              </div>
              <div>
                <p>
                  Number of Depositers
                </p>
                <p>
                  {data.lTokenUserBalanceCount}
                </p>
              </div>
              <div>
                <p>
                  Number of Borrowers
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
                  Deposit
                </p>
              </div>
              <div
                className={`market__detail__graph__converter${!graphConverter ? "--disable" : ""}`}
                onClick={() => setGraphConverter(true)}
              >
                <p className="bold">
                  Borrow
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
                    graphConverter ? 'Total Borrowed' : 'Total Deposits',
                    { role: 'tooltip', p: { html: true } },
                    graphConverter ? 'Borrow APY' : 'Total Deposit Yield',
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
          Deposit | Withdraw
        </p>
      </div>
    </>
  );
}

export default MarketDetail;