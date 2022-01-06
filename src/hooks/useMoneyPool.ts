import { useWeb3React } from '@web3-react/core';
import { useContext, useMemo } from 'react';
import { MoneyPool__factory } from '@elysia-dev/contract-typechain';
import envs from 'src/core/envs';
import ReservesContext from 'src/contexts/ReservesContext';

const useMoneyPool = () => {
  const { library } = useWeb3React();
  const contract = useMemo(() => {
    if (!library) return;
    return MoneyPool__factory.connect(
      envs.moneyPoolAddress,
      library.getSigner(),
    );
  }, [library]);

  return contract;
};

export default useMoneyPool;
