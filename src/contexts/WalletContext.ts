import { createContext } from 'react';
import UserType from '../enums/UserType';

export type WalletContextState = {
  userType: UserType;
}

export interface IWalletContext extends WalletContextState {
  activateWallet: () => void;
}

export const initialWalletState = {
  userType: UserType.Guest
}

export const initialWalletContext = {
  ...initialWalletState,
  activateWallet: () => { }
}

const WalletContext = createContext<IWalletContext>(initialWalletContext);

export default WalletContext;