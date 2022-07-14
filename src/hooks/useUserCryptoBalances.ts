import { useEffect, useState } from 'react';
import useSWR from 'swr';
import envs from 'src/core/envs';
import { useWeb3React } from '@web3-react/core';
import { walletCryptoFetcher } from 'src/clients/BalancesFetcher';
import { BigNumber, constants, utils } from 'ethers';

const useUserCryptoBalances = (): {
  balances: { usdc: number; eth: number };
} => {
  const [balances, setBalances] = useState({
    usdc: 0,
    eth: 0,
  });
  const { account } = useWeb3React();

  const { data } = useSWR(
    [
      {
        usdc: envs.token.usdcAddress,
        account: '0x3486831d16b8B084e87368E02D298f12d92E6891',
        // account,
      },
    ],
    {
      fetcher: walletCryptoFetcher(),
    },
  );

  useEffect(() => {
    if (!data) return;
    setBalances({
      usdc: parseFloat(utils.formatUnits(data.usdc, 6)),
      eth: parseFloat(utils.formatEther(data.eth)),
    });
  }, [data]);

  return { balances };
};

export default useUserCryptoBalances;
