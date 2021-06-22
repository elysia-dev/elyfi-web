import 'src/stylesheets/style.scss';
import ServiceBackground from 'src/shared/images/service-background.png';
import { useQuery } from '@apollo/client';
import { GetAllReserves } from 'src/queries/__generated__/GetAllReserves';
import { GET_ALL_RESERVES } from 'src/queries/getReserves';
import TokenImage from 'src/shared/images/tokens/bnb.png';
import { BigNumber, constants, utils } from 'ethers';

const usdFormatter = new Intl.NumberFormat('en', { style: 'currency', currency: 'USD' })

const Market: React.FunctionComponent = () => {
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
              reserveConnection?.reserves.map((reserve, index) => {
                return (
                  <tr key={index}>
                    <th>
                      <div style={{ justifyContent: 'left', gap: 10 }}>
                        <img src={TokenImage} alt='token' />
                        <p>DAI</p>
                      </div>
                    </th>
                    <th>
                      <p>
                        {usdFormatter.format(parseInt(utils.formatEther(reserve.toatlDeposit)))}
                      </p>
                    </th>
                    <th>
                      <p>
                        {utils.formatUnits(reserve.depositAPY, 25) + "%"}
                      </p>
                    </th>
                    <th>
                      <p>
                        {usdFormatter.format(parseInt(utils.formatEther(reserve.totalBorrow)))}
                      </p>
                    </th>
                    <th>
                      <p>
                        {utils.formatUnits(reserve.borrowAPY, 25) + "%"}
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