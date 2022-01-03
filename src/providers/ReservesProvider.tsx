import { useQuery } from '@apollo/client';
import ReserveContext from 'src/contexts/ReservesContext';
import { GET_ALL_RESERVES } from 'src/queries/reserveQueries';
import {
  GetAllReserves,
  GetAllReserves_reserves,
} from 'src/queries/__generated__/GetAllReserves';
import Loading from 'src/components/Loading';
import moment from 'moment';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { daiMoneyPoolTime } from 'src/core/data/moneypoolTimes';

const minimumTimestamp = moment().subtract(35, 'days').unix();
const ReservesProvider: React.FC = (props) => {
  const { loading, data, error, refetch } = useQuery<GetAllReserves>(
    GET_ALL_RESERVES,
    {
      variables: { minimumTimestamp },
    },
  );

  const [reserves, setReserves] = useState<GetAllReserves_reserves[]>([]);
  const [round, setRound] = useState(
    daiMoneyPoolTime.findIndex((date) => {
      return moment().isBetween(date.startedAt, date.endedAt);
    }) + 1,
  );

  useEffect(() => {
    if (error) {
      axios
        .get(
          'https://elyfi-subgraph-cache.s3.ap-northeast-2.amazonaws.com/reserveResponse.json',
        )
        .then((res) => {
          setReserves(res.data.data.reserves as GetAllReserves_reserves[]);
        });
    }
  }, [error]);

  useEffect(() => {
    if (round === 1) {
      axios
        .get(
          'https://elyfi-subgraph-cache.s3.ap-northeast-2.amazonaws.com/reserveResponse.json',
        )
        .then((res) => {
          setReserves(res.data.data.reserves as GetAllReserves_reserves[]);
        });
    } else {
      axios
        .get(
          'https://elyfi-subgraph-cache.s3.ap-northeast-2.amazonaws.com/reserveResponse.json',
        )
        .then((res) => {
          setReserves(res.data.data.reserves as GetAllReserves_reserves[]);
        });
    }
  }, [round]);

  if (loading) return <Loading />;

  return (
    <ReserveContext.Provider
      value={{
        reserves: error ? reserves : data?.reserves || [],
        refetch,
        round,
        setRound,
      }}>
      {props.children}
    </ReserveContext.Provider>
  );
};

export default ReservesProvider;
