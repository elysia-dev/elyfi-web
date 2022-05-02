import { ERC20__factory } from '@elysia-dev/contract-typechain';
import { StakingPoolV2factory } from '@elysia-dev/elyfi-v1-sdk';
import axios from 'axios';
import { providers } from 'ethers';
import envs from 'src/core/envs';
import { getV2LPPoolContract } from 'src/utiles/v2LPPoolContract';

export const tvlFetcher = (
  url: string,
): Promise<{
  tvlExceptElTvl: number;
  elTvl: number;
}> => axios.get(url).then((res) => res.data);

const provider = new providers.JsonRpcProvider(process.env.REACT_APP_JSON_RPC);
const bscProvider = new providers.JsonRpcProvider(envs.jsonRpcUrl.bsc);
const { daiPoolContract, ethPoolContract } = getV2LPPoolContract();

const erc20Contract = (address: string, provider: any) => {
  return ERC20__factory.connect(address, provider);
};
const stakingPoolV2Contract = (address: string, provider: any) => {
  return StakingPoolV2factory.connect(address, provider);
};

export const elfiBalanceOfFetcher =
  (): any =>
  (...args: [string, string, string]) => {
    const [...params] = args;
    const ethContract: any = erc20Contract(
      envs.token.governanceAddress,
      provider as any,
    );
    const bscContract: any = erc20Contract(
      envs.token.bscElfiAddress,
      bscProvider as any,
    );

    return Promise.all([
      ethContract.balanceOf(params[0]),
      ethContract.balanceOf(params[1]),
      bscContract.balanceOf(params[2]),
    ]);
  };

export const v2LPPoolElfiFetcher =
  (): any =>
  (...args: [string, string]) => {
    const [...params] = args;
    const contract: any = erc20Contract(
      envs.token.governanceAddress,
      provider as any,
    );

    return Promise.all([
      contract.balanceOf(params[0]),
      contract.balanceOf(params[1]),
    ]);
  };

export const v2LPPoolTokensFetcher =
  (): any =>
  (...args: [string, string]) => {
    const [...params] = args;

    const daiContract: any = erc20Contract(
      envs.token.daiAddress,
      provider as any,
    );
    const wEthContract: any = erc20Contract(
      envs.token.wEthAddress,
      provider as any,
    );
    return Promise.all([
      daiContract.balanceOf(params[0]),
      wEthContract.balanceOf(params[1]),
    ]);
  };

export const elfiV2BalanceFetcher =
  (): any =>
  (...args: [string]) => {
    const [...params] = args;
    const ethContract: any = stakingPoolV2Contract(
      envs.stakingV2MoneyPool.elfiStaking,
      provider as any,
    );
    const bscContract: any = stakingPoolV2Contract(
      envs.stakingV2MoneyPool.elfiBscStaking,
      bscProvider as any,
    );

    return Promise.allSettled([
      ethContract.getPoolData(),
      bscContract.getPoolData(),
    ]);
  };

export const v2PoolDataFetcher =
  (): any =>
  (...args: [string]) => {
    return Promise.all([
      ethPoolContract.getPoolData(),
      daiPoolContract.getPoolData(),
      ethPoolContract.totalSupply(),
      daiPoolContract.totalSupply(),
    ]);
  };
