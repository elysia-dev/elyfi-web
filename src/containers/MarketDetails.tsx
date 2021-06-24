import 'src/stylesheets/style.scss';
import ServiceBackground from 'src/assets/images/service-background.png';
import { useQuery } from '@apollo/client';
import {
  GetReserve,
} from 'src/queries/__generated__/GetReserve';
import { GET_RESERVE } from 'src/queries/reserveQueries';
import { useHistory, useParams } from 'react-router-dom';
import { useState } from 'react';
import DaiImage from 'src/assets/images/dai.png';

/* temp */
import { Circle } from 'src/utiles/Circle';
import { daiToUsd, toPercent } from 'src/utiles/formatters';
import { BigNumber, utils } from 'ethers';

const MarketDetail: React.FunctionComponent = () => {
  const history = useHistory();
  const [mouseHover, setMouseHover] = useState(false);
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
  if (error || !data?.reserve) return (<div> Error </div>)

  const utilization = BigNumber.from(data?.reserve?.totalBorrow || '0').div(data?.reserve?.toatlDeposit).toNumber();

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
            <div>
              <div>
                <p>
                  Deposit
                </p>
              </div>
              <div>
                <p>
                  Borrow
                </p>
              </div>
            </div>
            <div>
              으악
            </div>
          </div>
        </div>
      </div>
      <div onClick={() => { history.push(`/dashboard?reserveId=${id}`) }}>
        Deposit | Withdraw
      </div>
    </>
  );
}

export default MarketDetail;