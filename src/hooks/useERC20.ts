import { useWeb3React } from '@web3-react/core';
import { useContext, useMemo } from 'react';
import { ERC20__factory } from '@elysia-dev/contract-typechain';
import { providers } from 'ethers';
import { Web3Context } from 'src/providers/Web3Provider';

const useERC20 = (address: string) => {
  const { provider } = useContext(Web3Context);
  const contract = useMemo(() => {
    if (!provider) {
      return ERC20__factory.connect(
        address,
        new providers.JsonRpcProvider(process.env.REACT_APP_JSON_RPC),
      );
    }
    return ERC20__factory.connect(address, provider.getSigner());
  }, [provider, address]);

  return contract;
};

export default useERC20;
