import 'src/stylesheets/style.scss';
import ServiceBackground from 'src/shared/images/service-background.png';
import { useQuery } from '@apollo/client';
import { 
  GetReserve, 
  GetReserve_reserve,
  GetReserve_reserve_reserveHistory
} from 'src/queries/__generated__/GetReserve';
import { GET_RESERVE } from 'src/queries/reserveQueries';
import { useParams } from 'react-router-dom';
import Header from 'src/modules/pc/header/Header';
import { useState } from 'react';

/* temp */
import BNB from 'src/shared/images/tokens/bnb@2x.png'
import { Circle } from 'src/utiles/Circle';

const MarketDetail: React.FunctionComponent = () => {
  const [mouseHover, setMouseHover] = useState(false);
  const { id } = useParams<{ id: string }>();
  const {
    loading,
    // data,
    error,
  } = useQuery<GetReserve>(
    GET_RESERVE,
    {
      variables: { id },
    }
  )

  const [data, setState] = useState<GetReserve | null>({
    reserve: {
      __typename: "Reserve",
      id: "0x000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f",
      lTokenInterestIndex: "0x000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f",
      borrowAPY: 120.1234,
      depositAPY: 120.6456,
      totalBorrow: 120.6755,
      toatlDeposit: 120.2343,
      reserveHistory: [{
        __typename: "ReserveHistory",
        id: "0x000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f",
        timestamp: 1623906828465,
        borrowAPY: 120.1234,
        depositAPY: 120.6456,
        totalBorrow: 120.6755,
        toatlDeposit: 120.2343
      }] as GetReserve_reserve_reserveHistory[]
    } as GetReserve_reserve
  })
  const miningAPR = 10000; // 발행량 * 가격

  if (loading) return (<div> Loading </div>)
  // if (error) return (<div> Error </div>)
            // data?.reserve?.toatlDeposit

  return (
    <>
      <section className="market__detail main" style={{ backgroundImage: `url(${ServiceBackground})` }} />
        <div className="market__detail">
          <div className="market__detail__title-token">
            <div className="market__detail__title-token__token-wrapper">
              <img src={BNB} className="market__detail__title-token__token-image" />
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
                  {Math.round((data?.reserve?.depositAPY + (miningAPR / data?.reserve?.toatlDeposit)) * 100) / 100} %
                </p>
              </div>
              <div className="market__detail__title-token__data-wrapper">
                <p>
                  Deposit APY
                </p>
                <p>
                  {Math.round((data?.reserve?.depositAPY) * 100) / 100} %
                </p>
              </div>
              <div className="market__detail__title-token__data-wrapper">
                <p>
                  Mining APR
                </p>
                <p>
                  {Math.round((miningAPR / data?.reserve?.toatlDeposit) * 100) / 100} %
                </p>
              </div>
              <div className="market__detail__title-token__data-wrapper">
                <p>
                  Borrow APY
                </p>
                <p>
                  {Math.round((data?.reserve?.borrowAPY) * 100) / 100} %
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
                  1,000 BUSD
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
                    700 BUSD
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
                    300 BUSD
                  </p>
                </div>
              </div>
              <div className="market__detail__pie-chart">
                <Circle 
                  progress={90}
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
                    120 %
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
    </>
  );
}

export default MarketDetail;