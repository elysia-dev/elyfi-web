import { ContractTransaction } from 'ethers';
import { useState } from 'react';

const useWaitingTx = (): {
  waiting: boolean;
  wait: (tx: ContractTransaction, callback: () => void) => void;
} => {
  const [waiting, setWaiting] = useState<boolean>(false);

  const wait = async (tx: ContractTransaction, callback: () => void) => {
    setWaiting(true);

    tx.wait().then(() => {
      callback();
      setWaiting(false);
    });
  };

  return {
    waiting,
    wait,
  };
};

export default useWaitingTx;
