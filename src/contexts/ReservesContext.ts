import { createContext } from 'react';
import { GetAllReserves_reserves } from 'src/queries/__generated__/GetAllReserves';

export type ReservesContextBase = {
  reserves: GetAllReserves_reserves[];
}

export interface ITokenContext extends ReservesContextBase {
}

export const initialReservesContextBase: ReservesContextBase = {
  reserves: []
}

export const initialReservesContext: ITokenContext = {
  ...initialReservesContextBase,
}

const ReservesContext = createContext<ITokenContext>(initialReservesContext);

export default ReservesContext;