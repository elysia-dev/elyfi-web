import { useHistory, useParams } from 'react-router-dom';
import { useContext, useEffect, useRef, useState } from 'react';
import { reserveTokenData } from 'src/core/data/reserves';

import { toUsd, toPercent } from 'src/utiles/formatters';
import { BigNumber, constants } from 'ethers';
import Chart from 'react-google-charts';

import waveDai from 'src/assets/images/wave_dai.png';
import waveUSDT from 'src/assets/images/wave_usdt.png';
import ErrorPage from 'src/components/ErrorPage';
import ReservesContext from 'src/contexts/ReservesContext';
import { useTranslation } from 'react-i18next';
import calcMiningAPR from 'src/utiles/calcMiningAPR';
import calcHistoryChartData from 'src/utiles/calcHistoryChartData';
import UniswapPoolContext from 'src/contexts/UniswapPoolContext';
import envs from 'src/core/envs';
import { GetAllReserves_reserves } from 'src/queries/__generated__/GetAllReserves';
import { useWeb3React } from '@web3-react/core';
import {
  ERC20__factory,
  IncentivePool__factory,
} from '@elysia-dev/contract-typechain';
import TransactionConfirmModal from 'src/components/TransactionConfirmModal';
import Token from 'src/enums/Token';
import moment from 'moment';
import Loan from 'src/containers/Loan';
import MarketDetailsBody from 'src/components/MarketDetailsBody';
import styled from 'styled-components';

const initialBalanceState = {
  loading: true,
  value: constants.Zero,
  incentive: constants.Zero,
  expectedIncentiveBefore: constants.Zero,
  expectedIncentiveAfter: constants.Zero,
  deposit: constants.Zero,
  updatedAt: moment().unix(),
};

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
];

const ChartComponent = styled(Chart)`
  .google-visualization-tooltip {
    position: absolute !important;
    top: 30px !important;
    /* left: ${(props) => props.theme.xValue}px !important; */
  }
`;

