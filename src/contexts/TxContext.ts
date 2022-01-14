import { ContractTransaction } from 'ethers';
import { createContext } from 'react';
import RecentActivityType from 'src/enums/RecentActivityType';
import TxStatus from '../enums/TxStatus';

export type TxContextType = {
  stakedToken: string;
  round: number;
  txWaiting: boolean;
  txStatus: TxStatus;
  txType: RecentActivityType;
  txNonce: number;
  transaction: ContractTransaction | undefined;
  txHash: string | null | undefined;
  error?: string;
};

export interface ITxContext extends TxContextType {
  setTransaction: (
    tx: ContractTransaction,
    emitter: {
      clicked: () => void;
      created: () => void;
      canceled: () => void;
    },
    type: RecentActivityType,
    pending: () => void,
    callback: () => void,
  ) => void;
  initTransaction: (txStatus: TxStatus, txWaiting: boolean) => void;
  failTransaction: (
    emitter: {
      clicked: () => void;
      created: () => void;
      canceled: () => void;
    },
    onEvent: () => void,
    e: Error,
  ) => void;
  reset: () => void;
}

export const initialtxStatus = {
  stakedToken: 'EL',
  round: 0,
  txNonce: 0,
  txWaiting: false,
  txStatus: TxStatus.IDLE,
  txType: RecentActivityType.Idle,
  transaction: undefined,
  txHash: '',
  error: '',
};

export const initialTxContext = {
  ...initialtxStatus,
  setTransaction: (
    tx: ContractTransaction,
    emitter: {
      clicked: () => void;
      created: () => void;
      canceled: () => void;
    },
    type: RecentActivityType,
    pending: () => void,
    callback: () => void,
  ): void => {},
  initTransaction: (txStatus: TxStatus, txWaiting: boolean): void => {},
  failTransaction: (
    emitter: {
      clicked: () => void;
      created: () => void;
      canceled: () => void;
    },
    onEvent: () => void,
    e: Error,
  ): void => {},
  reset: (): void => {},
};

const TxContext = createContext<ITxContext>(initialTxContext);

export default TxContext;
