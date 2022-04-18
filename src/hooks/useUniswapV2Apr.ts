import { StakingPoolV2factory } from '@elysia-dev/elyfi-v1-sdk';
import envs from 'src/core/envs';
import { constants, providers, utils } from 'ethers';
import { useEffect, useState } from 'react';
import { pricesFetcher } from 'src/clients/Coingecko';
import priceMiddleware from 'src/middleware/priceMiddleware';
import useSWR from 'swr';
import {
  v2EthLPPoolElfiFetcher,
  v2LDaiLPPoolElfiFetcher,
} from 'src/clients/BalancesFetcher';
import { ERC20__factory } from '@elysia-dev/contract-typechain';

const provider = new providers.JsonRpcBatchProvider(
  process.env.REACT_APP_JSON_RPC,
);

const useUniswapV2Apr = () => {
  const [uniswapV2Apr, setUniswapV2Apr] = useState({
    elfiEthPool: constants.Zero,
    elfiDaiPool: constants.Zero,
  });
  const { data: priceData, isValidating: loading } = useSWR(
    envs.externalApiEndpoint.coingackoURL,
    pricesFetcher,
    {
      use: [priceMiddleware],
    },
  );
  const { data: v2EthLPPoolElfi } = useSWR(
    [envs.lpStaking.ethElfiV2PoolAddress],
    {
      fetcher: v2EthLPPoolElfiFetcher(),
    },
  );
  const { data: v2DaiLPPoolElfi } = useSWR(
    [envs.lpStaking.daiElfiV2PoolAddress],
    {
      fetcher: v2LDaiLPPoolElfiFetcher(),
    },
  );

  const test = async () => {
    if (!priceData || !v2EthLPPoolElfi || !v2DaiLPPoolElfi) return;

    const daiBalance = await ERC20__factory.connect(
      envs.token.daiAddress,
      provider as any,
    ).balanceOf(envs.lpStaking.daiElfiV2PoolAddress);
    const wEthBalance = await ERC20__factory.connect(
      envs.token.wEthAddress,
      provider as any,
    ).balanceOf(envs.lpStaking.ethElfiV2PoolAddress);

    const ethPoolContract = StakingPoolV2factory.connect(
      envs.stakingV2MoneyPool.elfiEthLp,
      provider as any,
    );

    const daiPoolContract = StakingPoolV2factory.connect(
      envs.stakingV2MoneyPool.elfiDaiLp,
      provider as any,
    );
    const ethPoolData = await ethPoolContract.getPoolData();
    const daiPoolData = await daiPoolContract.getPoolData();

    const ethTotalSupply = await ethPoolContract.totalSupply();
    const daiTotalSupply = await daiPoolContract.totalSupply();

    const ethUsdPerSecond =
      priceData.elfiPrice *
      parseFloat(utils.formatEther(ethPoolData.rewardPerSecond));
    const daiUsdPerSecond =
      priceData.elfiPrice *
      parseFloat(utils.formatEther(daiPoolData.rewardPerSecond));

    const stakedTokenElfiEthPrice =
      parseFloat(utils.formatEther(v2EthLPPoolElfi)) * priceData.elfiPrice +
      parseFloat(utils.formatEther(wEthBalance)) * priceData.ethPrice;
    const stakedTokenElfiDaiPrice =
      parseFloat(utils.formatEther(v2DaiLPPoolElfi)) * priceData.elfiPrice +
      parseFloat(utils.formatEther(daiBalance)) * priceData.daiPrice;

    const ethPoolPerToken =
      stakedTokenElfiEthPrice * parseFloat(utils.formatEther(ethTotalSupply));
    const daiPoolPerToken =
      stakedTokenElfiDaiPrice * parseFloat(utils.formatEther(daiTotalSupply));

    const ethTotalUSD =
      ethPoolPerToken *
      parseFloat(utils.formatEther(ethPoolData.totalPrincipal));
    const daiTotalUSD =
      daiPoolPerToken *
      parseFloat(utils.formatEther(daiPoolData.totalPrincipal));

    const elfiEthAPR =
      (ethUsdPerSecond / ethTotalUSD) * (3600 * 24 * 365 * 100);
    const elfiDaiAPR =
      (daiUsdPerSecond / daiTotalUSD) * (3600 * 24 * 365 * 100);

    setUniswapV2Apr({
      elfiDaiPool:
        elfiEthAPR === Infinity
          ? constants.MaxUint256
          : utils.parseEther(String(elfiDaiAPR)),
      elfiEthPool:
        elfiDaiAPR === Infinity
          ? constants.MaxUint256
          : utils.parseEther(String(elfiEthAPR)),
    });
  };

  useEffect(() => {
    test();
  }, [priceData, v2EthLPPoolElfi, v2DaiLPPoolElfi]);

  return { uniswapV2Apr };
};

export default useUniswapV2Apr;
