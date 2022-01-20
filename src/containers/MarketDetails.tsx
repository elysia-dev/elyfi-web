import { useHistory, useParams, Redirect } from 'react-router-dom';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { reserveTokenData } from 'src/core/data/reserves';

import { toUsd, toPercent } from 'src/utiles/formatters';
import { BigNumber, constants } from 'ethers';
import Chart from 'react-google-charts';

import ErrorPage from 'src/components/ErrorPage';
import { useTranslation } from 'react-i18next';
import calcMiningAPR from 'src/utiles/calcMiningAPR';
import calcHistoryChartData from 'src/utiles/calcHistoryChartData';
import UniswapPoolContext from 'src/contexts/UniswapPoolContext';
import envs from 'src/core/envs';
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
import MediaQuery from 'src/enums/MediaQuery';
import useMediaQueryType from 'src/hooks/useMediaQueryType';
import toOrdinalNumber from 'src/utiles/toOrdinalNumber';
import DrawWave from 'src/utiles/drawWave';
import TokenColors from 'src/enums/TokenColors';
import SubgraphContext, {
  IReserveSubgraphData,
} from 'src/contexts/SubgraphContext';
import {
  Bar,
  Cell,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import MainnetContext from 'src/contexts/MainnetContext';
import MainnetType from 'src/enums/MainnetType';
import isSupportedReserve from 'src/core/utils/isSupportedReserve';
import ReserveToken from 'src/core/types/ReserveToken';
import { busd3xRewardEvent } from 'src/utiles/busd3xRewardEvent';

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
  {
    name: 'BUSD',
    color: '#FAD338',
    subColor: '#FBC300',
  },
];

const ChartComponent = styled(Chart)`
  .google-visualization-tooltip {
    position: absolute !important;
    top: 30px !important;
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
  const { data: getSubgraphData } = useContext(SubgraphContext);
  const { latestPrice, poolDayData } = useContext(UniswapPoolContext);
  const { lng, id } = useParams<{ lng: string; id: Token.DAI | Token.USDT }>();
  const history = useHistory();
  const { value: mediaQuery } = useMediaQueryType();
  const tokenInfo = reserveTokenData[id];
  const data = getSubgraphData.reserves.find(
    (reserve) => reserve.id === tokenInfo.address,
  );
  const [tooltipPositionX, setTooltipPositionX] = useState(0);
  const [date, setDate] = useState('');
  const { t, i18n } = useTranslation();
  const [cellInBarIdx, setCellInBarIdx] = useState(-1);
  const { type: getMainnetType } = useContext(MainnetContext);

  const selectToken = tokenColorData.find((color) => {
    return color.name === id;
  });

  const [balances, setBalances] = useState<{
    loading: boolean;
    tokenName: ReserveToken;
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
    reserve: IReserveSubgraphData,
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
    const headerY =
      headerRef.current.offsetTop +
      (document.body.clientWidth > 1190 ? 30 : 10);
    if (!canvas) return;
    canvas.width = document.body.clientWidth * dpr;
    canvas.height = document.body.clientHeight * dpr;
    const browserWidth = canvas.width / dpr + 40;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;
    ctx.scale(dpr, dpr);
    new DrawWave(ctx, browserWidth).drawOnPages(
      headerY,
      id === Token.DAI
        ? TokenColors.DAI
        : id === Token.USDT
        ? TokenColors.USDT
        : TokenColors.BUSD,
    );
  };

  const loadBalance = async () => {
    if (!account) return;

    setBalances({
      ...balances,
      ...(await fetchBalanceFrom(
        getSubgraphData.reserves[
          getSubgraphData.reserves.findIndex((reserve) => {
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
          getSubgraphData.reserves[
            getSubgraphData.reserves.findIndex((reserve) => {
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

  useEffect(() => {
    // need refactoring!!!
    if (!isSupportedReserve(balances.tokenName, getMainnetType)) {
      history.push({
        pathname: `/${lng}/deposit`,
      });
    }
  }, [balances, getMainnetType]);

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

  const isLeftTextOverFlowX = useCallback(
    (x: number) => {
      return tooltipPositionX < x;
    },
    [tooltipPositionX],
  );

  const isRightTextOverFlowX = useCallback(
    (x: number) => {
      return tooltipPositionX > x;
    },
    [tooltipPositionX],
  );

  const calculationPositionX = useCallback(
    (x: number) => tooltipPositionX - x,
    [tooltipPositionX],
  );

  const setTooltipPostionX = () => {
    return isRightTextOverFlowX(1080)
      ? calculationPositionX(210)
      : isLeftTextOverFlowX(110)
      ? calculationPositionX(20)
      : mediaQuery === MediaQuery.Mobile && isRightTextOverFlowX(250)
      ? calculationPositionX(220)
      : calculationPositionX(113);
  };

  const setDatePositionX = () => {
    return isLeftTextOverFlowX(25)
      ? calculationPositionX(48)
      : isRightTextOverFlowX(1150)
      ? calculationPositionX(80)
      : mediaQuery === MediaQuery.Mobile && isRightTextOverFlowX(330)
      ? calculationPositionX(80)
      : calculationPositionX(60);
  };

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
              ? t('dashboard.total_deposit--yield')
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
          {/* <div>
            <div
              className={`detail__header__round ${tokenInfo?.name.toLocaleUpperCase()}`}>
              {Array(2)
                .fill(0)
                .map((_x, index) => {
                  return (
                    <div
                      className={index + 1 === round ? 'active' : ''}
                      onClick={() => setRound(index + 1)}>
                      <p>
                        {t(
                          mediaQuery === MediaQuery.PC
                            ? 'staking.nth--short'
                            : 'staking.nth--short',
                          {
                            nth: toOrdinalNumber(i18n.language, index + 1),
                          },
                        )}
                      </p>
                      <p>
                        {index === 0
                          ? `(~ 2022.01.11 KST)`
                          : `(2022.01.11 KST ~)`}
                      </p>
                    </div>
                  );
                })}
            </div>
          </div> */}
        </div>
        <div className="detail__container">
          <MarketDetailsBody
            depositReward={toPercent(
              BigNumber.from(data.depositAPY).add(
                miningAPR.mul(busd3xRewardEvent(selectToken?.name)),
              ),
            )}
            totalDeposit={toUsd(data.totalDeposit, tokenInfo?.decimals)}
            depositAPY={toPercent(data.depositAPY)}
            miningAPRs={toPercent(
              miningAPR.mul(busd3xRewardEvent(selectToken?.name)),
            )}
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
                        x: setTooltipPostionX(),
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
                <div
                  style={{
                    overflow: 'hidden',
                  }}>
                  <div
                    style={{
                      left: setDatePositionX(),
                    }}>
                    {date}
                  </div>
                </div>
              </div>
            </div>
            {/* </div> */}
          </div>
        </div>
        <Loan id={tokenInfo.address} />
      </div>
    </>
  );
}

export default MarketDetail;
