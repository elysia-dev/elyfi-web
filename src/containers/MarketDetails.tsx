import 'src/stylesheets/style.scss';
import ServiceBackground from 'src/assets/images/service-background.png';
import { useQuery } from '@apollo/client';
import {
  GetReserve,
} from 'src/queries/__generated__/GetReserve';
import { GET_RESERVE } from 'src/queries/reserveQueries';
import { useHistory, useParams } from 'react-router-dom';
import { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import DaiImage from 'src/assets/images/dai.png';

/* temp */
import { Circle } from 'src/utiles/Circle';
import { daiToUsd, toPercent } from 'src/utiles/formatters';
import { BigNumber, utils } from 'ethers';
import { Chart } from "react-google-charts";

import moment from 'moment';
import ErrorPage from 'src/components/ErrorPage';

const MarketDetail: React.FunctionComponent = () => {
  const history = useHistory();
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

  if (error) return (<ErrorPage />)

  const utilization = BigNumber.from(data?.reserve?.totalBorrow || '0').div(data?.reserve?.toatlDeposit || '1').toNumber();

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

  const maxDeposit = data?.reserve?.reserveHistory.reduce((res, cur) =>
    res < parseInt(utils.formatEther(cur.toatlDeposit)) ? parseInt(utils.formatEther(cur.toatlDeposit)) : res
    , 0) || 0

  const maxBorrow = data?.reserve?.reserveHistory.reduce((res, cur) =>
    res < parseInt(utils.formatEther(cur.totalBorrow)) ? parseInt(utils.formatEther(cur.totalBorrow)) : res
    , 0) || 0

  // APY scale is very tiny.
  // So use amplified apy by base(max Deposit or max Borrow).
  // amplified apy = apy / 5 * base + base * 1.2
  const chartData = (data?.reserve?.reserveHistory.map((reserve, _x) => {
    const apy = utils.formatUnits(!graphConverter ? reserve.depositAPY : reserve.borrowAPY, 25);
    const base = Math.round(!graphConverter ? maxDeposit : maxBorrow);

    return [
      moment(reserve.timestamp * 1000).format("MMMM DD"),
      parseInt(utils.formatEther(!graphConverter ? reserve.toatlDeposit : reserve.totalBorrow)),
      daiToUsd(!graphConverter ? reserve.toatlDeposit : reserve.totalBorrow),
      (parseFloat(apy) / 5) * base + base * 1.2, // i
      apy.toString()
    ]
  }) || [])

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
                {loading ? <Skeleton /> : toPercent(BigNumber.from(data?.reserve?.depositAPY).add(miningAPR))}
              </p>
            </div>
            <div className="market__detail__title-token__data-wrapper">
              <p>
                Deposit APY
              </p>
              <p>
                {loading ? <Skeleton /> : toPercent(data?.reserve?.depositAPY)}
              </p>
            </div>
            <div className="market__detail__title-token__data-wrapper">
              <p>
                Mining APR
              </p>
              <p>
                {loading ? <Skeleton /> : toPercent(miningAPR)}
              </p>
            </div>
            <div className="market__detail__title-token__data-wrapper">
              <p>
                Borrow APY
              </p>
              <p>
                {loading ? <Skeleton /> : toPercent(data?.reserve?.borrowAPY)}
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
                {loading ? <Skeleton width={100} /> : daiToUsd(data?.reserve?.toatlDeposit)}
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
                  {loading ? <Skeleton width={50} /> : daiToUsd(data?.reserve?.totalBorrow)}
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
                  {loading ? <Skeleton width={50} /> : daiToUsd(BigNumber.from(data?.reserve?.toatlDeposit).sub(data?.reserve?.totalBorrow))}
                </p>
              </div>
            </div>
            <div className="market__detail__pie-chart">
              {
                loading ? <Skeleton width={240} height={240} /> :
                  <Circle
                    progress={100 - utilization}
                    style={{
                      width: 240
                    }}
                  />
              }
            </div>
            <div className="market__detail__pie-chart__data">
              <div>
                <p>
                  Utilization rate
                </p>
                {
                  loading ?
                    <Skeleton width={50} />
                    :
                    <p>
                      {`${utilization}%`}
                    </p>
                }
              </div>
              <div>
                <p>
                  Number of Depositers
                </p>
                {
                  loading ?
                    <Skeleton width={50} />
                    : <p>
                      200M
                    </p>
                }
              </div>
              <div>
                <p>
                  Number of Borrowers
                </p>
                {
                  loading ?
                    <Skeleton width={50} />
                    :
                    <p>
                      300M
                    </p>
                }
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
              {
                loading ?
                  <Skeleton width={700} height={500} /> :
                  <Chart
                    width={'700px'}
                    height={'500px'}
                    chartType="ComboChart"
                    loader={<div>Loading Chart</div>}
                    data={[
                      [
                        'Month',
                        'Total Deposit',
                        { role: 'tooltip', p: { html: true } },
                        'Total Rate',
                        { role: 'tooltip', p: { html: true } }
                      ],
                      ...chartData,
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
              }
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