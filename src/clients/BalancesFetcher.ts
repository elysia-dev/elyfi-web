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
const { daiPoolContract, ethPoolContract } = getV2LPPoolContract();

const erc20Contract = (address: string, provider: any) => {
  return ERC20__factory.connect(address, provider);
};

export const v2LPPoolElfiFetcher =
  (): any =>
  async (...args: [string, string]) => {
    const [...params] = args;
    const contract: any = erc20Contract(
      envs.token.governanceAddress,
      provider as any,
    );

    return {
      ethPoolElfiBalance: await contract.balanceOf(params[0]),
      daiPoolElfiBalance: await contract.balanceOf(params[1]),
    };
  };

export const v2LPPoolTokensFetcher =
  (): any =>
  async (...args: [string, string]) => {
    const [...params] = args;

    const daiContract: any = erc20Contract(
      envs.token.daiAddress,
      provider as any,
    );
    const wEthContract: any = erc20Contract(
      envs.token.wEthAddress,
      provider as any,
    );

    return {
      ethPoolBalance: await wEthContract.balanceOf(params[0]),
      daiPoolBalance: await daiContract.balanceOf(params[1]),
    };
  };

export const v2PoolDataFetcher =
  (): any =>
  async (...args: [string]) => {
    return {
      v2EthPoolData: await ethPoolContract.getPoolData(),
      v2DaiPoolData: await daiPoolContract.getPoolData(),
      v2EthPoolTotalSupply: await ethPoolContract.totalSupply(),
      v2DaiPoolTotalSupply: await daiPoolContract.totalSupply(),
    };
  };
