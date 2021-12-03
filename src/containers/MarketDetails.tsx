import { useHistory, useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { reserveTokenData } from 'src/core/data/reserves';

/* temp */
import { Circle } from 'src/components/Circle';
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
import Loan from './Loan';

const initialBalanceState = {
  loading: true,
  value: constants.Zero,
  incentive: constants.Zero,
  expectedIncentiveBefore: constants.Zero,
  expectedIncentiveAfter: constants.Zero,
  deposit: constants.Zero,
  updatedAt: moment().unix(),
};

function MarketDetail(): JSX.Element {
  const { account, library } = useWeb3React();
  const [mouseHover, setMouseHover] = useState(false);
  const [graphConverter, setGraphConverter] = useState(false);
  const [transactionModal, setTransactionModal] = useState(false);
  const { reserves } = useContext(ReservesContext);
  const { latestPrice, poolDayData } = useContext(UniswapPoolContext);
  const { lng, id } = useParams<{ lng: string, id: Token.DAI | Token.USDT }>();
  const history = useHistory();
  const tokenInfo = reserveTokenData[id];
  const data = reserves.find((reserve) => reserve.id === tokenInfo.address);
  const { t } = useTranslation();

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
    } catch (e) {
      console.log(e);
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
          <p onClick={() => history.push(`/${lng}/dashboard`)} className="pointer">
            {t('dashboard.deposit')}
          </p>
          &nbsp;&gt;&nbsp;
          <p>
            {t('reward.reward_plan')}
          </p>
        </div>
        <div className="detail__header">
          <img
            src={tokenInfo?.image}
            alt="Token image"
          />
          <h2>{tokenInfo?.name.toLocaleUpperCase()}</h2>
        </div>
        <div className="detail__container">
          <div className="detail__data-wrapper">
            <div className="detail__data-wrapper__title">
              <h2>{t('market.details')}</h2>
            </div>
            <div className="detail__data-wrapper__total">
              <div>
                <h2> 
                  총 예치 수익률
                </h2>
                <h2>
                  {toPercent(BigNumber.from(data.depositAPY).add(miningAPR))}
                </h2>
              </div>
              <div>
                <h2>
                  총 예치금
                </h2>
                <h2>
                  {toUsd(data.totalDeposit, tokenInfo?.decimals)}
                </h2>
              </div>
            </div>
            <div className="detail__data-wrapper__info">
              <div>
                <div>
                  <p>{t('market.deposit_apy')}</p>
                  <p>
                    {toPercent(data.depositAPY)}
                  </p>
                </div>
                <div>
                  <p>
                    ELFI 채굴 APR
                  </p>
                  <p>
                    {toPercent(miningAPR)}
                  </p>
                </div>
                <div>
                  <p>
                    {t('market.total_depositor')}
                  </p>
                  <p>{data.deposit.length}</p>
                </div>
                <div>
                  <p>{t('market.total_loans')}</p>
                  <p>{data.borrow.length}</p>
                </div>
              </div>

              <div>
                <div>
                  <div className="detail__data-wrapper__info__deposit__wrapper">
                    <div>
                      <div className="detail__data-wrapper__info__deposit">
                        <div 
                          style={{
                            backgroundColor: "#F9AE19"
                          }}
                        />
                        <p>
                          {t('market.total_borrowed')}
                        </p>
                      </div>
                      <p>
                        {toUsd(data.totalBorrow, tokenInfo?.decimals)}
                      </p>
                    </div>
                    <div>
                      <div className="detail__data-wrapper__info__deposit">
                        <div 
                          style={{
                            backgroundColor: "#F9AE19"
                          }}
                        />
                        <p>
                          {t('market.available_liquidity')}
                        </p>
                      </div>
                      <p>
                      {toUsd(
                        BigNumber.from(data.totalDeposit).sub(
                          data.totalBorrow,
                        ),
                        tokenInfo?.decimals,
                      )}
                      </p>
                    </div>
                  </div>

                  <div className="detail__data-wrapper__info__deposit__utilization">
                    <h2>
                      {t('market.utilization')}
                    </h2>
                    <h2>{`${utilization}%`}</h2>
                  </div>
                </div>
                <div className="detail__data-wrapper__info__circle-wrapper">
                  <Circle progress={Math.round(100 - utilization)} />
                </div>
              </div>
            </div>
          </div>
          <div className="market__detail__graph__wrapper">
            <div className="market__detail__graph__converter__wrapper">
              <div
                className={`market__detail__graph__converter${
                  graphConverter ? '--disable' : ''
                }`}
                onClick={() => setGraphConverter(false)}>
                <p className="spoqa__bold">{t('market.deposit')}</p>
              </div>
              <div
                className={`market__detail__graph__converter${
                  !graphConverter ? '--disable' : ''
                }`}
                onClick={() => setGraphConverter(true)}>
                <p className="spoqa__bold">{t('market.borrow')}</p>
              </div>
            </div>
            <div className="market__detail__graph">
              <Chart
                height={'500px'}
                chartType="ComboChart"
                loader={<div>Loading Chart</div>}
                data={[
                  [
                    'Month',
                    graphConverter
                      ? t('market.borrow_apy')
                      : t('market.total_deposit_yield'),
                    { role: 'tooltip', p: { html: true } },
                    graphConverter
                      ? t('market.total_borrowed')
                      : t('market.total_deposit'),
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
                      color: '#FF0000',
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
                      color: '#1C5E9A',
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
