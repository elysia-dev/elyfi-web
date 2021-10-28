import { useEffect, useState } from 'react';
import { ContractTransaction } from 'ethers';
import TxStatus from 'src/enums/TxStatus';
import TxContext, {
  initialTxContext,
  ITxContext,
} from 'src/contexts/TxContext';
import RecentActivityType from 'src/enums/RecentActivityType';
import { useWeb3React } from '@web3-react/core';

const clearLocalStorage = () => {
  window.localStorage.removeItem('@txHash');
  window.localStorage.removeItem('@txNonce');
  window.localStorage.removeItem('@txType');
  window.localStorage.removeItem('@txStatus');
};

const TxProvider: React.FunctionComponent = (props) => {
  const { library } = useWeb3React();
  const [state, setState] = useState<ITxContext>(initialTxContext);

  const reset = () => {
    setState(initialTxContext);
    window.sessionStorage.setItem('@connect', 'false');
    clearLocalStorage();
  };

  const initTransaction = (txStatus: TxStatus, txWaiting: boolean) => {
    setState({ ...state, txStatus, txWaiting });
  };

  const failTransaction = (tracker: any, onEvent: () => void, e: any) => {
    onEvent();
    tracker.canceled();
    setState({
      ...state,
      txStatus: TxStatus.FAIL,
      txWaiting: false,
    });
    clearLocalStorage();
    console.log(e);
  };

  const setTransaction = (
    tx: ContractTransaction,
    tracker: any,
    type: RecentActivityType,
    pending: () => void,
    callback: () => void,
  ) => {
    tracker.created();
    window.localStorage.setItem('@txHash', tx.hash);
    window.localStorage.setItem('@txNonce', tx.nonce.toString());
    window.localStorage.setItem('@txType', type);
    window.localStorage.setItem('@txStatus', TxStatus.PENDING);

    setState({
      ...state,
      txStatus: TxStatus.PENDING,
      txWaiting: true,
      txType: type,
      txHash: tx.hash,
      txNonce: tx.nonce,
    });

    pending();

    tx.wait()
      .then(() => {
        callback();
        setState({
          ...state,
          txStatus: TxStatus.CONFIRM,
          txWaiting: false,
          txType: type,
        });
      })
      .catch(() => {
        setState({
          ...state,
          txStatus: TxStatus.FAIL,
          txWaiting: false,
          txType: type,
        });
      })
      .finally(() => {
        clearLocalStorage();
        setTimeout(() => {
          setState({
            ...state,
            txStatus: TxStatus.IDLE,
            txHash: null,
            txWaiting: false,
          });
        }, 5000);
      });
  };

  useEffect(() => {
    const connected = window.sessionStorage.getItem('@connect');
    const txHash = window.localStorage.getItem('@txHash');
    const txNonce = parseInt(
      window.localStorage.getItem('@txNonce') || '0',
      10,
    );
    const txType = window.localStorage.getItem('@txType') as RecentActivityType;

    if (library && connected !== 'false' && txHash) {
      setState({
        ...state,
        txHash,
        txWaiting: true,
        txStatus: TxStatus.PENDING,
        txNonce,
        txType,
      });

      library
        .waitForTransaction(txHash)
        .then((res: any) => {
          if (res && res.status === 1) {
            setState({
              ...state,
              txStatus: TxStatus.CONFIRM,
              txWaiting: false,
              txType,
            });
            initTransaction(TxStatus.CONFIRM, false);
          } else if (res && res.status !== 1) {
            setState({
              ...state,
              txStatus: TxStatus.FAIL,
              txWaiting: false,
              txType,
            });
          }
        })
        .catch((e: any) => {
          initTransaction(TxStatus.FAIL, false);
          console.log(e);
        })
        .finally(() => {
          clearLocalStorage();
          setTimeout(() => {
            setState({
              ...state,
              txStatus: TxStatus.IDLE,
              txHash: null,
              txWaiting: false,
            });
          }, 5000);
        });
    }
  }, [library]);

  return (
    <TxContext.Provider
      value={{
        ...state,
        setTransaction,
        initTransaction,
        failTransaction,
        reset,
      }}>
      {props.children}
    </TxContext.Provider>
  );
};

export default TxProvider;
