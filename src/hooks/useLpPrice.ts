import { utils } from 'ethers';
import { useEffect, useState } from 'react';
import { pricesFetcher } from 'src/clients/Coingecko';
import envs from 'src/core/envs';
import priceMiddleware from 'src/middleware/priceMiddleware';
import useSWR from 'swr';
import {
  v2LPPoolElfiFetcher,
  v2LPPoolTokensFetcher,
  v2PoolDataFetcher,
} from 'src/clients/BalancesFetcher';

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
  const { data: v2PoolData } = useSWR(['v2PoolData'], {
    fetcher: v2PoolDataFetcher(),
  });

  const { data: v2LPPoolElfi } = useSWR(
    {
      ethElfiV2PoolAddress: envs.lpStaking.ethElfiV2PoolAddress,
      daiElfiV2PoolAddress: envs.lpStaking.daiElfiV2PoolAddress,
    },
    {
      fetcher: v2LPPoolElfiFetcher(),
    },
  );

  const { data: v2LPPoolTokens } = useSWR(
    {
      ethElfiV2PoolAddress: envs.lpStaking.ethElfiV2PoolAddress,
      daiElfiV2PoolAddress: envs.lpStaking.daiElfiV2PoolAddress,
      v2LPPoolTokens: 'v2LPPoolTokens',
    },
    {
      fetcher: v2LPPoolTokensFetcher(),
    },
  );

  useEffect(() => {
    if (!priceData || !v2LPPoolElfi || !v2LPPoolTokens || !v2PoolData) return;

    const stakedTokenElfiEthPrice =
      parseFloat(utils.formatEther(v2LPPoolElfi.ethPoolElfiBalance)) *
        priceData.elfiPrice +
      parseFloat(utils.formatEther(v2LPPoolTokens.ethPoolBalance)) *
        priceData.ethPrice;

    const stakedTokenElfiDaiPrice =
      parseFloat(utils.formatEther(v2LPPoolElfi.daiPoolElfiBalance)) *
        priceData.elfiPrice +
      parseFloat(utils.formatEther(v2LPPoolTokens.daiPoolBalance)) *
        priceData.daiPrice;

    const ethPerTokenPrice =
      stakedTokenElfiEthPrice /
      parseFloat(utils.formatEther(v2PoolData.v2EthPoolTotalSupply));
    const daiPerTokenPrice =
      stakedTokenElfiDaiPrice /
      parseFloat(utils.formatEther(v2PoolData.v2DaiPoolTotalSupply));

    setLpPriceState({
      ethLpPrice: ethPerTokenPrice,
      daiLpPrice: daiPerTokenPrice,
      loading: false,
    });
  }, [priceData, v2LPPoolElfi, v2LPPoolTokens, v2PoolData]);

  return {
    lpPriceState,
  };
};

export default useLpPrice;
