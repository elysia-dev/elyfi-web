import 'src/stylesheets/style.scss';
import ServiceBackground from 'src/assets/images/service-background.png';
import { useWeb3React } from '@web3-react/core';
import { useQuery } from '@apollo/client';
import { GetUser } from 'src/queries/__generated__/GetUser';
import { GET_USER } from 'src/queries/userQueries';
import ReserveData from 'src/core/data/reserves';
import { useEffect } from 'react';
import { daiToUsd, toPercent } from 'src/utiles/formatters';
import { useContext } from 'react';
import DepositOrWithdrawModal from 'src/components/DepositOrWithdrawModal';
import { useState } from 'react';
import ReservesContext from 'src/contexts/ReservesContext';
import { getERC20 } from 'src/core/utils/getContracts';
import { BigNumber, constants } from 'ethers';
import { GetAllReserves_reserves } from 'src/queries/__generated__/GetAllReserves';
import { useLocation } from 'react-router-dom';

const Dashboard: React.FunctionComponent = () => {
  const { account, library } = useWeb3React();
  const location = useLocation();
  const { reserves } = useContext(ReservesContext);
  const reserveId = new URLSearchParams(location.search).get("reserveId")
  const [reserve, setReserve] = useState<GetAllReserves_reserves | undefined>(
    reserves.find((reserve) => reserveId === reserve.id)
  );
  const [balance, setBalance] = useState<BigNumber>(constants.Zero);

  const {
    loading,
    data: userConnection,
    error,
  } = useQuery<GetUser>(
    GET_USER,
    { variables: { id: account?.toLocaleLowerCase() } }
  )

  const loadBalance = async (address: string) => {
    const contract = getERC20(address, library);

    if (!contract) return;

    setBalance(await contract.balanceOf(account))
  }

  useEffect(() => {
    if (!account) {
      return
    }

    loadBalance(reserves[0].id);
  }, [account])

  if (loading) return (<div> Loading </div>)
  if (error) return (<div> Error </div>)

  return (
    <>
      {
        reserve &&
        <DepositOrWithdrawModal
          reserve={reserve}
          tokenName={ReserveData[0].name}
          tokenImage={ReserveData[0].image}
          visible={!!reserve}
          onClose={() => setReserve(undefined)}
          balance={balance}
          depositBalance={BigNumber.from(userConnection?.user?.lTokenBalance[0]?.balance || '0')}
        />
      }
      <section className="dashboard main" style={{ backgroundImage: `url(${ServiceBackground})` }}>
        <div className="main__title-wrapper">
          <h2 className="main__title-text">Dashboard</h2>
        </div>
      </section>
      <section className="tokens">
        <div className="tokens__container">
          <div className="tokens__header-wrapper">
            <h1 className="tokens__header-text">
              TOKENS YOU DEPOSITED
            </h1>
            <hr className="tokens__header-line" />
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
                ["Assets", "Deposit Balance", "Deposit Rates", "Wallet Balance"].map((key, index) => {
                  return (
                    <th key={index}>
                      <p className="tokens__table__header__column$">
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
                        <p>
                          {
                            daiToUsd(userConnection?.user?.lTokenBalance[0]?.balance || '0')
                          }
                        </p>
                      </th>
                      <th>
                        <p>
                          {
                            toPercent(userConnection?.user?.lTokenBalance[0]?.lToken?.reserve?.depositAPY || '0')
                          }
                        </p>
                      </th>
                      <th>
                        <p>
                          {
                            daiToUsd(balance)
                          }
                        </p>
                      </th>
                    </tr>
                  )
                }
                return (
                  <tr key={index}>
                    <th>
                      <div>
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
    </>
  );
}

export default Dashboard;