import { useParams } from 'react-router-dom';
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
  const { token } = useParams<{ token: Token.DAI | Token.USDT }>();
  const tokenInfo = reserveTokenData[token];
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
    tokenName: token,
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
      <div className={`elysia--pc`}>
        <section className="market__detail market">
          <div className="market__detail__page-container">
            <div className="market__detail">
              <div className="market__detail__title-token">
                <div className="market__detail__title-token__token-wrapper">
                  <div>
                    <img
                      src={tokenInfo?.image}
                      className="market__detail__title-token__token-image"
                      alt="token"
                    />
                    <p className="market__detail__title-token__token-type spoqa__bold">
                      {tokenInfo?.name.toLocaleUpperCase()}
                    </p>
                  </div>
                  <div>
                    <p
                      className="market__detail__title-token__data-wrapper--popup__icon mobile-only"
                      onMouseEnter={() => {
                        setMouseHover(true);
                      }}
                      onMouseLeave={() => {
                        setMouseHover(false);
                      }}>
                      ?
                    </p>
                  </div>
                </div>
                <div className="market__detail__title-token__data-container"></div>
              </div>
            </div>
            <div className="market__detail__container">
              <div className="market__detail__wrapper">
                <div className="market__detail__pie-chart__wrapper">
                  <div className="market__detail__pie-chart__data">
                    <div className="bold">{t('market.details')}</div>
                    <div>
                      <p className="spoqa__bold">{t('market.deposit_apy')}</p>
                      <p className="spoqa__bold">
                        {toPercent(data.depositAPY)}
                      </p>
                    </div>
                    <div>
                      <p className="spoqa__bold">{t('market.borrow_apy')}</p>
                      <p className="spoqa__bold">{toPercent(data.borrowAPY)}</p>
                    </div>
                    <div>
                      <p className="spoqa__bold">
                        {t('market.total_depositor')}
                      </p>
                      <p className="spoqa__bold">{data.deposit.length}</p>
                    </div>
                    <div>
                      <p className="spoqa__bold">{t('market.total_loans')}</p>
                      <p className="spoqa__bold">{data.borrow.length}</p>
                    </div>
                  </div>
                  <div className="market__detail__pie-chart__dataWrapper">
                    <div className="market__detail__pie-chart__data__wrapper--total">
                      <p className="spoqa__bold">{t('market.total_deposit')}</p>
                      <p className="spoqa__bold">
                        {toUsd(data.totalDeposit, tokenInfo?.decimals)}
                      </p>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                      }}>
                      <div
                        style={{
                          width: '70%',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          marginRight: 'auto',
                        }}>
                        <div className="market__detail__pie-chart__data__wrapper">
                          <div className="market__detail__pie-chart__data__block__wrapper">
                            <div
                              className="market__detail__pie-chart__data__block"
                              style={{
                                backgroundColor: '#00A7FF',
                              }}
                            />
                            <p className="spoqa">
                              {t('market.total_borrowed')}
                            </p>
                          </div>
                          <p className="spoqa">
                            {toUsd(data.totalBorrow, tokenInfo?.decimals)}
                          </p>
                        </div>
                        <div className="market__detail__pie-chart__data__wrapper">
                          <div className="market__detail__pie-chart__data__block__wrapper">
                            <div
                              className="market__detail__pie-chart__data__block"
                              style={{
                                backgroundColor: '#1C5E9A',
                              }}
                            />
                            <p className="spoqa">
                              {t('market.available_liquidity')}
                            </p>
                          </div>
                          <p className="spoqa">
                            {toUsd(
                              BigNumber.from(data.totalDeposit).sub(
                                data.totalBorrow,
                              ),
                              tokenInfo?.decimals,
                            )}
                          </p>
                        </div>
                        <div
                          className="market__detail__pie-chart__data__wrapper"
                          style={{
                            marginTop: 'auto',
                          }}>
                          <p className="spoqa__bold">
                            {t('market.utilization')}
                          </p>
                          <p className="spoqa__bold">{`${utilization}%`}</p>
                        </div>
                      </div>
                      <div className="market__detail__pie-chart">
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
            </div>
            <Loan id={tokenInfo.address} />
          </div>
        </section>
      </div>
    </>
  );
}

export default MarketDetail;
