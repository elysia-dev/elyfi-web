import { useContext, useEffect, useState } from 'react';
import { ContractTransaction } from 'ethers';
import TxStatus from 'src/enums/TxStatus';
import TxContext, {
  initialTxContext,
  ITxContext,
} from 'src/contexts/TxContext';
import RecentActivityType from 'src/enums/RecentActivityType';
import ethersJsErrors from 'src/utiles/ethersJsErrors';
import { Web3Context } from './Web3Provider';

const clearLocalStorage = () => {
  window.localStorage.removeItem('@txHash');
  window.localStorage.removeItem('@txNonce');
  window.localStorage.removeItem('@txType');
  window.localStorage.removeItem('@txStatus');
};

const TxProvider: React.FunctionComponent = (props) => {
  const { provider } = useContext(Web3Context);
  const [state, setState] = useState<ITxContext>(initialTxContext);

  const reset = () => {
    setState(initialTxContext);
    window.sessionStorage.setItem('@connect', 'false');
    clearLocalStorage();
  };

  const initTransaction = (txStatus: TxStatus, txWaiting: boolean) => {
    setState({ ...state, txStatus, txWaiting, error: '' });
  };

  const failTransaction = (tracker: any, onEvent: () => void, error: any) => {
    onEvent();
    tracker.canceled();

    setState({
      ...state,
      txStatus: TxStatus.FAIL,
      txWaiting: false,
      error: Number(error.code)
        ? error.message
        : ethersJsErrors.includes(error.code)
        ? error.code
        : JSON.parse(
            '{' +
              error.message.substring(
                error.message.indexOf('"message"'),
                error.message.lastIndexOf('}'),
              ),
          ).message,
    });
    clearLocalStorage();
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
      .catch((error) => {
        setState({
          ...state,
          txStatus: TxStatus.FAIL,
          txWaiting: false,
          txType: type,
          error,
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

    if (provider && connected !== 'false' && txHash) {
      setState({
        ...state,
        txHash,
        txWaiting: true,
        txStatus: TxStatus.PENDING,
        txNonce,
        txType,
      });

      provider
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
          console.error(`Transaction is falid`);
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
  }, [provider]);

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
