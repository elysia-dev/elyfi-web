import 'src/stylesheets/style.scss';
import ServiceBackground from 'src/shared/images/service-background.png';
import { useQuery } from '@apollo/client';
import {
  GetReserve,
} from 'src/queries/__generated__/GetReserve';
import { GET_RESERVE } from 'src/queries/reserveQueries';
import { useParams } from 'react-router-dom';
import { useState } from 'react';

/* temp */
import BNB from 'src/shared/images/tokens/bnb@2x.png'
import { Circle } from 'src/utiles/Circle';
import { daiToUsd, toPercent } from 'src/utiles/formatters';
import { BigNumber, constants, utils } from 'ethers';
import { Chart } from "react-google-charts";
import numberFormat from 'src/utiles/numberFormat';

import moment from 'moment';

const MarketDetail: React.FunctionComponent = () => {
  const [mouseHover, setMouseHover] = useState(false);
  const [graphConverter, setGraphConverter] = useState(false);
  const { id } = useParams<{ id: string }>();
  const {
    loading,
    data,
    error,
  } = useQuery<GetReserve>(
    GET_RESERVE,
    {
      variables: { id },
    }
  )
  // FIXME
  const miningAPR = utils.parseUnits('10', 25);

  if (loading) return (<div> Loading </div>)
  if (error) return (<div> Error </div>)

  const utilization = BigNumber.from(data?.reserve?.totalBorrow || '0').div(data?.reserve?.toatlDeposit).toNumber();

  const DivProvider = (text: "Total Rate" | "Total Deposit", value: string) => {
    return `
      <div class="google-div-jailbreak" style="left: ${text === "Total Rate" ? -74 : -86}px" >
        <p class="google-div-jailbreak__text">
          ${text}
        </p>
        <p class="google-div-jailbreak__value bold">
          ${text === "Total Rate" ?
            (value + "%")
            :
            (value)
          }
        </p>
      </div>
    `
  }

  const avgDeposit = data?.reserve?.reserveHistory.reduce((res, cur) => 
    res < parseInt(utils.formatEther(cur.toatlDeposit)) ? parseInt(utils.formatEther(cur.toatlDeposit)) : res
  , 0) || 0

  const avgBorrow = data?.reserve?.reserveHistory.reduce((res, cur) => 
    res < parseInt(utils.formatEther(cur.totalBorrow)) ? parseInt(utils.formatEther(cur.totalBorrow)) : res
  , 0)  || 0

  const test = (data?.reserve?.reserveHistory.map((reserve, _x) => {
    const getTimestamp = moment(reserve.timestamp * 1000);

    const apy = utils.formatUnits(BigNumber.from(!graphConverter ? reserve.depositAPY: reserve.borrowAPY), 25);
    const base = Math.round(!graphConverter ? avgDeposit : avgBorrow);

    const rate = (parseInt(apy)/100) * base + base * 1.2;

    return [
      getTimestamp.format("MMMM d"),
      parseInt(utils.formatEther(!graphConverter ? reserve.toatlDeposit : reserve.totalBorrow)), 
      DivProvider(`Total Deposit`, daiToUsd(!graphConverter ? reserve.toatlDeposit : reserve.totalBorrow)), 
      rate,
      DivProvider(`Total Rate`, (utils.formatUnits(!graphConverter ? reserve.depositAPY : reserve.borrowAPY, 25)).toString())
    ]
  }) || [])

  return (
    <>
      <section className="market__detail main" style={{ backgroundImage: `url(${ServiceBackground})` }} />
      <div className="market__detail">
        <div className="market__detail__title-token">
          <div className="market__detail__title-token__token-wrapper">
            <img src={BNB} className="market__detail__title-token__token-image" alt='token' />
            <p className="market__detail__title-token__token-type bold">DAI</p>
          </div>
          <div className="market__detail__title-token__data-container">
            <div className="market__detail__title-token__data-wrapper">
              <div className="market__detail__title-token__data-wrapper--popup">
                <p>
                  Total Rate
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
                {toPercent(BigNumber.from(data?.reserve?.depositAPY).add(miningAPR))}
              </p>
            </div>
            <div className="market__detail__title-token__data-wrapper">
              <p>
                Deposit APY
              </p>
              <p>
                {toPercent(data?.reserve?.depositAPY)}
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
                Borrow APY
              </p>
              <p>
                {toPercent(data?.reserve?.borrowAPY)}
              </p>
            </div>
          </div>
          <div className="market__detail__title-token--popup" style={{ opacity: mouseHover ? 1 : 0 }}>
            <h2>
              Total Rate
            </h2>
            <p>
              This rate is the value of adding the ELFI Mining APR
              to the Deposit APY
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
                Total Deposit
              </p>
              <p className="bold">
                {daiToUsd(data?.reserve?.toatlDeposit)}
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
                    Total Borrow
                  </p>
                </div>
                <p>
                  {daiToUsd(data?.reserve?.totalBorrow)}
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
                  {daiToUsd(BigNumber.from(data?.reserve?.toatlDeposit).sub(data?.reserve?.totalBorrow))}
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
                  Utilization rate
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
                  200M
                </p>
              </div>
              <div>
                <p>
                  Number of Borrowers
                </p>
                <p>
                  300M
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
                    'Deposit',
                    {role: 'tooltip', p : { html: true }},
                    'k',
                    {role: 'tooltip', p : { html: true }}
                  ],
                  ...test,
                  //["123",123, "div",123,123]
                ]}
                options={{
                  chartArea:{left:0,top:100,width:"100%",height:"400px"},
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
                  curveType: "function",
                  legend: {position: 'none'},
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
    </>
  );
}

export default MarketDetail;