import { useEffect, useState } from 'react';
import { ethers, providers } from 'ethers';

type ReturnType = { ensName: string | null };

export const useENS = (address: string | null | undefined): ReturnType => {
  const [ensName, setENSName] = useState<string | null>(null);
  const provider = new providers.JsonRpcProvider(
    process.env.REACT_APP_JSON_RPC,
  );

  useEffect(() => {
    async function resolveENS() {
      if (address && ethers.utils.isAddress(address)) {
        const ensName = await provider.lookupAddress(address);
        if (ensName) setENSName(ensName);
      }
    }
    resolveENS();
  }, [address]);

  return { ensName };
};