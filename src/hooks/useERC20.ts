import { useWeb3React } from '@web3-react/core';
import { useContext, useMemo } from 'react';
import { ERC20__factory } from '@elysia-dev/contract-typechain';
import { providers } from 'ethers';
import { Web3Context } from 'src/providers/Web3Provider';

const useERC20 = (address: string) => {
  const { library } = useWeb3React();
  const contract = useMemo(() => {
    if (!library) {
      return ERC20__factory.connect(
        address,
        new providers.JsonRpcProvider(process.env.REACT_APP_JSON_RPC),
      );
    }
    return ERC20__factory.connect(address, library.getSigner());
  }, [library, address]);

  return contract;
};

export default useERC20;
