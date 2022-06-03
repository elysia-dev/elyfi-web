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
const { daiPoolContract, ethPoolContract, elPoolContract } =
  getV2LPPoolContract();

const erc20Contract = (address: string, provider: any) => {
  return ERC20__factory.connect(address, provider);
};
const stakingPoolV2Contract = (address: string, provider: any) => {
  return StakingPoolV2factory.connect(address, provider);
};

export const elfiBalanceOfFetcher =
  (): any =>
  async (
    ...args: [
      {
        elfiV1PoolAddress: string;
        elfiV2PoolAddress: string;
        bscPoolAddress: string;
      },
    ]
  ) => {
    const ethContract: any = erc20Contract(
      envs.token.governanceAddress,
      provider as any,
    );
    const bscContract: any = erc20Contract(
      envs.token.bscElfiAddress,
      bscProvider as any,
    );

    return {
      elfiV1Balance: await ethContract.balanceOf(args[0].elfiV1PoolAddress),
      elfiV2Balance: await ethContract.balanceOf(args[0].elfiV2PoolAddress),
      bscBalance: await bscContract.balanceOf(args[0].bscPoolAddress),
    };
  };

export const v2LPPoolElfiFetcher =
  (): any =>
  async (
    ...args: [
      {
        ethElfiAddress: string;
        daiElfiAddress: string;
        elElfiAddress: string;
      },
    ]
  ) => {
    const contract: any = erc20Contract(
      envs.token.governanceAddress,
      provider as any,
    );

    return {
      ethElfiBalance: await contract.balanceOf(args[0].ethElfiAddress),
      daiElfiBalance: await contract.balanceOf(args[0].daiElfiAddress),
      elElfiBalance: await contract.balanceOf(args[0].elElfiAddress),
    };
  };

export const v2LPPoolTokensFetcher =
  (): any =>
  async (
    ...args: [
      {
        ethElfiAddress: string;
        daiElfiAddress: string;
        elElfiAddress: string;
      },
      string,
    ]
  ) => {
    const daiContract: any = erc20Contract(
      envs.token.daiAddress,
      provider as any,
    );
    const wEthContract: any = erc20Contract(
      envs.token.wEthAddress,
      provider as any,
    );
    const elContract: any = erc20Contract(
      envs.token.elAddress,
      provider as any,
    );

    return {
      ethTokenBalance: await wEthContract.balanceOf(args[0].ethElfiAddress),
      daiTokenBalance: await daiContract.balanceOf(args[0].daiElfiAddress),
      elTokenBalance: await elContract.balanceOf(args[0].elElfiAddress),
    };
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
  async (...args: [string]) => {
    return {
      ethPoolData: await ethPoolContract.getPoolData(),
      daiPoolData: await daiPoolContract.getPoolData(),
      elPoolData: await elPoolContract.getPoolData(),
      ethTotalSupply: await ethPoolContract.totalSupply(),
      daiTotalSupply: await daiPoolContract.totalSupply(),
      elTotalSupply: await elPoolContract.totalSupply(),
    };
  };
