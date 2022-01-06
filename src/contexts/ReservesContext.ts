import { ApolloQueryResult, OperationVariables } from '@apollo/client';
import { createContext, Dispatch, SetStateAction } from 'react';
import {
  GetAllReserves,
  GetAllReserves_reserves,
} from 'src/queries/__generated__/GetAllReserves';

export type ReservesContextBase = {
  reserves: GetAllReserves_reserves[];
  round: number;
};

export interface ITokenContext extends ReservesContextBase {
  refetch: () => Promise<void>;
  setRound: Dispatch<SetStateAction<number>>;
}

export const initialReservesContextBase: ReservesContextBase = {
  reserves: [],
  round: 1,
};

export const initialReservesContext: ITokenContext = {
  ...initialReservesContextBase,
  refetch: async () => {},
  setRound: () => {},
};

const ReservesContext = createContext<ITokenContext>(initialReservesContext);

export default ReservesContext;
