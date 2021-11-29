import { useWeb3React } from '@web3-react/core';
import { useMemo } from 'react';
import { ERC20__factory } from '@elysia-dev/contract-typechain';
import { providers } from 'ethers';

const useERC20 = (address: string) => {
  const { library } = useWeb3React();
  const contract = useMemo(() => {
    if (!library) {
      return ERC20__factory.connect(
        address,
        new providers.InfuraProvider(
          'mainnet',
          process.env.REACT_APP_INFURA_PROJECT_ID,
        ),
      );
    }
    return ERC20__factory.connect(address, library.getSigner());
  }, [library, address]);

  return contract;
};

export default useERC20;
