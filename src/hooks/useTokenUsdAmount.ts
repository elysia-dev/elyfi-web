import { utils } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import { pricesFetcher } from 'src/clients/Coingecko';
import envs from 'src/core/envs';
import priceMiddleware from 'src/middleware/priceMiddleware';
import useSWR from 'swr';
import useTvlBalances from 'src/hooks/useTvlBalances';
import { v2LPPoolElfiFetcher } from 'src/clients/BalancesFetcher';

const useTokenUsdAmount = () => {
  const [tokenUsdAmount, setTokenUsdAmount] = useState({
    elfiPrice: 0,
    ethLpPrice: 0,
    daiLpPrice: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const { data: priceData } = useSWR(
    envs.externalApiEndpoint.coingackoURL,
    pricesFetcher,
    {
      use: [priceMiddleware],
    },
  );
  const balances = useTvlBalances();
  const { data: v2LPPoolElfi } = useSWR(
    [envs.lpStaking.ethElfiV2PoolAddress, envs.lpStaking.daiElfiV2PoolAddress],
    {
      fetcher: v2LPPoolElfiFetcher(),
    },
  );

  const loadAmountData = useCallback(() => {
    try {
      if (!priceData) return;

      const stakedTokenElfiEthPrice =
        parseFloat(utils.formatEther(v2LPPoolElfi[0])) * priceData.elfiPrice +
        parseFloat(utils.formatEther(balances.v2LPPoolEth)) *
          priceData.ethPrice;

      const stakedTokenElfiDaiPrice =
        parseFloat(utils.formatEther(v2LPPoolElfi[1])) * priceData.elfiPrice +
        parseFloat(utils.formatEther(balances.v2LPPoolDai)) *
          priceData.daiPrice;

      setTokenUsdAmount({
        elfiPrice: priceData.elfiPrice,
        ethLpPrice: stakedTokenElfiEthPrice,
        daiLpPrice: stakedTokenElfiDaiPrice,
      });
      setLoading(false);
      setError(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
      setError(true);
    }
  }, [priceData, balances, v2LPPoolElfi]);

  useEffect(() => {
    loadAmountData();
  }, [priceData, balances, v2LPPoolElfi]);

  return {
    tokenUsdAmount,
    loading,
    error,
  };
};

export default useTokenUsdAmount;
