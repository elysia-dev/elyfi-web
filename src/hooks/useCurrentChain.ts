import { useWeb3React } from '@web3-react/core';
import { useContext, useMemo } from 'react';
import { IMainnet, mainnets } from 'src/core/data/mainnets';
import { Web3Context } from 'src/providers/Web3Provider';

const useCurrentChain = (): IMainnet | undefined => {
  const { chainId } = useContext(Web3Context);

  const currentChain = useMemo(() => {
    return mainnets.find((mainnet) => {
      return (
        mainnet.chainId === chainId ||
        (chainId.toString().includes('0x') &&
          parseInt(chainId.toString(), 16) === mainnet.chainId)
      );
    });
  }, [chainId]);

  return currentChain;
};

export default useCurrentChain;
