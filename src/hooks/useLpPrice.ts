import { utils } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import { pricesFetcher } from 'src/clients/Coingecko';
import envs from 'src/core/envs';
import priceMiddleware from 'src/middleware/priceMiddleware';
import useSWR from 'swr';
import useTvlBalances from 'src/hooks/useTvlBalances';
import { v2LPPoolElfiFetcher } from 'src/clients/BalancesFetcher';

const useLpPrice = (): {
  lpPriceState: {
    ethLpPrice: number;
    daiLpPrice: number;
    loading: boolean;
  };
} => {
  const [lpPriceState, setLpPriceState] = useState({
    ethLpPrice: 0,
    daiLpPrice: 0,
    loading: true,
  });

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
    if (!priceData) return;
    if (!v2LPPoolElfi) return;

    const stakedTokenElfiEthPrice =
      parseFloat(utils.formatEther(v2LPPoolElfi[0])) * priceData.elfiPrice +
      parseFloat(utils.formatEther(balances.v2LPPoolEth)) * priceData.ethPrice;

    const stakedTokenElfiDaiPrice =
      parseFloat(utils.formatEther(v2LPPoolElfi[1])) * priceData.elfiPrice +
      parseFloat(utils.formatEther(balances.v2LPPoolDai)) * priceData.daiPrice;

    setLpPriceState({
      ethLpPrice: stakedTokenElfiEthPrice,
      daiLpPrice: stakedTokenElfiDaiPrice,
      loading: false,
    });
  }, [priceData, balances, v2LPPoolElfi]);

  useEffect(() => {
    loadAmountData();
  }, [priceData, balances, v2LPPoolElfi]);

  return {
    lpPriceState,
  };
};

export default useLpPrice;
