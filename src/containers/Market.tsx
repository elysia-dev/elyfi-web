import 'src/stylesheets/style.scss';
import ServiceBackground from 'src/shared/images/service-background.png';
import { useQuery } from '@apollo/client';
import { GetAllReserves } from 'src/queries/__generated__/GetAllReserves';
import { GET_ALL_RESERVES } from 'src/queries/reserveQueries';
import { BigNumber, constants, utils } from 'ethers';
import { useHistory } from 'react-router-dom';
import ReserveData from 'src/core/data/reserves';
import { daiToUsd, toPercent } from 'src/utiles/formatters';

const usdFormatter = new Intl.NumberFormat('en', { style: 'currency', currency: 'USD' })

const Market: React.FunctionComponent = () => {
  const history = useHistory();
  const {
    loading: isReservesLoading,
    data: reserveConnection,
    error,
  } = useQuery<GetAllReserves>(
    GET_ALL_RESERVES
  )

  if (isReservesLoading) return (<div> Loading </div>)
  if (error) return (<div> Error </div>)

  return (
    <>
      <section className="dashboard main" style={{ backgroundImage: `url(${ServiceBackground})` }}>
        <div className="main__title-wrapper">
          <h4 className="main__title-text">Total Market Size</h4>
          <h2 className="main__title-text">
            {
              usdFormatter.format(
                parseInt(
                  utils.formatEther(
                    reserveConnection?.reserves.reduce((res, cur) => res.add(BigNumber.from(cur.toatlDeposit)), constants.Zero) || constants.Zero
                  )
                )
              )
            }
          </h2>
        </div>
      </section>
      <section className="tokens">
        <table className="tokens__table">
          <thead className="tokens__table__header">
            <tr>
              {["Assets", "Total Deposits", "Deposit APY", "Total Loans", "Loan APY"].map((name, index) => {
                return (
                  <th>
                    <p className={`tokens__table__header__column`}>{name}</p>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody className="tokens__table-body">
            {
              ReserveData.map((reserve, index) => {
                return (
                  <tr
                    key={index}
                    onClick={() => { index === 0 && history.push(`markets/${reserveConnection?.reserves[0].id}`) }}
                  >
                    <th>
                      <div>
                        <img src={reserve.image} alt='token' style={{ width: 40 }} />
                        <p>{reserve.name}</p>
                      </div>
                    </th>
                    <th>
                      <p>
                        {index === 0 ? daiToUsd(reserveConnection?.reserves[0].toatlDeposit) : '-'}
                      </p>
                    </th>
                    <th>
                      <p>
                        {index === 0 ? toPercent(reserveConnection?.reserves[0].depositAPY) : '-'}
                      </p>
                    </th>
                    <th>
                      <p>
                        {index === 0 ? daiToUsd(reserveConnection?.reserves[0].totalBorrow) : '-'}
                      </p>
                    </th>
                    <th>
                      <p>
                        {index === 0 ? toPercent(reserveConnection?.reserves[0].borrowAPY) : '-'}
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

export default Market;