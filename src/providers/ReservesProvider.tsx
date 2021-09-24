import { useQuery } from '@apollo/client';
import ReserveContext from 'src/contexts/ReservesContext';
import { GET_ALL_RESERVES } from 'src/queries/reserveQueries';
import { GetAllReserves, GetAllReserves_reserves } from 'src/queries/__generated__/GetAllReserves';
import Loading from 'src/components/Loading';
import moment from 'moment';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';

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

  const [reserves, setReserves] = useState<GetAllReserves_reserves[]>([]);

  useEffect(() => {
    if (error) {
      axios.get('https://elyfi-subgraph-cache.s3.ap-northeast-2.amazonaws.com/reserveResponse.json').then((res) => {
        setReserves(
          res.data.reserves as GetAllReserves_reserves[]
        )
      })
    }
  }, [error]);

  if (loading) return (<Loading />)

  return (
    <ReserveContext.Provider
      value={{
        reserves: error ? reserves : data?.reserves || [],
        refetch,
      }}
    >
      {props.children}
    </ReserveContext.Provider>
  );
}

export default ReservesProvider;