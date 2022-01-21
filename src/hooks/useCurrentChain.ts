import { useWeb3React } from '@web3-react/core';
import { useMemo } from 'react';
import { IMainnet, mainnets } from 'src/core/data/mainnets';

const useCurrentChain = (): IMainnet | undefined => {
  const { chainId } = useWeb3React();

  const currentChain = useMemo(() => {
    return mainnets.find((mainnet) => {
      return mainnet.chainId === chainId;
    });
  }, [chainId]);

  return currentChain;
};

export default useCurrentChain;
