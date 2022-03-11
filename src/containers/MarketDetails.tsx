import { useHistory, useParams } from 'react-router-dom';
import { useContext, useEffect, useRef, useState } from 'react';
import { BigNumber } from 'ethers';
import { useTranslation } from 'react-i18next';

import { reserveTokenData } from 'src/core/data/reserves';
import { toUsd, toPercent } from 'src/utiles/formatters';
import ErrorPage from 'src/components/ErrorPage';
import calcMiningAPR from 'src/utiles/calcMiningAPR';
import calcHistoryChartData from 'src/utiles/calcHistoryChartData';
import TransactionConfirmModal from 'src/components/TransactionConfirmModal';
import Token from 'src/enums/Token';
import Loan from 'src/containers/Loan';
import MarketDetailsBody from 'src/components/MarketDetailsBody';
import MediaQuery from 'src/enums/MediaQuery';
import useMediaQueryType from 'src/hooks/useMediaQueryType';
import DrawWave from 'src/utiles/drawWave';
import TokenColors from 'src/enums/TokenColors';
import SubgraphContext from 'src/contexts/SubgraphContext';
import {
  Bar,
  Cell,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import MainnetContext from 'src/contexts/MainnetContext';
import isSupportedReserve from 'src/core/utils/isSupportedReserve';
import ReserveToken from 'src/core/types/ReserveToken';
import {
  setDatePositionX,
  setTooltipBoxPositionX,
} from 'src/utiles/graphTooltipPosition';
import useCurrentChain from 'src/hooks/useCurrentChain';
import PriceContext from 'src/contexts/PriceContext';
import usePoolData from 'src/hooks/usePoolData';
import Skeleton from 'react-loading-skeleton';

interface ITokencolor {
  name: string;
  color: string;
  subColor: string;
}

const tokenColorData: ITokencolor[] = [
  {
    name: 'DAI',
    color: '#F9AE19',
    subColor: '#FFDB8B',
  },
  {
    name: 'USDT',
    color: '#26A17B',
    subColor: '#70E8C3',
  },
  {
    name: 'BUSD',
    color: '#FAD338',
    subColor: '#FBC300',
  },
];

function MarketDetail(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [mouseHover, setMouseHover] = useState(0);
  const [graphConverter, setGraphConverter] = useState(false);
  const [transactionModal, setTransactionModal] = useState(false);
  const tokenRef = useRef<HTMLParagraphElement>(null);
  const { data: getSubgraphData } = useContext(SubgraphContext);
  const { elfiPrice } = useContext(PriceContext);
  const { poolDayData, loading } = usePoolData();
  const { lng, id } = useParams<{ lng: string; id: Token.DAI | Token.USDT }>();
  const history = useHistory();
  const { value: mediaQuery } = useMediaQueryType();
  const currentChain = useCurrentChain();
  const tokenInfo = reserveTokenData[id];
  const data = getSubgraphData.reserves.find(
    (reserve) => reserve.id === tokenInfo.address,
  );
  const [tooltipPositionX, setTooltipPositionX] = useState(0);
  const [date, setDate] = useState('');
  const { t, i18n } = useTranslation();
  const [cellInBarIdx, setCellInBarIdx] = useState(-1);
  const [token, setToken] = useState(id);
  const { type: getMainnetType } = useContext(MainnetContext);

  const selectToken = tokenColorData.find((color) => {
    return color.name === id;
  });

  const draw = () => {
    const dpr = window.devicePixelRatio;
    const canvas: HTMLCanvasElement | null = canvasRef.current;

    if (!headerRef.current) return;
    const headerY =
      headerRef.current.offsetTop +
      (document.body.clientWidth > 1190 ? 30 : 10);
    if (!canvas) return;
    canvas.width = document.body.clientWidth * dpr;
    canvas.height = document.body.clientHeight * dpr;
    const browserWidth = canvas.width / dpr + 40;
    const browserHeight = canvas.height / dpr;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;
    ctx.scale(dpr, dpr);

    if (mediaQuery === MediaQuery.Mobile) {
      new DrawWave(ctx, browserWidth).drawMobileOnPages(
        headerY,
        TokenColors.ELFI,
        browserHeight,
        false,
      );
      return;
    }

    new DrawWave(ctx, browserWidth).drawOnPages(
      headerY,
      id === Token.DAI
        ? TokenColors.DAI
        : id === Token.USDT
        ? TokenColors.USDT
        : TokenColors.BUSD,
      browserHeight,
      false,
    );
  };

  useEffect(() => {
    draw();
    window.addEventListener('resize', () => draw());

    return () => {
      window.removeEventListener('resize', () => draw());
    };
  }, []);

  useEffect(() => {
    if (!isSupportedReserve(token, getMainnetType)) {
      history.push({
        pathname: `/${lng}/deposit`,
      });
    }
  }, [getMainnetType]);

  // FIXME
  // const miningAPR = utils.parseUnits('10', 25);
  if (!data || !tokenInfo) return <ErrorPage />;

  const miningAPR = calcMiningAPR(
    elfiPrice,
    BigNumber.from(data.totalDeposit),
    tokenInfo?.decimals,
  );
  const utilization = BigNumber.from(data.totalDeposit).isZero()
    ? 0
    : BigNumber.from(data.totalBorrow)
        .mul(100)
        .div(data.totalDeposit)
        .toNumber();

  const CustomTooltip = (e: any) => {
    if (!(cellInBarIdx === -1)) setCellInBarIdx(e.label);

    setDate(e.payload[0]?.payload.name || '');
    setTooltipPositionX(e.coordinate.x);
    return (
      <div
        className="detail__graph__wrapper__tooltip"
        style={{
          border: `1px solid ${selectToken?.color}`,
        }}>
        <div className="detail__graph__wrapper__tooltip__payload">
          <div>
            {graphConverter
              ? t('dashboard.borrow_apy')
              : t('dashboard.total_deposit--reward')}
          </div>
          <div className="bold">{e.payload[0]?.payload.yield} %</div>
        </div>
        <div className="detail__graph__wrapper__tooltip__payload">
          <div>
            {graphConverter
              ? t('dashboard.total_borrowed')
              : t('dashboard.total_deposit')}
          </div>
          <div className="bold">{e.payload[0]?.payload.total} </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          width: '100%',
          top: 0,
          left: 0,
          zIndex: -1,
        }}
      />
      <TransactionConfirmModal
        visible={transactionModal}
        closeHandler={() => {
          setTransactionModal(false);
        }}
      />
      <div className="detail">
        <div className="component__text-navigation">
          <p
            onClick={() => history.push(`/${lng}/deposit`)}
            className="pointer">
            {t('dashboard.deposit')}
          </p>
          &nbsp;&gt;&nbsp;
          <p>{id}</p>
        </div>
        <div ref={headerRef} className="detail__header">
          <img src={tokenInfo?.image} alt="Token image" />
          <h2 ref={tokenRef}>{tokenInfo?.name.toLocaleUpperCase()}</h2>
        </div>
        <div className="detail__container">
          <MarketDetailsBody
            depositReward={toPercent(
              BigNumber.from(data.depositAPY).add(miningAPR),
            )}
            totalDeposit={toUsd(data.totalDeposit, tokenInfo?.decimals)}
            depositAPY={toPercent(data.depositAPY)}
            miningAPRs={toPercent(miningAPR)}
            depositor={data.deposit.length}
            totalLoans={data.borrow.length}
            totalBorrowed={toUsd(data.totalBorrow, tokenInfo?.decimals)}
            availableLiquidity={toUsd(
              BigNumber.from(data.totalDeposit).sub(data.totalBorrow),
              tokenInfo?.decimals,
            )}
            utilization={utilization}
            color={selectToken?.color}
            subColor={selectToken?.subColor}
          />

          <div className="detail__graph">
            <div className="detail__graph__converter">
              <div
                className={`detail__graph__converter__button${
                  graphConverter ? ' disable' : ''
                }`}
                onClick={() => setGraphConverter(false)}>
                <h2>{t('dashboard.deposit')}</h2>
              </div>
              <div
                className={`detail__graph__converter__button${
                  !graphConverter ? ' disable' : ''
                }`}
                onClick={() => setGraphConverter(true)}>
                <h2>{t('dashboard.borrow')}</h2>
              </div>
            </div>
            {/* <div className={`market__detail__graph`}> */}
            <div className="detail__graph__wrapper">
              <div
                onMouseEnter={() => {
                  setCellInBarIdx(-2);
                }}
                onMouseLeave={() => {
                  setCellInBarIdx(-1);
                }}>
                {!loading ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart
                      data={
                        mediaQuery === MediaQuery.PC
                          ? calcHistoryChartData(
                              data,
                              graphConverter ? 'borrow' : 'deposit',
                              poolDayData,
                              tokenInfo!.decimals,
                            )
                          : calcHistoryChartData(
                              data,
                              graphConverter ? 'borrow' : 'deposit',
                              poolDayData,
                              tokenInfo!.decimals,
                            ).slice(20)
                      }>
                      <Tooltip
                        content={<CustomTooltip />}
                        position={{
                          x: setTooltipBoxPositionX(
                            mediaQuery,
                            tooltipPositionX,
                          ),
                          y: -70,
                        }}
                        cursor={{
                          stroke: selectToken?.color,
                          strokeDasharray: 3.3,
                        }}
                      />
                      <Bar dataKey="barTotal" barSize={20}>
                        {calcHistoryChartData(
                          data,
                          graphConverter ? 'borrow' : 'deposit',
                          poolDayData,
                          tokenInfo!.decimals,
                        ).map((cData, index) => (
                          <Cell
                            key={index}
                            fill={
                              cellInBarIdx === index
                                ? selectToken?.color
                                : '#E6E6E6'
                            }
                            radius={4}
                          />
                        ))}
                      </Bar>
                      <Line
                        type="monotone"
                        dataKey="lineYield"
                        stroke={selectToken?.color}
                        dot={false}
                        activeDot={{
                          stroke: selectToken?.color,
                          strokeWidth: 2,
                          r: 4,
                        }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                ) : (
                  <Skeleton width={'100%'} height={300} />
                )}

                <div
                  style={{
                    overflow: 'hidden',
                  }}>
                  <div
                    style={{
                      left: setDatePositionX(mediaQuery, tooltipPositionX),
                    }}>
                    {date}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Loan id={tokenInfo.address} />
      </div>
    </>
  );
}

export default MarketDetail;
