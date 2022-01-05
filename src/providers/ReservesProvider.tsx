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
  const [reserves1st, setReserves1st] = useState<GetAllReserves_reserves[]>([]);
  const [reserves2nd, setReserves2nd] = useState<GetAllReserves_reserves[]>([]);

  const refetch = async () => {
    if (round === 1) {
      setReserves(
        (await DepositSubgraph.getAllReserves1st(minimumTimestamp)).data.data
          .reserves,
      );
    }
    if (round === 2) {
      setReserves([
        {
          id: '0x6b175474e89094c44da98b954eedeac495271d0f',
          lTokenInterestIndex: '1012372411382689869469459551',
          lastUpdateTimestamp: 1641039101,
          borrowAPY: '59494954239559184562450860',
          depositAPY: '0',
          totalBorrow: '377531775002316856631831',
          totalDeposit: '530150738279344256367828',
          lTokenUserBalanceCount: 54,
          dTokenUserBalanceCount: 2,
          deposit: [],
          incentivePool: {
            __typename: 'IncentivePool',
            id: '0xd1e55bff66da2dc0290269b8e4b843531eba7628',
          },
          borrow: [],
          repay: [],
          reserveHistory: [],
          lToken: {
            __typename: 'LToken',
            id: '0x527c901e05228f54a9a63151a924a97622f9f173',
          },
        },
        {
          id: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          lTokenInterestIndex: '0',
          lastUpdateTimestamp: 1641039101,
          borrowAPY: '0',
          depositAPY: '0',
          totalBorrow: '0',
          totalDeposit: '0',
          lTokenUserBalanceCount: 54,
          dTokenUserBalanceCount: 2,
          deposit: [],
          incentivePool: {
            __typename: 'IncentivePool',
            id: '0xd1e55bff66da2dc0290269b8e4b843531eba7628',
          },
          borrow: [],
          repay: [],
          reserveHistory: [],
          lToken: {
            __typename: 'LToken',
            id: '0x527c901e05228f54a9a63151a924a97622f9f173',
          },
        },
      ]);
    }
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
  }, [error]);

  useEffect(() => {
    (async () => {
      try {
        console.log(
          (await DepositSubgraph.getAllReserves1st(minimumTimestamp)).data.data
            .reserves,
        );
        setReserves1st(
          (await DepositSubgraph.getAllReserves1st(minimumTimestamp)).data.data
            .reserves,
        );
        setReserves2nd([
          {
            id: '0x6b175474e89094c44da98b954eedeac495271d0f',
            lTokenInterestIndex: '1012372411382689869469459551',
            lastUpdateTimestamp: 1641039101,
            borrowAPY: '59494954239559184562450860',
            depositAPY: '0',
            totalBorrow: '377531775002316856631831',
            totalDeposit: '530150738279344256367828',
            lTokenUserBalanceCount: 54,
            dTokenUserBalanceCount: 2,
            deposit: [],
            incentivePool: {
              __typename: 'IncentivePool',
              id: '0xd1e55bff66da2dc0290269b8e4b843531eba7628',
            },
            borrow: [],
            repay: [],
            reserveHistory: [],
            lToken: {
              __typename: 'LToken',
              id: '0x527c901e05228f54a9a63151a924a97622f9f173',
            },
          },
          {
            id: '0xdac17f958d2ee523a2206206994597c13d831ec7',
            lTokenInterestIndex: '0',
            lastUpdateTimestamp: 1641039101,
            borrowAPY: '0',
            depositAPY: '0',
            totalBorrow: '0',
            totalDeposit: '0',
            lTokenUserBalanceCount: 54,
            dTokenUserBalanceCount: 2,
            deposit: [],
            incentivePool: {
              __typename: 'IncentivePool',
              id: '0xda2376fc014d0f351a7a9ebaf48b26902168e6d3',
            },
            borrow: [],
            repay: [],
            reserveHistory: [],
            lToken: {
              __typename: 'LToken',
              id: '0x527c901e05228f54a9a63151a924a97622f9f173',
            },
          },
        ]);
      } catch (error: any) {
        console.error(error);
        setError(error);
      }
    })();
  }, []);

  useEffect(() => {
    if (reserves1st.length === 0) return;
    if (round === 1) {
      setReserves(reserves1st);
    }
    if (round === 2) {
      setReserves(reserves2nd);
    }
    setLoading(false);
  }, [round, reserves1st, reserves2nd]);

  if (loading) return <Loading />;

  return (
    <ReserveContext.Provider
      value={{
        reserves1st,
        reserves2nd,
        refetch,
        round,
        setRound,
      }}>
      {props.children}
    </ReserveContext.Provider>
  );
};

export default ReservesProvider;
