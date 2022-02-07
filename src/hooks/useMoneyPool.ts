import { useWeb3React } from '@web3-react/core';
import { useMemo, useContext } from 'react';
import { MoneyPool__factory } from '@elysia-dev/contract-typechain';
import useCurrentMoneypoolAddress from 'src/hooks/useCurrnetMoneypoolAddress';
import { Web3Context } from 'src/providers/Web3Provider';

const useMoneyPool = () => {
  const currentMoneypoolAddress = useCurrentMoneypoolAddress();
  const { provider } = useContext(Web3Context);

  const contract = useMemo(() => {
    if (!provider) return;
    return MoneyPool__factory.connect(
      currentMoneypoolAddress,
      provider.getSigner(),
    );
  }, [provider, currentMoneypoolAddress]);

  return contract;
};

export default useMoneyPool;
