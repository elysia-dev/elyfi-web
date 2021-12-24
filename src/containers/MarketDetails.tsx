import { useHistory, useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { reserveTokenData } from 'src/core/data/reserves';

import { toUsd, toPercent } from 'src/utiles/formatters';
import { BigNumber, constants } from 'ethers';
import { Chart } from 'react-google-charts';

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

function MarketDetail(): JSX.Element {
  const { account, library } = useWeb3React();
  const [mouseHover, setMouseHover] = useState(false);
  const [graphConverter, setGraphConverter] = useState(false);
  const [transactionModal, setTransactionModal] = useState(false);
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
        <div className="detail__header">
          <img src={tokenInfo?.image} alt="Token image" />
          <h2>{tokenInfo?.name.toLocaleUpperCase()}</h2>
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
              <Chart
                height={'500px'}
                chartType="ComboChart"
                loader={<div>Loading Chart</div>}
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
