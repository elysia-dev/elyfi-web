import { useQuery } from '@apollo/client';
import ReserveContext from 'src/contexts/ReservesContext';
import {
  GetAllReserves,
  GetAllReserves_reserves,
} from 'src/queries/__generated__/GetAllReserves';
import Loading from 'src/components/Loading';
import moment from 'moment';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { daiMoneyPoolTime } from 'src/core/data/moneypoolTimes';
import DepositSubgraph from 'src/clients/DepositSubgraph';

const minimumTimestamp = moment().subtract(35, 'days').unix();
const ReservesProvider: React.FC = (props) => {
  const [reserves, setReserves] = useState<GetAllReserves_reserves[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [round, setRound] = useState(
    daiMoneyPoolTime.findIndex((date) => {
      return moment().isBetween(date.startedAt, date.endedAt);
    }) + 1,
  );

  const refetch = async () => {
    setReserves(
      (await DepositSubgraph.getAllReserves1st(minimumTimestamp)).data.data
        .reserves,
    );
  };

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
    console.log(error)
  }, [error]);

  useEffect(() => {
    (async () => {
      try {
        setReserves(
          (await DepositSubgraph.getAllReserves1st(minimumTimestamp)).data.data
            .reserves,
        );
        setLoading(false);
      } catch (error: any) {
        console.error(error);
        setError(error);
      }
    })();
  }, []);

  if (loading) return <Loading />;

  return (
    <ReserveContext.Provider
      value={{
        reserves,
        refetch,
        round,
        setRound,
      }}>
      {props.children}
    </ReserveContext.Provider>
  );
};

export default ReservesProvider;
