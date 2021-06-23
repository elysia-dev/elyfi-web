import { BigNumber, constants } from 'ethers';
import { createContext } from 'react';

export type BalanceContextBase = {
  balance: BigNumber;
}

export interface ITokenContext extends BalanceContextBase {
  loadBalance: (contractAddress: string) => void
}

export const initialBalanceContextBase: BalanceContextBase = {
  balance: constants.Zero
}

export const initialBalanceContext: ITokenContext = {
  ...initialBalanceContextBase,
  loadBalance: () => { },
}

const BalanceContext = createContext<ITokenContext>(initialBalanceContext);

export default BalanceContext;