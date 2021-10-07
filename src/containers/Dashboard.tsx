import { useWeb3React } from '@web3-react/core';
import ReserveData from 'src/core/data/reserves';
import { useEffect } from 'react';
import { toPercent, toCompactForBignumber, formatSixFracionDigit } from 'src/utiles/formatters';
import { useContext } from 'react';
import DepositOrWithdrawModal from 'src/containers/DepositOrWithdrawModal';
import { useState } from 'react';
import ReservesContext from 'src/contexts/ReservesContext';
import { BigNumber, constants } from 'ethers';
import { GetAllReserves_reserves } from 'src/queries/__generated__/GetAllReserves';
import { useHistory, useLocation } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import { useQuery } from '@apollo/client';
import { GetUser } from 'src/queries/__generated__/GetUser';
import { GET_USER } from 'src/queries/userQueries';
import ELFI from 'src/assets/images/ELFI.png'
import { useTranslation } from 'react-i18next';
import envs from 'src/core/envs';
import IncentiveModal from './IncentiveModal';
import calcMiningAPR from 'src/utiles/calcMiningAPR';
import { Title } from 'src/components/Texts';
import calcExpectedIncentive from 'src/utiles/calcExpectedIncentive';
import moment from 'moment';
import PriceContext from 'src/contexts/PriceContext';
import { ERC20__factory, IncentivePool__factory } from "@elysia-dev/contract-typechain";
import ReactGA from "react-ga";
import Header from 'src/components/Header';
import TokenTable from 'src/components/TokenTable';
import TransactionConfirmModal from 'src/components/TransactionConfirmModal';
import { formatEther } from '@ethersproject/units';
import CountUp from 'react-countup';

const initialBalanceState = {
  loading: true,
  value: constants.Zero,
  incentive: constants.Zero,
  expectedIncentiveBefore: constants.Zero,
  expectedIncentiveAfter: constants.Zero,
  deposit: constants.Zero,
  updatedAt: moment().unix(),
}

