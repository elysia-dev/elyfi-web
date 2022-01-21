import { useWeb3React } from '@web3-react/core';
import envs from 'src/core/envs';

const isWalletConnect = (): boolean => {
  const { active, chainId } = useWeb3React();
  const isValidChain =
    envs.network.requiredNetwork === 'ganache' ||
    (!!chainId &&
      [envs.network.requiredChainId, envs.network.bscMainnetChainId].includes(
        chainId,
      ));

  return active && isValidChain;
};

export default isWalletConnect;
