import { useContext, useMemo } from 'react';
import { MoneyPool__factory } from '@elysia-dev/contract-typechain';
import envs from 'src/core/envs';
import { Web3Context } from 'src/providers/Web3Provider';

const useMoneyPool = () => {
  const { provider } = useContext(Web3Context);
  const contract = useMemo(() => {
    if (!provider) return;
    return MoneyPool__factory.connect(
      envs.moneyPoolAddress,
      provider.getSigner(),
    );
  }, [provider]);

  return contract;
};

export default useMoneyPool;
