
import { useWeb3React } from '@web3-react/core';
import ReserveData from 'src/core/data/reserves';
import { useEffect } from 'react';
import { toPercent, toCompactForBignumber, formatCommaSmall } from 'src/utiles/formatters';
import { useContext } from 'react';
import DepositOrWithdrawModal from 'src/containers/DepositOrWithdrawModal';
import { useState } from 'react';
import ReservesContext from 'src/contexts/ReservesContext';
import { BigNumber, constants, utils } from 'ethers';
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
import useIncentivePool from 'src/hooks/useIncentivePool';
import { ERC20__factory } from "@elysia-dev/contract-typechain";
import ReactGA from "react-ga";
import Header from 'src/components/Header';
import TokenTable from 'src/components/TokenTable';
import TransactionConfirmModal from 'src/components/TransactionConfirmModal';

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
    governance: BigNumber
    lTokens: BigNumber[],
    updatedAt: number,
  }[]>([
    {
      loading: true,
      tokenName: ReserveData[0].name,
      value: constants.Zero,
      incentive: constants.Zero,
      governance: constants.Zero,
      lTokens: Array.from(Array(reserves.length), () => constants.Zero),
      updatedAt: moment().unix(),
    },
    {
      loading: true,
      tokenName: ReserveData[1].name,
      value: constants.Zero,
      incentive: constants.Zero,
      governance: constants.Zero,
      lTokens: Array.from(Array(reserves.length), () => constants.Zero),
      updatedAt: moment().unix(),
    }
  ]);
  const [incentiveModalVisible, setIncentiveModalVisible] = useState<boolean>(false);
  const {
    data: userConnection,
    refetch: refetchUserData,
  } = useQuery<GetUser>(
    GET_USER,
    { variables: { id: account?.toLocaleLowerCase() } }
  )
  // const [expectedIncentive, setExpectedIncentive] = useState<BigNumber[]>(
  //   balances.map(data =>
  //     { return data.incentive }
  //   )
  // )
  const [expectedIncentive, setExpectedIncentive] = useState<BigNumber>(balances[0].incentive)

  const incentivePool = useIncentivePool();
  const [transactionModal, setTransactionModal] = useState(false);
  const [selectedModalNumber, setModalNumber] = useState(0);

  const refrechBalancesAfterTx = async (index: number) => {
    if (!account) return;
    try {
      const data = await Promise.all(
        balances.map(async (_data, _index) => {
          if (_index !== index) return _data;

          refetchReserve();
          refetchUserData();
          const updatedLTokens = balances[index].lTokens;

          if (balances[index].lTokens.length >= index + 1) {
            updatedLTokens[index] = await ERC20__factory
              .connect(reserves[index].lToken.id, library)
              .balanceOf(account)
          }

          return {
            ..._data,
            value: await ERC20__factory.connect(reserves[index].id, library).balanceOf(account),
            lTokens: updatedLTokens,
            updatedAt: moment().unix(),
          }          

        })
      )
      setBalances(data)
    } catch {
      let datas = balances;
      let data = {...datas[index]};
      data.loading = false;
      datas[index] = data;
      setBalances(datas);
    }
  }

  const refrechBalancesAfterClaimTx = async (index: number) => {
    if (!account) return;

    try {
      const data = await Promise.all(
        balances.map(async (_data, _index) => {
          if (_index !== index) return _data;

          refetchReserve();
          refetchUserData();
          const updatedLTokens = balances[index].lTokens;

          if (balances[index].lTokens.length >= index + 1) {
            updatedLTokens[index] = await ERC20__factory
              .connect(reserves[index].lToken.id, library)
              .balanceOf(account)
          }

          return {
            ..._data,
            incentive: await incentivePool.getUserIncentive(account),
            updatedAt: moment().unix(),
          }          

        })
      )
      setBalances(data)
    } catch {
      let datas = balances;
      let data = {...datas[index]};
      data.loading = false;
      datas[index] = data;
      setBalances(datas);
    }

  }

  const loadBalances = async () => {
    if (!account) {
      return;
    }

    try {
      const data = await Promise.all(
        balances.map(async (_data, index) => {
          if (!!!reserves[index]) return { ..._data, loading: false };

          refetchReserve();
          refetchUserData();
          const updatedLTokens = balances[index].lTokens;

          if (balances[index].lTokens.length >= index + 1) {
            updatedLTokens[index] = await ERC20__factory
              .connect(reserves[index].lToken.id, library)
              .balanceOf(account)
          }

          return {
            ..._data,
            loading: false,
            value: await ERC20__factory.connect(reserves[index].id, library).balanceOf(account),
            incentive: await incentivePool.getUserIncentive(account),
            governance: await ERC20__factory.connect(envs.governanceAddress, library).balanceOf(account),
            lTokens: await Promise.all(reserves.map((reserve) => {
              return ERC20__factory.connect(reserve.lToken.id, library).balanceOf(account)
            })),
            updatedAt: moment().unix()
          }          

        })
      )
      setBalances(data)
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
        setExpectedIncentive(
          balances[0].incentive.add(
            balances[0].lTokens?.reduce((res, balance, index) => res.add(
              calcExpectedIncentive(
                elfiPrice,
                balance,
                calcMiningAPR(elfiPrice, BigNumber.from(reserves[index].totalDeposit)),
                balances[0].updatedAt
              )
            ), constants.Zero)
          )
        )
      }, 500
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
          depositBalance={BigNumber.from(balances[selectedModalNumber].lTokens[0])}
          afterTx={() => refrechBalancesAfterTx(selectedModalNumber)}
          transactionModal={() => setTransactionModal(true)}
        />
      }
      <IncentiveModal
        visible={incentiveModalVisible}
        onClose={() => {
          setIncentiveModalVisible(false)
        }}
        balance={expectedIncentive}
        afterTx={() => refrechBalancesAfterClaimTx(selectedModalNumber)}
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
                ReserveData.map((reserve, index) => {
                  return (
                    <>
                      <TokenTable
                        index={index}
                        onClick={(e: any) => {
                          e.preventDefault();
                          setReserve(reserves[index])
                          setModalNumber(index)
                          ReactGA.modalview('DepositOrWithdraw')
                        }}
                        tokenName={reserve.name}
                        tokenImage={reserve.image}
                        depositBalance={balances[index].loading || !!!reserves[index] ? undefined : toCompactForBignumber(balances[index].lTokens[index] || constants.Zero)}
                        depositBalanceDivValue={balances[index].loading || !!!reserves[index] ? undefined : toCompactForBignumber(balances[index].lTokens[index].mul(Math.round((index === 0 ? daiPrice : tetherPrice))) || constants.Zero)}
                        depositAPY={toPercent((balances[index].loading || !!!reserves[index]) ? 0 : reserves[index].depositAPY)}
                        miningAPR={(balances[index].loading || !!!reserves[index]) ? undefined : toPercent(calcMiningAPR(elfiPrice, BigNumber.from(reserves[index].totalDeposit)) || '0')}
                        walletBalance={balances[index].loading || !!!reserves[index] ? undefined : toCompactForBignumber(balances[index].value || constants.Zero)}
                        walletBalanceDivValue={balances[index].loading || !!!reserves[index] ? undefined : toCompactForBignumber(balances[index].value.mul(Math.round((index === 0 ? daiPrice : tetherPrice))) || constants.Zero)}
                        isDisable={!!!reserves[index] ? true : false}
                        skeletonLoading={balances[index].loading}
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
                            balances[index].loading ?
                            <Skeleton width={50} /> :
                              <div>
                                <p className="spoqa__bold">
                                  {formatCommaSmall(expectedIncentive.isZero() ? balances[index].incentive : expectedIncentive)}<span className="token-name spoqa__bold"> ELFI</span>
                                </p>
                                <p className="spoqa div-balance">
                                  {"$ " + 
                                    Intl.NumberFormat('en', { maximumFractionDigits: 6, minimumFractionDigits: 6 }).format(
                                      (parseFloat(utils.formatEther(
                                        expectedIncentive.isZero() ? 
                                          balances[index].incentive : 
                                          expectedIncentive)
                                        ) * Math.round(elfiPrice * 1000000) / 1000000)
                                    )
                                  }
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
              {ReserveData.map((_x, index) => {
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
                        ReactGA.modalview('Incentive')
                      }}
                    >
                      <img src={ELFI} alt="Token" />
                      {
                        balances[index].loading ?
                        <Skeleton width={50} /> :
                          <div>
                            <p className="spoqa__bold">
                              {formatCommaSmall(expectedIncentive.isZero() ? balances[index].incentive : expectedIncentive)}<span className="token-name spoqa__bold"> ELFI</span>
                            </p>
                            <p className="spoqa div-balance">
                              {"$ " + 
                                Intl.NumberFormat('en', { maximumFractionDigits: 6, minimumFractionDigits: 6 }).format(
                                  (parseFloat(utils.formatEther(
                                    expectedIncentive.isZero() ? 
                                      balances[index].incentive : 
                                      expectedIncentive)
                                    ) * Math.round(elfiPrice * 1000000) / 1000000)
                                )
                              }
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
      </section>
    </>
  );
}

export default Dashboard;