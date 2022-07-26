import { useWeb3React } from '@web3-react/core';
import { useMemo } from 'react';
import { MoneyPoolFactory, MoneyPool } from '@elysia-dev/elyfi-v1-sdk';
import useCurrentMoneypoolAddress from 'src/hooks/useCurrnetMoneypoolAddress';

const useMoneyPool = (): MoneyPool | undefined => {
  const currentMoneypoolAddress = useCurrentMoneypoolAddress();
  const { library } = useWeb3React();

  const contract = useMemo(() => {
    if (!library) return;
    return MoneyPoolFactory.connect(
      currentMoneypoolAddress,
      library.getSigner(),
    );
  }, [library, currentMoneypoolAddress]);

  return contract;
};

export default useMoneyPool;
