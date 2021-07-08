import { ApolloQueryResult, OperationVariables } from '@apollo/client';
import { createContext } from 'react';
import { GetAllReserves, GetAllReserves_reserves } from 'src/queries/__generated__/GetAllReserves';

export type ReservesContextBase = {
  reserves: GetAllReserves_reserves[];
}

export interface ITokenContext extends ReservesContextBase {
  refetch: (variables?: Partial<OperationVariables> | undefined) => Promise<ApolloQueryResult<GetAllReserves>>
}

export const initialReservesContextBase: ReservesContextBase = {
  reserves: [],
}

export const initialReservesContext: ITokenContext = {
  ...initialReservesContextBase,
  refetch: async () => { return {} as ApolloQueryResult<GetAllReserves> }
}

const ReservesContext = createContext<ITokenContext>(initialReservesContext);

export default ReservesContext;