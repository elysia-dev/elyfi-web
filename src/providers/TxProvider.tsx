
import React, { useEffect, useState } from 'react'
import useWatingTx from 'src/hooks/useWaitingTx';
import useTxTracking from 'src/hooks/useTxTracking';
import { ContractTransaction,  } from "ethers";
import txStatus from 'src/enums/txStatus';
import TxContext, { initialTxContext, ITxContext} from 'src/contexts/TxContext';
import detectEthereumProvider from '@metamask/detect-provider';
import { useWeb3React } from '@web3-react/core';

const TxProvider: React.FunctionComponent = (props) => {
  const { library } = useWeb3React();
  const [state, setState] = useState<ITxContext>(initialTxContext);
  
  const { waiting, wait } = useWatingTx();
  const initTxTracker = useTxTracking();

  const reset = () => {
    setState(initialTxContext);
    window.sessionStorage.setItem("@connect", "false");
    window.localStorage.removeItem("@txHash")
    window.localStorage.removeItem("@txNonce");
    window.localStorage.removeItem("@txStatus");
    window.localStorage.removeItem("@txTracking");
  }
  const initTransaction = (txState: txStatus, txWaiting: boolean) => {
    setState({ ...state, txState: txState, txWaiting: txWaiting })
  }
  const failTransaction = (tracker: any, onEvent: () => void, e: any) => {
    onEvent();
    tracker.canceled();
    setState({ ...state, txState: txStatus.IDLE, txWaiting: false })
    window.localStorage.setItem("@txLoad", "false");
    window.localStorage.removeItem("@txHash")
    window.localStorage.removeItem("@txNonce");
    window.localStorage.removeItem("@txStatus");
    console.log(e)
  }

  const setTransaction = (tx: ContractTransaction, tracker: any, pending: () => void, callback: () => void) => {
    tracker.created();
    setState({ ...state, txState: txStatus.PENDING, txWaiting: true, txHash: tx.hash })
    window.localStorage.setItem("@txLoad", "true");
    window.localStorage.setItem("@txHash", tx.hash);
    window.localStorage.setItem("@txNonce", tx.nonce.toString());
    window.localStorage.setItem("@txStatus", "PENDING");
    window.localStorage.removeItem("@alreadyLoaded");
    pending();
    wait(
      tx as any,
      () => {
        callback();
        setState({ ...state, txState: txStatus.CONFIRM, txWaiting: false })
        window.localStorage.setItem("@txLoad", "false");
        window.localStorage.setItem("@txStatus", "CONFIRM");
      }
    )
  }


  return (
    <TxContext.Provider value={{
      ...state,
      setTransaction,
      initTransaction,
      failTransaction,
      reset
    }}>
      {props.children}
    </TxContext.Provider>
  )
}

export default TxProvider
