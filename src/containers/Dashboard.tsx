import 'src/stylesheets/style.scss';
import ServiceBackground from 'src/shared/images/service-background.png';
import { useWeb3React } from '@web3-react/core';
import { useQuery } from '@apollo/client';
import { GetUser } from 'src/queries/__generated__/GetUser';
import { GET_USER } from 'src/queries/userQueries';
import ReserveData from 'src/core/data/reserves';
import { useEffect } from 'react';
import { daiToUsd, toPercent } from 'src/utiles/formatters';
import { useContext } from 'react';
import BalanceContext from 'src/contexts/BalanceContext';

const Dashboard: React.FunctionComponent = () => {
  const { account } = useWeb3React();
  const { balance, loadBalance } = useContext(BalanceContext);
  const {
    loading,
    data: userConnection,
    error,
  } = useQuery<GetUser>(
    GET_USER,
    { variables: { id: account?.toLocaleLowerCase() } }
  )

  useEffect(() => {
    if (!account || !userConnection?.user?.lTokenBalance[0].lToken.reserve.id) {
      return
    }

    loadBalance(userConnection?.user?.lTokenBalance[0].lToken.reserve.id);
  }, [account, userConnection])

  if (loading) return (<div> Loading </div>)
  if (error) return (<div> Error </div>)

  return (
    <>
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
                return (
                  <tr key={index}>
                    <th>
                      <div>
                        <img src={reserve.image} style={{ width: 40 }} alt="Token" />
                        <p>{reserve.name}</p>
                      </div>
                    </th>
                    <th>
                      <p>
                        {
                          index === 0 ?
                            daiToUsd(userConnection?.user?.lTokenBalance[0]?.balance || '0') :
                            '-'
                        }
                      </p>
                    </th>
                    <th>
                      <p>
                        {
                          index === 0 ?
                            toPercent(userConnection?.user?.lTokenBalance[0]?.lToken.reserve.depositAPY || '0') :
                            '-'
                        }
                      </p>
                    </th>
                    <th>
                      <p>
                        {
                          index === 0 ?
                            daiToUsd(balance || '0') : '-'
                        }
                      </p>
                    </th>
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