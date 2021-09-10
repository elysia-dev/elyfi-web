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
}

export interface ITxContext extends TxContextType { 
  setTransaction: (tx: any, tracker: any, pending: () => void, callback: () => void) => void;
  initialTransaction: (txState: txStatus, txWaiting: boolean) => void;
  FailTransaction: (tracker: any, onEvent: () => void) => void;
}

export const initialTxState = {
  stakedToken: 'EL',
  round: 0,
  txWaiting: false,
  txState: txStatus.IDLE,
  transaction: undefined
}

export const initialTxContext = {
  ...initialTxState,
  setTransaction: (tx: any, tracker: any, pending: () => void, callback: () => void) => { },
  initialTransaction: (txState: txStatus, txWaiting: boolean) => { },
  FailTransaction: (tracker: any, onEvent: () => void) => { }
}

const TxContext = createContext<ITxContext>(initialTxContext);

export default TxContext;