const Dashboard: React.FunctionComponent = () => {
  const { account, library } = useWeb3React();
  const location = useLocation();
  const history = useHistory();
  const { reserves, refetch: refetchReserve } = useContext(ReservesContext);
  const { elfiPrice, daiPrice, tetherPrice } = useContext(PriceContext);
  const reserveId = new URLSearchParams(location.search).get("reserveId")

  const [reserve, setReserve] = useState<GetAllReserves_reserves | undefined>(
    reserves.find((reserve) => reserveId === reserve.id)
  );
  const { t } = useTranslation();
  const [balances, setBalances] = useState<{
    loading: boolean,
    tokenName: string,
    value: BigNumber,
    incentive: BigNumber,
    expectedIncentiveBefore: BigNumber,
    expectedIncentiveAfter: BigNumber,
    deposit: BigNumber,
    updatedAt: number,
  }[]>(ReserveData.map((reserve) => {
    return {
      ...initialBalanceState,
      tokenName: reserve.name,
    }
  }));
  const [incentiveModalVisible, setIncentiveModalVisible] = useState<boolean>(false);
  const {
    data: userConnection,
    refetch: refetchUserData,
  } = useQuery<GetUser>(
    GET_USER,
    { variables: { id: account?.toLocaleLowerCase() } }
  )
  const [transactionModal, setTransactionModal] = useState(false);
  const [selectedModalNumber, setModalNumber] = useState(0);

  const fetchBalanceFrom = async (reserve: GetAllReserves_reserves, account: string) => {
    const incentive = await IncentivePool__factory.connect(
      reserve.incentivePool.id,
      library.getSigner()
    ).getUserIncentive(account)

    return {
      value: await ERC20__factory.connect(reserve.id, library).balanceOf(account),
      incentive,
      expectedIncentiveBefore: incentive,
      expectedIncentiveAfter: incentive,
      governance: await ERC20__factory.connect(envs.governanceAddress, library).balanceOf(account),
      deposit: await ERC20__factory.connect(reserve.lToken.id, library).balanceOf(account),
    }
  }

  const loadBalance = async (index: number) => {
    if (!account) return;

    refetchReserve();
    refetchUserData();

    setBalances(await Promise.all(
      balances.map(async (data, _index) => {
        if (_index !== index) return data;
        return {
          ...data,
          ...(await fetchBalanceFrom(reserves[index], account)),
          updatedAt: moment().unix(),
        }
      })
    ))
  }

  const loadBalances = async () => {
    if (!account) {
      return;
    }

    try {
      refetchReserve();
      refetchUserData();

      setBalances(await Promise.all(
        reserves.map(async (reserve, index) => {
          return {
            ...balances[index],
            loading: false,
            ...(await fetchBalanceFrom(reserve, account)),
            updatedAt: moment().unix()
          }
        })
      ))
    } catch (e) {
      console.log(e)
      setBalances(balances.map(data => {
        return {
          ...data,
          loading: false
        }
      }))
    }
  }

  useEffect(() => {
    loadBalances();
  }, [account])

  useEffect(() => {
    const interval = setInterval(
      () => {
        setBalances(balances.map((balance, index) => {
          return {
            ...balance,
            expectedIncentiveBefore: balance.expectedIncentiveAfter,
            expectedIncentiveAfter: balance.incentive.add(
              calcExpectedIncentive(
                elfiPrice,
                balance.deposit,
                calcMiningAPR(elfiPrice, BigNumber.from(reserves[index].totalDeposit)),
                balance.updatedAt
              )
            )
          }
        }))
      }, 3000
    );

    return () => {
      clearInterval(interval);
    }
  })

  return (
    <>
      {
        reserve &&
        <DepositOrWithdrawModal
          reserve={reserve}
          userData={userConnection?.user}
          tokenName={ReserveData[selectedModalNumber].name}
          tokenImage={ReserveData[selectedModalNumber].image}
          visible={!!reserve}
          onClose={() => {
            const queryParams = new URLSearchParams(location.search)

            if (queryParams.has('reserveId')) {
              queryParams.delete('reserveId')
              history.replace({
                search: queryParams.toString(),
              })
            }

            setReserve(undefined)
          }}
          balance={balances[selectedModalNumber].value}
          depositBalance={BigNumber.from(balances[selectedModalNumber].deposit)}
          afterTx={() => loadBalance(selectedModalNumber)}
          transactionModal={() => setTransactionModal(true)}
        />
      }
      <IncentiveModal
        visible={incentiveModalVisible}
        onClose={() => {
          setIncentiveModalVisible(false)
        }}
        balanceBefore={balances[selectedModalNumber].expectedIncentiveBefore}
        balanceAfter={balances[selectedModalNumber].expectedIncentiveAfter}
        incentivePoolAddress={reserves[selectedModalNumber].incentivePool.id}
        afterTx={() => loadBalance(selectedModalNumber)}
        transactionModal={() => setTransactionModal(true)}
      />
      <TransactionConfirmModal
        visible={transactionModal}
        closeHandler={() => {
          setTransactionModal(false)
        }}
      />
      <Header title={t("navigation.deposit_withdraw").toUpperCase()} />

      <section className="tokens">
        <Title label={t("dashboard.deposits--header")} />
        <div className="tokens__table__wrapper">
          <table className="tokens__table">
            <thead className="tokens__table__header pc-only">
              <tr>
                {
                  [t("dashboard.asset"), t("dashboard.deposit_balance"), t("dashboard.deposit_apy"), t("dashboard.wallet_balance")].map((key, index) => {
                    return (
                      <th key={index} style={{ width: index === 0 ? 150 : 228 }}>
                        <p className="tokens__table__header__column">
                          {key}
                        </p>
                      </th>
                    )
                  })
                }
              </tr>
            </thead>
            <tbody className="tokens__table-body">
              {
                balances.map((balance, index) => {
                  return (
                    <>
                      <TokenTable
                        key={index}
                        index={index}
                        onClick={(e: any) => {
                          e.preventDefault();
                          setReserve(reserves[index])
                          setModalNumber(index)
                          ReactGA.modalview('DepositOrWithdraw')
                        }}
                        tokenName={ReserveData[index].name}
                        tokenImage={ReserveData[index].image}
                        depositBalance={toCompactForBignumber(balance.deposit || constants.Zero)}
                        depositBalanceDivValue={toCompactForBignumber(balance.deposit.mul(Math.round((index === 0 ? daiPrice : tetherPrice))) || constants.Zero)}
                        depositAPY={toPercent(reserves[index].depositAPY)}
                        miningAPR={toPercent(calcMiningAPR(elfiPrice, BigNumber.from(reserves[index].totalDeposit)) || '0')}
                        walletBalance={toCompactForBignumber(balance.value || constants.Zero)}
                        walletBalanceDivValue={toCompactForBignumber(balance.value.mul(Math.round((index === 0 ? daiPrice : tetherPrice))) || constants.Zero)}
                        isDisable={!!!reserves[index]}
                        skeletonLoading={balance.loading}
                      />

                      {/* mobile only */}
                      <div className="tokens__table__minted mobile-only">
                        <p>
                          ▼
                        </p>
                        <div
                          className="content"
                          onClick={(e) => {
                            e.preventDefault();
                            setIncentiveModalVisible(true);
                            ReactGA.modalview('Incentive')
                          }}
                        >
                          <div>
                            <img src={ELFI} alt="Token" />
                            <p className="spoqa__bold">
                              {t("dashboard.minted_balance")}
                            </p>
                          </div>

                          {
                            balance.loading ?
                              <Skeleton width={50} /> :
                              <div>
                                <p className="spoqa__bold">
                                  <CountUp
                                    className="spoqa__bold"
                                    start={
                                      parseFloat(formatEther(balance.expectedIncentiveBefore))
                                    }
                                    end={
                                      parseFloat(formatEther(balance.expectedIncentiveAfter))
                                    }
                                    formattingFn={(number) => {
                                      return formatSixFracionDigit(number)
                                    }}
                                    decimals={6}
                                    duration={1}
                                  />
                                </p>
                                <p className="spoqa div-balance">
                                  <CountUp
                                    className="spoqa div-balance"
                                    start={
                                      parseFloat(
                                        formatEther(
                                          balance.expectedIncentiveBefore
                                        )
                                      ) * elfiPrice
                                    }
                                    end={
                                      parseFloat(
                                        formatEther(
                                          balance.expectedIncentiveAfter
                                        )
                                      ) * elfiPrice
                                    }
                                    formattingFn={(number) => {
                                      return "$ " + formatSixFracionDigit(number)
                                    }}
                                    decimals={6}
                                    duration={1}
                                  />
                                </p>
                              </div>
                          }
                        </div>
                      </div>
                    </>
                  )
                })
              }
            </tbody>
          </table>
          <div className="tokens__table__minted pc-only">
            <p>
              {t("dashboard.minted_balance")}
            </p>
            <div>
              {balances.map((balance, index) => {
                return (
                  <div>
                    <p>
                      ▶
                    </p>
                    <div
                      className="content"
                      onClick={(e) => {
                        e.preventDefault();
                        setIncentiveModalVisible(true);
                        setModalNumber(index)
                        ReactGA.modalview('Incentive')
                      }}
                    >
                      <img src={ELFI} alt="Token" />
                      {
                        balance.loading ?
                          <Skeleton width={50} /> :
                          <div>
                            <p className="spoqa__bold">
                              <CountUp
                                className="spoqa__bold"
                                start={
                                  parseFloat(formatEther(balance.expectedIncentiveBefore))
                                }
                                end={
                                  parseFloat(formatEther(balance.expectedIncentiveAfter))
                                }
                                formattingFn={(number) => {
                                  return formatSixFracionDigit(number)
                                }}
                                decimals={6}
                                duration={1}
                              />
                            </p>
                            <p className="spoqa div-balance">
                              <CountUp
                                className="spoqa div-balance"
                                start={
                                  parseFloat(
                                    formatEther(
                                      balance.expectedIncentiveBefore
                                    )
                                  ) * elfiPrice
                                }
                                end={
                                  parseFloat(
                                    formatEther(
                                      balance.expectedIncentiveAfter
                                    )
                                  ) * elfiPrice
                                }
                                formattingFn={(number) => {
                                  return "$ " + formatSixFracionDigit(number)
                                }}
                                decimals={6}
                                duration={1}
                              />
                            </p>
                          </div>
                      }
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <div style={{ height: 100 }} />
      </section >
    </>
  );
}

export default Dashboard;