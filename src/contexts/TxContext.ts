import Token from '../enums/Token';
import txStatus from '../enums/txStatus';
import StakingPoolStatus from '../enums/StakingPoolStatus';
import { ContractTransaction } from "ethers";
import { createContext } from 'react';

export type TxContextType = {
  stakedToken: string,
  round: number,
  txWaiting: boolean,
  txState: txStatus,
  transaction: ContractTransaction | undefined;
  txHash: string;
}

export interface ITxContext extends TxContextType { 
  setTransaction: (tx: any, tracker: any, pending: () => void, callback: () => void) => void;
  initTransaction: (txState: txStatus, txWaiting: boolean) => void;
  failTransaction: (tracker: any, onEvent: () => void, e: any) => void;
  reset: () => void
}

export const initialTxState = {
  stakedToken: 'EL',
  round: 0,
  txWaiting: false,
  txState: txStatus.IDLE,
  transaction: undefined,
  txHash: ""
}

export const initialTxContext = {
  ...initialTxState,
  setTransaction: (tx: any, tracker: any, pending: () => void, callback: () => void) => { },
  initTransaction: (txState: txStatus, txWaiting: boolean) => { },
  failTransaction: (tracker: any, onEvent: () => void, e: any) => { },
  reset: () => { }
}

const TxContext = createContext<ITxContext>(initialTxContext);

export default TxContext;