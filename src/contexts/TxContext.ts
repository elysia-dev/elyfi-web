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
  setTransaction: (
    status: StakingPoolStatus,
    stakedToken: "EL" | "ELFI",
    round: number,
    value: string,
    isMax: boolean,
    stakedBalance: BigNumber,
    trackModal: string
    ) => void;
}

export const initialTxState = {
  stakedToken: 'EL',
  round: 0,
  txWaiting: false,
  txStatus: txStatus.IDLE
}

export const initialTxContext = {
  ...initialTxState,
  setTransaction: (
    status: StakingPoolStatus,
    stakedToken: string,
    round: number,
    value: string,
    isMax: boolean,
    stakedBalance: BigNumber,
    trackModal: string
    ) => { }
}

const TxContext = createContext<ITxContext>(initialTxContext);

export default TxContext;