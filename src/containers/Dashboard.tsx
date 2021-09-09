
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
import envs from 'src/core/envs';
import IncentiveModal from './IncentiveModal';
import calcMiningAPR from 'src/utiles/calcMiningAPR';
import ErrorPage from 'src/components/ErrorPage';
import { Title } from 'src/components/Texts';
import calcExpectedIncentive from 'src/utiles/calcExpectedIncentive';
import moment from 'moment';
import ELFIIcon from 'src/assets/images/ELFI.png';
import PriceContext from 'src/contexts/PriceContext';
import useIncentivePool from 'src/hooks/useIncentivePool';
import { ERC20__factory } from "@elysia-dev/contract-typechain";
import ReactGA from "react-ga";
import Navigation from 'src/components/Navigation';
import Header from 'src/components/Header';
import TokenTable from 'src/components/TokenTable';
import TransactionConfirmModal from 'src/components/TransactionConfirmModal';

const Dashboard: React.FunctionComponent = () => {
  const { account, library } = useWeb3React();
  const location = useLocation();
  const history = useHistory();
  const { reserves, refetch: refetchReserve } = useContext(ReservesContext);
  const { elfiPrice } = useContext(PriceContext);
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
  const incentivePool = useIncentivePool();
  const [transactionModal, setTransactionModal] = useState(false);

  const refrechBalancesAfterTx = async (index: number) => {
    if (!account) return;

    try {
      refetchReserve();
      refetchUserData();
      const updatedLTokens = balances.lTokens;

      if (balances.lTokens.length >= index + 1) {
        updatedLTokens[index] = await ERC20__factory
          .connect(reserves[index].lToken.id, library)
          .balanceOf(account)
      }

      setBalances({
        ...balances,
        dai: await await ERC20__factory
          .connect(reserves[index].lToken.id, library)
          .balanceOf(account),
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
        incentive: await incentivePool.getUserIncentive(account),
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
        dai: await ERC20__factory.connect(reserves[0].id, library).balanceOf(account),
        incentive: await incentivePool.getUserIncentive(account),
        governance: await ERC20__factory.connect(envs.governanceAddress, library).balanceOf(account),
        lTokens: await Promise.all(reserves.map((reserve) => {
          return ERC20__factory.connect(reserve.lToken.id, library).balanceOf(account)
        })),
        updatedAt: moment().unix()
      })
    } catch (e) {
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
                elfiPrice,
                balance,
                calcMiningAPR(elfiPrice, BigNumber.from(reserves[index].totalDeposit)),
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
          transactionModal={() => setTransactionModal(true)}
        />
      }
      <IncentiveModal
        visible={incentiveModalVisible}
        onClose={() => {
          setIncentiveModalVisible(false)
        }}
        balance={expectedIncentive}
        afterTx={() => refrechBalancesAfterClaimTx()}
        transactionModal={() => setTransactionModal(true)}
      />
      <TransactionConfirmModal 
        visible={transactionModal}
        closeHandler={() => {
          setTransactionModal(false)
        }}
      />
      {/* <Navigation /> */}
      <Header title={t("navigation.deposit_withdraw").toUpperCase()} />
      <section className="tokens">
        <Title label={t("dashboard.deposits--header")} />
        <table className="tokens__table">
          <thead className="tokens__table__header pc-only">
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
                return (
                  <>
                    <TokenTable
                      index={index}
                      onClick={(e) => {
                        e.preventDefault();
                        setReserve(reserves[0])
                        ReactGA.modalview('DepositOrWithdraw')
                      }}
                      tokenName={reserve.name}
                      tokenImage={reserve.image}
                      depositBalance={balances.loading ? undefined : `$ ${toCompactForBignumber(balances.lTokens[index] || 0)}`}
                      depositAPY={toPercent(balances.loading ? 0 : reserves[0].depositAPY)} // 원래 index였음.... ㅠㅠ
                      miningAPR={balances.loading ? undefined : toPercent(calcMiningAPR(elfiPrice, BigNumber.from(reserves[0].totalDeposit)) || '0')} // 원래 index였음.... ㅠㅠ
                      walletBalance={`$ ${balances.loading ? undefined : toCompactForBignumber(balances.dai || 0)}`}
                      isDisable={index === 0 ? false : true}
                      skeletonLoading={balances.loading}
                    />
                  </>
                )
              })
            }
            
          </tbody>
        </table>
      </section>
      <section className="tokens">
        <Title label={t("dashboard.minted")} />
        <table className="tokens__table pc-only">
          <thead className="tokens__table__header">
            <tr>
              {
                [t("dashboard.asset"), t("dashboard.minted_balance"), t("dashboard.wallet_balance")].map((key, index) => {
                  return (
                    <th key={index} className="tokens__table__minted-header">
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
                ReactGA.modalview('Incentive')
              }}
            >
              <th className={`tokens__table__image`}>
                <div>
                  <img src={ELFI} alt="Token" />
                  <p className="spoqa__bold">ELFI</p>
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
        <div className="tokens__elfi mobile-only">
          <div
            className="tokens__table__row"
            onClick={(e) => {
              e.preventDefault();
              setIncentiveModalVisible(true);
              ReactGA.modalview('Incentive')
            }}
          >
            <div className="tokens__table__image">
              <div>
                <img src={ELFI} alt='token' />
                <p className="spoqa__bold">ELFI</p>
              </div>
            </div>
            <div className="tokens__table__content">
              <div className="tokens__table__content__data">
                <p className="spoqa__bold">
                  {t("dashboard.minted_balance")}
                </p>
                {
                  balances.loading ?
                    <Skeleton width={50} />
                    :
                    <p className="spoqa">{`${formatCommaSmall(expectedIncentive.isZero() ? balances.incentive : expectedIncentive)} ELFI`}</p>
                }
              </div>
              <div className="tokens__table__content__data">
                <p className="spoqa__bold">
                  {t("dashboard.wallet_balance")}
                </p>
                {
                  balances.loading ?
                    <Skeleton width={50} />
                    :
                    <p className="spoqa">{`${formatCommaSmall(balances.governance)} ELFI`}</p>
                }
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Dashboard;