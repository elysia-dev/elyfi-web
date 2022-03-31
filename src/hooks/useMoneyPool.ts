import { useWeb3React } from '@web3-react/core';
import { useMemo } from 'react';
import { MoneyPool__factory, MoneyPool } from '@elysia-dev/contract-typechain';
import useCurrentMoneypoolAddress from 'src/hooks/useCurrnetMoneypoolAddress';

const useMoneyPool = (): MoneyPool | undefined => {
  const currentMoneypoolAddress = useCurrentMoneypoolAddress();
  const { library } = useWeb3React();

  const contract = useMemo(() => {
    if (!library) return;
    return MoneyPool__factory.connect(
      currentMoneypoolAddress,
      library.getSigner(),
    );
  }, [library, currentMoneypoolAddress]);

  return contract;
};

export default useMoneyPool;
