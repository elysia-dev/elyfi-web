import 'src/stylesheets/style.scss';
import ServiceBackground from 'src/assets/images/service-background.png';
import { useWeb3React } from '@web3-react/core';
import { useQuery } from '@apollo/client';
import { GetUser } from 'src/queries/__generated__/GetUser';
import { GET_USER } from 'src/queries/userQueries';
import ReserveData from 'src/core/data/reserves';
import { useEffect } from 'react';
import { daiToUsd, formatComma, toPercent } from 'src/utiles/formatters';
import { useContext } from 'react';
import DepositOrWithdrawModal from 'src/containers/DepositOrWithdrawModal';
import { useState } from 'react';
import ReservesContext from 'src/contexts/ReservesContext';
import { BigNumber, constants } from 'ethers';
import { GetAllReserves_reserves } from 'src/queries/__generated__/GetAllReserves';
import { useHistory, useLocation } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import ErrorPage from 'src/components/ErrorPage';

import ELFI from 'src/assets/images/ELFI.png'
import { getErc20Balance, getUserIncentiveReward } from 'src/utiles/contractHelpers';
import envs from 'src/core/envs';
import IncentiveModal from './IncentiveModal';

const Dashboard: React.FunctionComponent = () => {
  const { account, library } = useWeb3React();
  const location = useLocation();
  const history = useHistory();
  const { reserves } = useContext(ReservesContext);
  const reserveId = new URLSearchParams(location.search).get("reserveId")
  const [reserve, setReserve] = useState<GetAllReserves_reserves | undefined>(
    reserves.find((reserve) => reserveId === reserve.id)
  );
  const [balances, setBalances] = useState<{ loading: boolean, dai: BigNumber, incentive: BigNumber, governance: BigNumber }>({
    loading: true,
    dai: constants.Zero,
    incentive: constants.Zero,
    governance: constants.Zero,
  });
  const [incentiveModalVisible, setIncentiveModalVisible] = useState<boolean>(false);

  const {
    loading,
    data: userConnection,
    error,
  } = useQuery<GetUser>(
    GET_USER,
    { variables: { id: account?.toLocaleLowerCase() } }
  )

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
  })

  if (error) return (<ErrorPage />)

  return (
    <>
      {
        reserve &&
        <DepositOrWithdrawModal
          reserve={reserve}
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
          depositBalance={BigNumber.from(userConnection?.user?.lTokenBalance[0]?.balance || '0')}
        />
      }
      <IncentiveModal
        visible={incentiveModalVisible}
        onClose={() => {
          setIncentiveModalVisible(false)
        }}
        balance={balances.incentive}
      />
      <section className="dashboard main" style={{ backgroundImage: `url(${ServiceBackground})` }}>
        <div className="main__title-wrapper">
          <h2 className="main__title-text">DASHBOARD</h2>
        </div>
      </section>
      <section className="tokens">
        <div className="tokens__container">
          <div className="tokens__title">
            <p className="bold">DEPOSITS</p>
            <hr />
          </div>
          <table className="tokens__table">
            <thead className="tokens__table__header">
              <tr>
              </tr>
            </thead>
          </table>
        </div>
        <table className="tokens__table">
          <thead className="tokens__table__header">
            <tr>
              {
                ["Asset", "Deposit Balance", "Deposit APY", "Wallet Balance"].map((key, index) => {
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
                          <p>{reserve.name}</p>
                        </div>
                      </th>
                      <th>
                        {
                          loading ?
                            <Skeleton width={50} />
                            :
                            <p>{daiToUsd(userConnection?.user?.lTokenBalance[0]?.balance || '0')}</p>
                        }
                      </th>
                      <th>
                        {
                          loading ?
                            <Skeleton width={50} />
                            :
                            <p>
                              {toPercent(userConnection?.user?.lTokenBalance[0]?.lToken?.reserve?.depositAPY || '0')}
                            </p>
                        }
                      </th>
                      <th>
                        {
                          loading || balances.loading ?
                            <Skeleton width={50} />
                            :
                            <p>{daiToUsd(balances.dai)}</p>
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
                        <p>{reserve.name}</p>
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
        <div className="tokens__container">
          <div className="tokens__title">
            <p className="bold">ELFI Token</p>
            <hr />
          </div>
          <table className="tokens__table">
            <thead className="tokens__table__header">
              <tr>
              </tr>
            </thead>
          </table>
        </div>
        <table className="tokens__table">
          <thead className="tokens__table__header">
            <tr>
              {
                ["Assets", "ELFI Balance", "Wallet Balance"].map((key, index) => {
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
              className="tokens__table__row--disable"
              key={0}
              onClick={(e) => {
                e.preventDefault();
                setIncentiveModalVisible(true);
              }}
            >
              <th>
                <div>
                  <img src={ELFI} style={{ width: 40 }} alt="Token" />
                  <p>ELFI</p>
                </div>
              </th>
              <th>
                {
                  loading || balances.loading ?
                    <Skeleton width={50} />
                    :
                    <p>{`${formatComma(balances.incentive)} ELFI`}</p>
                }
              </th>
              <th>
                {
                  loading || balances.loading ?
                    <Skeleton width={50} />
                    :
                    <p>{`${formatComma(balances.governance)} ELFI`}</p>
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