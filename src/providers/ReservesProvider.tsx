import { useQuery } from '@apollo/client';
import ReserveContext from 'src/contexts/ReservesContext';
import { GET_ALL_RESERVES } from 'src/queries/reserveQueries';
import { GetAllReserves } from 'src/queries/__generated__/GetAllReserves';

const ReservesProvider: React.FC = (props) => {
  const {
    loading,
    data,
    error,
  } = useQuery<GetAllReserves>(
    GET_ALL_RESERVES,
  )

  if (loading) return (<div> Loading </div>)
  if (error || !data?.reserves[0]) return (<div> Error </div>)

  return (
    <ReserveContext.Provider
      value={{
        reserves: data?.reserves || [],
      }}>
      {props.children}
    </ReserveContext.Provider>
  );
}

export default ReservesProvider;