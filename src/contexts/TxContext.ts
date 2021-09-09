import Token from '../enums/Token';
import txStatus from '../enums/txStatus';
import StakingPoolStatus from '../enums/StakingPoolStatus';
import { BigNumber } from 'ethers';
import { createContext } from 'react';

export type TxContextType = {
  stakedToken: string,
  round: number,
  txWaiting: boolean,
  txStatus: txStatus
}

export interface ITxContext extends TxContextType { 
  setTransaction: (tx: any, tracker: any, pending: () => void, callback: () => void) => void;
}

export const initialTxState = {
  stakedToken: 'EL',
  round: 0,
  txWaiting: false,
  txStatus: txStatus.IDLE
}

export const initialTxContext = {
  ...initialTxState,
  setTransaction: (tx: any, tracker: any, pending: () => void, callback: () => void) => { }
}

const TxContext = createContext<ITxContext>(initialTxContext);

export default TxContext;