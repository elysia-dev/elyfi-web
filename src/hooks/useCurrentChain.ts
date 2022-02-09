import { useWeb3React } from '@web3-react/core';
import { useContext, useMemo } from 'react';
import { IMainnet, mainnets } from 'src/core/data/mainnets';
import { Web3Context } from 'src/providers/Web3Provider';

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
