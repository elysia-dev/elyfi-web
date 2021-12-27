import { useEffect, useState } from 'react';
import { ethers, providers } from 'ethers';

type ReturnType = { ensName: string | null };

export const useENS = (address: string | null | undefined): ReturnType => {
  const [ensName, setENSName] = useState<string | null>(null);

  useEffect(() => {
    async function resolveENS() {
      if (address && ethers.utils.isAddress(address)) {
        const provider = providers.JsonRpcProvider(process.env.REACT_APP_JSON_RPC)
        const ensName = await provider.lookupAddress(address);
        if (ensName) setENSName(ensName);
      }
    }
    resolveENS();
  }, [address]);

  return { ensName };
};
