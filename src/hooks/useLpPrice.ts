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
    elLpPrice: number;
    loading: boolean;
  };
} => {
  const [lpPriceState, setLpPriceState] = useState({
    ethLpPrice: 0,
    daiLpPrice: 0,
    elLpPrice: 0,
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
    [
      {
        ethElfiAddress: envs.lpStaking.ethElfiV2PoolAddress,
        daiElfiAddress: envs.lpStaking.daiElfiV2PoolAddress,
        elElfiAddress: envs.lpStaking.elElfiV2PoolAddress,
      },
    ],
    {
      fetcher: v2LPPoolElfiFetcher(),
    },
  );

  useEffect(() => {
    if (!priceData || !v2LPPoolElfi) return;

    const stakedTokenElfiEthPrice =
      parseFloat(utils.formatEther(v2LPPoolElfi.ethElfiBalance)) *
        priceData.elfiPrice +
      parseFloat(utils.formatEther(balances.v2LPPoolEth)) * priceData.ethPrice;

    const stakedTokenElfiDaiPrice =
      parseFloat(utils.formatEther(v2LPPoolElfi.daiElfiBalance)) *
        priceData.elfiPrice +
      parseFloat(utils.formatEther(balances.v2LPPoolDai)) * priceData.daiPrice;

    const stakedTokenElfiElPrice =
      parseFloat(utils.formatEther(v2LPPoolElfi.elElfiBalance)) *
        priceData.elfiPrice +
      parseFloat(utils.formatEther(balances.v2LPPoolDai)) * priceData.daiPrice;

    const ethPerTokenPrice =
      stakedTokenElfiEthPrice /
      parseFloat(utils.formatEther(balances.ethTotalSupply));
    const daiPerTokenPrice =
      stakedTokenElfiDaiPrice /
      parseFloat(utils.formatEther(balances.daiTotalSupply));

    const elPerTokenPrice =
      stakedTokenElfiElPrice /
      parseFloat(utils.formatEther(balances.daiTotalSupply));

    setLpPriceState({
      ethLpPrice: ethPerTokenPrice,
      daiLpPrice: daiPerTokenPrice,
      elLpPrice: elPerTokenPrice,
      loading: false,
    });
  }, [priceData, balances, v2LPPoolElfi]);

  return {
    lpPriceState,
  };
};

export default useLpPrice;