function MarketDetail(): JSX.Element {
  const { account, library } = useWeb3React();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [mouseHover, setMouseHover] = useState(0);
  const [graphConverter, setGraphConverter] = useState(false);
  const [transactionModal, setTransactionModal] = useState(false);
  const tokenRef = useRef<HTMLParagraphElement>(null);
  const { reserves } = useContext(ReservesContext);
  const { latestPrice, poolDayData } = useContext(UniswapPoolContext);
  const { lng, id } = useParams<{ lng: string; id: Token.DAI | Token.USDT }>();
  const history = useHistory();
  const tokenInfo = reserveTokenData[id];
  const data = reserves.find((reserve) => reserve.id === tokenInfo.address);
  const { t } = useTranslation();

  const selectToken = tokenColorData.find((color) => {
    return color.name === id;
  });

  const [balances, setBalances] = useState<{
    loading: boolean;
    tokenName: string;
    value: BigNumber;
    incentive: BigNumber;
    expectedIncentiveBefore: BigNumber;
    expectedIncentiveAfter: BigNumber;
    deposit: BigNumber;
    updatedAt: number;
  }>({
    ...initialBalanceState,
    tokenName: id,
  });

  const fetchBalanceFrom = async (
    reserve: GetAllReserves_reserves,
    account: string,
  ) => {
    const incentive = await IncentivePool__factory.connect(
      reserve.incentivePool.id,
      library.getSigner(),
    ).getUserIncentive(account);
    return {
      value: await ERC20__factory.connect(reserve.id, library).balanceOf(
        account,
      ),
      incentive,
      expectedIncentiveBefore: incentive,
      expectedIncentiveAfter: incentive,
      governance: await ERC20__factory.connect(
        envs.governanceAddress,
        library,
      ).balanceOf(account),
      deposit: await ERC20__factory.connect(
        reserve.lToken.id,
        library,
      ).balanceOf(account),
    };
  };

  const draw = () => {
    const dpr = window.devicePixelRatio;
    const canvas: HTMLCanvasElement | null = canvasRef.current;

    if (!headerRef.current) return;
    const headerY = headerRef.current.offsetTop;
    if (!canvas) return;
    canvas.width = document.body.clientWidth * dpr;
    canvas.height = document.body.clientHeight * dpr;
    const browserWidth = canvas.width / dpr + 40;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;
    ctx.scale(dpr, dpr);

    ctx.strokeStyle = id === Token.DAI ? '#F9AE19' : '#26A17B';
    ctx.beginPath();
    ctx.moveTo(0, headerY * 1.5);
    ctx.bezierCurveTo(
      browserWidth / 5,
      headerY * 1.2,
      browserWidth / 5,
      headerY * 1.6,
      browserWidth / 2,
      headerY * 1.55,
    );
    ctx.bezierCurveTo(
      browserWidth / 1.2,
      headerY * 1.5,
      browserWidth / 1.3,
      headerY * 1.15,
      browserWidth,
      headerY * 1.5,
    );
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, headerY * 1.6);
    ctx.bezierCurveTo(
      browserWidth / 5,
      headerY * 1.07,
      browserWidth / 5,
      headerY * 1.7,
      browserWidth / 2,
      headerY * 1.6,
    );
    ctx.bezierCurveTo(
      browserWidth / 1.2,
      headerY * 1.45,
      browserWidth / 1.3,
      headerY * 1.15,
      browserWidth,
      headerY * 1.6,
    );
    ctx.stroke();

    // circle
    ctx.beginPath();
    ctx.fillStyle = '#ffffff';
    ctx.moveTo(browserWidth / 7 + 10, headerY * 1.39);
    ctx.arc(browserWidth / 7, headerY * 1.39, 10, 0, Math.PI * 2);

    ctx.moveTo(browserWidth / 7.8 + 5, headerY * 1.43);
    ctx.arc(browserWidth / 7.8, headerY * 1.43, 5, 0, Math.PI * 2);

    ctx.moveTo(browserWidth / 3 + 10, headerY * 1.52);
    ctx.arc(browserWidth / 3, headerY * 1.52, 10, 0, Math.PI * 2);

    ctx.moveTo(browserWidth / 1.5 + 10, headerY * 1.49);
    ctx.arc(browserWidth / 1.5, headerY * 1.49, 10, 0, Math.PI * 2);

    ctx.moveTo(browserWidth / 1.46 + 5, headerY * 1.475);
    ctx.arc(browserWidth / 1.46, headerY * 1.475, 5, 0, Math.PI * 2);

    ctx.moveTo(browserWidth / 1.18 + 10, headerY * 1.36);
    ctx.arc(browserWidth / 1.18, headerY * 1.36, 10, 0, Math.PI * 2);

    ctx.fill();

    ctx.stroke();
  };

  const loadBalance = async () => {
    if (!account) return;

    setBalances({
      ...balances,
      ...(await fetchBalanceFrom(
        reserves[
          reserves.findIndex((reserve) => {
            return reserve.id === tokenInfo.address;
          })
        ],
        account,
      )),
      updatedAt: moment().unix(),
    });
  };

  const loadBalances = async () => {
    if (!account) {
      return;
    }
    try {
      setBalances({
        ...balances,
        loading: false,
        ...(await fetchBalanceFrom(
          reserves[
            reserves.findIndex((reserve) => {
              return reserve.id === tokenInfo.address;
            })
          ],
          account,
        )),
        updatedAt: moment().unix(),
      });
    } catch (error) {
      console.error(error);
      setBalances({
        ...balances,
        loading: false,
      });
    }
  };

  useEffect(() => {
    window.addEventListener('resize', () => draw());

    return () => {
      window.removeEventListener('resize', () => draw());
    };
  }, []);

  useEffect(() => {
    draw();
    loadBalances();
  }, [account]);

  // FIXME
  // const miningAPR = utils.parseUnits('10', 25);
  if (!data || !tokenInfo) return <ErrorPage />;

  const miningAPR = calcMiningAPR(
    latestPrice,
    BigNumber.from(data.totalDeposit),
    tokenInfo?.decimals,
  );
  const utilization = BigNumber.from(data.totalDeposit).isZero()
    ? 0
    : BigNumber.from(data.totalBorrow)
        .mul(100)
        .div(data.totalDeposit)
        .toNumber();

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
            onClick={() => history.push(`/${lng}/dashboard`)}
            className="pointer">
            {t('dashboard.deposit')}
          </p>
          &nbsp;&gt;&nbsp;
          <p>{t('dashboard.reward_plan')}</p>
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
            <div className={`market__detail__graph__${id}`}>
              <ChartComponent
                // theme={{
                //   xValue: mouseHover / 1.455,
                // }}
                height={'500px'}
                chartType="ComboChart"
                loader={<div>Loading Chart</div>}
                // chartEvents={[
                //   {
                //     eventName: 'select',
                //     callback: ({ chartWrapper, google }) => {
                //       console.log(chartWrapper.getChart().getSelection());
                //       google.visualization.events.addListener(
                //         chartWrapper,
                //         'select',
                //         (e) => {
                //           console.log(e);
                //         },
                //       );
                //     },
                //   },
                // ]}
                data={[
                  [
                    'Month',
                    graphConverter
                      ? t('dashboard.total_borrowed')
                      : t('dashboard.total_deposit'),
                    { role: 'tooltip', p: { html: true } },
                    graphConverter
                      ? t('dashboard.borrow_apy')
                      : t('dashboard.total_deposit--yield'),
                    { role: 'tooltip', p: { html: true } },
                  ],
                  ...calcHistoryChartData(
                    data,
                    graphConverter ? 'borrow' : 'deposit',
                    poolDayData,
                    tokenInfo!.decimals,
                  ),
                ]}
                options={{
                  chartArea: {
                    left: 50,
                    right: 50,
                    top: 100,
                    width: '700px',
                    height: '400px',
                  },

                  backgroundColor: 'transparent',
                  tooltip: {
                    textStyle: {
                      color: '#333333',
                    },
                    showColorCode: true,
                    isHtml: true,
                    ignoreBounds: true,
                  },
                  seriesType: 'bars',
                  bar: {
                    groupWidth: 15,
                  },
                  vAxis: {
                    gridlines: {
                      count: 0,
                    },
                    textPosition: 'none',
                  },
                  focusTarget: 'category',
                  curveType: 'function',
                  legend: { position: 'none' },
                  series: {
                    0: {
                      color: '#E6E6E6',
                    },
                    1: {
                      type: 'line',
                      color: id === Token.DAI ? '#F9AE19' : '#26A17B',
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
        <Loan id={tokenInfo.address} />
      </div>
    </>
  );
}

export default MarketDetail;
