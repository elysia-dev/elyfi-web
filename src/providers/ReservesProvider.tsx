import { useQuery } from '@apollo/client';
import ReserveContext from 'src/contexts/ReservesContext';
import { GET_ALL_RESERVES } from 'src/queries/reserveQueries';
import { GetAllReserves } from 'src/queries/__generated__/GetAllReserves';
import Loading from 'src/components/Loading';
import ErrorPage from 'src/components/ErrorPage';
import moment from 'moment';

const ReservesProvider: React.FC = (props) => {
  const {
    loading,
    data,
    error,
    refetch
  } = useQuery<GetAllReserves>(
    GET_ALL_RESERVES,
    {
      variables: { minTimestamp: moment().subtract(7, 'days').unix() }
    }
  )

  if (loading) return (<Loading />)
  if (error || !data?.reserves[0]) return (<ErrorPage />)

  return (
    <ReserveContext.Provider
      value={{
        reserves: data?.reserves || [],
        refetch,
      }}
    >
      {props.children}
    </ReserveContext.Provider>
  );
}

export default ReservesProvider;