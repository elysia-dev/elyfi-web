import { useWeb3React } from '@web3-react/core';
import { useMemo } from 'react';
import envs from 'src/core/envs';
import { ERC20, ERC20__factory } from '@elysia-dev/contract-typechain';
import { providers } from 'ethers';
import MainnetType from 'src/enums/MainnetType';
import useCurrentChain from './useCurrentChain';

const useERC20 = (address: string): ERC20 => {
  const { library } = useWeb3React();
  const currentChain = useCurrentChain();

  const contract = useMemo(() => {
    if (!library) {
      return ERC20__factory.connect(
        address,
        new providers.JsonRpcProvider(
          currentChain?.name === MainnetType.BSCTest
            ? address === envs.token.testBscElfiAddress
              ? envs.jsonRpcUrl.bsc
              : process.env.REACT_APP_JSON_RPC
            : address === envs.token.bscElfiAddress
            ? envs.jsonRpcUrl.bsc
            : process.env.REACT_APP_JSON_RPC,
        ) as any,
      );
    }
    return ERC20__factory.connect(address, library.getSigner());
  }, [library, address]);

  return contract;
};

export default useERC20;
