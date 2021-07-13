import 'src/stylesheets/style.scss';
import ServiceBackground from 'src/assets/images/service-background.png';
import { useWeb3React } from '@web3-react/core';
import ReserveData from 'src/core/data/reserves';
import { useEffect } from 'react';
import { toPercent, toCompactForBignumber, formatCommaSmall } from 'src/utiles/formatters';
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
import { getErc20Balance, getUserIncentiveReward } from 'src/utiles/contractHelpers';
import envs from 'src/core/envs';
import IncentiveModal from './IncentiveModal';
import calcMiningAPR from 'src/utiles/calcMiningAPR';
import ErrorPage from 'src/components/ErrorPage';
import { Title } from 'src/components/Texts';
import calcExpectedIncentive from 'src/utiles/calcExpectedIncentive';
import moment from 'moment';
import ELFIIcon from 'src/assets/images/ELFI.png';

const Dashboard: React.FunctionComponent = () => {
  const { account, library } = useWeb3React();
  const location = useLocation();
  const history = useHistory();
  const { reserves, refetch: refetchReserve } = useContext(ReservesContext);
  const reserveId = new URLSearchParams(location.search).get("reserveId")
  const [reserve, setReserve] = useState<GetAllReserves_reserves | undefined>(
    reserves.find((reserve) => reserveId === reserve.id)
  );
  const { t } = useTranslation();
  const [balances, setBalances] = useState<{
    loading: boolean,
    dai: BigNumber,
    incentive: BigNumber,
    governance: BigNumber
    lTokens: BigNumber[],
    updatedAt: number,
  }>({
    loading: true,
    dai: constants.Zero,
    incentive: constants.Zero,
    governance: constants.Zero,
    lTokens: Array.from(Array(reserves.length), () => constants.Zero),
    updatedAt: moment().unix(),
  });
  const [incentiveModalVisible, setIncentiveModalVisible] = useState<boolean>(false);
  const {
    data: userConnection,
    error,
    refetch: refetchUserData,
  } = useQuery<GetUser>(
    GET_USER,
    { variables: { id: account?.toLocaleLowerCase() } }
  )
  const [expectedIncentive, setExpectedIncentive] = useState<BigNumber>(balances.incentive)

  const refrechBalancesAfterTx = async (index: number) => {
    if (!account) return;

    try {
      refetchReserve();
      refetchUserData();
      const updatedLTokens = balances.lTokens;

      if (balances.lTokens.length >= index + 1) {
        updatedLTokens[index] = await getErc20Balance(reserves[index].lToken.id, account, library);
      }

      setBalances({
        ...balances,
        dai: await getErc20Balance(reserves[index].id, account, library),
        lTokens: updatedLTokens,
        updatedAt: moment().unix(),
      })
    } catch {
      setBalances({
        ...balances,
        loading: false,
      })
    }
  }

  const refrechBalancesAfterClaimTx = async () => {
    if (!account) return;

    try {
      setBalances({
        ...balances,
        incentive: await getUserIncentiveReward(account || '', library),
        updatedAt: moment().unix(),
      })
    } catch {
      setBalances({
        ...balances,
        loading: false,
      })
    }

  }

  const loadBalances = async () => {
    if (!account) {
      return;
    }

    try {
      setBalances({
        loading: false,
        dai: await getErc20Balance(reserves[0].id, account, library),
        incentive: await getUserIncentiveReward(account || '', library),
        governance: await getErc20Balance(envs.governanceAddress, account, library),
        lTokens: await Promise.all(reserves.map((reserve) => {
          return getErc20Balance(reserve.lToken.id, account, library)
        })),
        updatedAt: moment().unix()
      })
    } catch {
      setBalances({
        ...balances,
        loading: false,
      })
    }
  }

  useEffect(() => {
    loadBalances();
  }, [account])

  useEffect(() => {
    const interval = setInterval(
      () => {
        setExpectedIncentive(
          balances.incentive.add(
            balances.lTokens?.reduce((res, balance, index) => res.add(
              calcExpectedIncentive(
                balance,
                calcMiningAPR(BigNumber.from(reserves[index].totalDeposit)),
                balances.updatedAt
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

  if (error) return (<ErrorPage />)

  return (
    <>
      {
        reserve &&
        <DepositOrWithdrawModal
          reserve={reserve}
          userData={userConnection?.user}
          tokenName={ReserveData[0].name}
          tokenImage={ReserveData[0].image}
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
          balance={balances.dai}
          depositBalance={BigNumber.from(balances.lTokens[0])}
          afterTx={() => refrechBalancesAfterTx(0)}
        />
      }
      <IncentiveModal
        visible={incentiveModalVisible}
        onClose={() => {
          setIncentiveModalVisible(false)
        }}
        balance={expectedIncentive}
        afterTx={() => refrechBalancesAfterClaimTx()}
      />
      <section className="dashboard main" style={{ backgroundImage: `url(${ServiceBackground})` }}>
        <div className="main__title-wrapper">
          <h2 className="main__title-text">{t("navigation.dashboard")}</h2>
        </div>
      </section>
      <section className="tokens">
        <Title style={{ marginTop: 100 }} label={t("dashboard.deposits--header")} />
        <table className="tokens__table">
          <thead className="tokens__table__header">
            <tr>
              {
                [t("dashboard.asset"), t("dashboard.deposit_balance"), t("dashboard.deposit_apy"), t("dashboard.wallet_balance")].map((key, index) => {
                  return (
                    <th key={index} style={{ width: index === 0 ? 150 : 342 }}>
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
                if (index === 0) {
                  return (
                    <tr
                      key={index}
                      className="tokens__table__row"
                      onClick={(e) => {
                        e.preventDefault();
                        setReserve(reserves[0])
                      }}
                    >
                      <th>
                        <div>
                          <img src={reserve.image} style={{ width: 40 }} alt="Token" />
                          <p className="spoqa">{reserve.name}</p>
                        </div>
                      </th>
                      <th>
                        {
                          balances.loading ?
                            <Skeleton width={50} />
                            :
                            <p className="spoqa">$ {toCompactForBignumber(balances.lTokens[index])}</p>
                        }
                      </th>
                      <th>
                        {
                          balances.loading ?
                            <Skeleton width={50} />
                            :
                            <>
                              <p className="spoqa">
                                {toPercent(reserves[index].depositAPY || '0')}
                              </p>
                              <div className="tokens__table__apr">
                                <img src={ELFIIcon} style={{ width: 14, height: 14 }} />
                                <p className="spoqa__bold">{toPercent(calcMiningAPR(BigNumber.from(reserves[index].totalDeposit)))}</p>
                              </div>
                            </>
                        }
                      </th>
                      <th>
                        {
                          balances.loading ?
                            <Skeleton width={50} />
                            :
                            <p className="spoqa">$ {toCompactForBignumber(balances.dai)}</p>
                        }
                      </th>
                    </tr>
                  )
                }
                return (
                  <tr
                    className="tokens__table__row--disable"
                    key={index}
                  >
                    <th>
                      <div>
                        <div
                          className="tokens__table__image--disable"
                          style={{
                            backgroundColor: "#1C1C1CA2",
                            width: 40,
                            height: 40,
                            borderRadius: 40,
                            position: "absolute"
                          }}
                        />
                        <img src={reserve.image} style={{ width: 40 }} alt="Token" />
                        <p className="spoqa">{reserve.name}</p>
                      </div>
                    </th>
                    <th><p>-</p></th>
                    <th><p>-</p></th>
                    <th><p>-</p></th>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </section>
      <section className="tokens">
        <Title label={t("dashboard.minted")} />
        <table className="tokens__table">
          <thead className="tokens__table__header">
            <tr>
              {
                [t("dashboard.asset"), t("dashboard.minted_balance"), t("dashboard.wallet_balance")].map((key, index) => {
                  return (
                    <th key={index} style={{ width: index === 0 ? 150 : 342 }}>
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
            <tr
              className="tokens__table__row"
              key={0}
              onClick={(e) => {
                e.preventDefault();
                setIncentiveModalVisible(true);
              }}
            >
              <th>
                <div>
                  <img src={ELFI} style={{ width: 40.2, height: 40.2, padding: 0.1 }} alt="Token" />
                  <p className="spoqa">ELFI</p>
                </div>
              </th>
              <th>
                {
                  balances.loading ?
                    <Skeleton width={50} />
                    :
                    <p className="spoqa">{`${formatCommaSmall(expectedIncentive.isZero() ? balances.incentive : expectedIncentive)} ELFI`}</p>
                }
              </th>
              <th>
                {
                  balances.loading ?
                    <Skeleton width={50} />
                    :
                    <p className="spoqa">{`${formatCommaSmall(balances.governance)} ELFI`}</p>
                }
              </th>
            </tr>
          </tbody>
        </table>
      </section>
    </>
  );
}

export default Dashboard;