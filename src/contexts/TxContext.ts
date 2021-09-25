import TxStatus from '../enums/TxStatus';
import { ContractTransaction } from "ethers";
import { createContext } from 'react';
import RecentActivityType from 'src/enums/RecentActivityType';

export type TxContextType = {
  stakedToken: string,
  round: number,
  txWaiting: boolean,
  txStatus: TxStatus,
  txType: RecentActivityType,
  txNonce: number,
  transaction: ContractTransaction | undefined;
  txHash: string | null | undefined;
}

export interface ITxContext extends TxContextType {
  setTransaction: (tx: any, tracker: any, type: RecentActivityType, pending: () => void, callback: () => void) => void;
  initTransaction: (txStatus: TxStatus, txWaiting: boolean) => void;
  failTransaction: (tracker: any, onEvent: () => void, e: any) => void;
  reset: () => void
}

export const initialtxStatus = {
  stakedToken: 'EL',
  round: 0,
  txNonce: 0,
  txWaiting: false,
  txStatus: TxStatus.IDLE,
  txType: RecentActivityType.Idle,
  transaction: undefined,
  txHash: ""
}

export const initialTxContext = {
  ...initialtxStatus,
  setTransaction: (tx: any, tracker: any, type: RecentActivityType, pending: () => void, callback: () => void) => { },
  initTransaction: (txStatus: TxStatus, txWaiting: boolean) => { },
  failTransaction: (tracker: any, onEvent: () => void, e: any) => { },
  reset: () => { }
}

const TxContext = createContext<ITxContext>(initialTxContext);

export default TxContext;