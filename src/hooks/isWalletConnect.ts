import { useWeb3React } from '@web3-react/core';
import { useContext } from 'react';
import envs from 'src/core/envs';
import { Web3Context } from 'src/providers/Web3Provider';

const isWalletConnect = (): boolean => {
  const { active, chainId } = useContext(Web3Context);
  const isValidChain =
    envs.requiredNetwork === 'ganache' ||
    (!!chainId &&
      [envs.requiredChainId, envs.bscMainnetChainId].includes(
        chainId.toString().includes('0x')
          ? parseInt(chainId.toString(), 16)
          : chainId,
      ));

  return active && isValidChain;
};

export default isWalletConnect;
