import { ERC20__factory } from '@elysia-dev/contract-typechain';
import {
  DataPipelineFactory,
  StakingPoolV2factory,
} from '@elysia-dev/elyfi-v1-sdk';
import axios from 'axios';
import { JsonRpcProvider } from '@ethersproject/providers';
import envs from 'src/core/envs';
import { getV2LPPoolContract } from 'src/utiles/v2LPPoolContract';
import { BigNumber } from 'ethers';
import Token from 'src/enums/Token';

export const tvlFetcher = (
  url: string,
): Promise<{
  tvlExceptElTvl: number;
  elTvl: number;
}> => axios.get(url).then((res) => res.data);

const provider = new JsonRpcProvider(process.env.REACT_APP_JSON_RPC);
const bscProvider = new JsonRpcProvider(envs.jsonRpcUrl.bsc);
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

export const depositInfoFetcher =
  () =>
  async (
    ...args: [{ eth: string; bsc: string }] //  Promise< //   { //     averageRealAssetBorrowRate: BigNumber; //     borrowAPY: BigNumber; //     dTokenLastUpdateTimestamp: BigNumber; //     depositAPY: BigNumber;
  ): Promise<
    {
      depositAPY: BigNumber;
      borrowAPY: BigNumber;
      totalDTokenSupply: BigNumber;
      totalLTokenSupply: BigNumber;
      tokenName: Token;
    }[]
  > => {
    const bscDataprovider = new JsonRpcProvider(envs.dataPipeline.bscRPC);
    const ethData = DataPipelineFactory.connect(args[0].eth, provider);
    const bscData = DataPipelineFactory.connect(args[0].bsc, bscDataprovider);
    const daiInfo = await ethData.getReserveData(envs.token.daiAddress);
    const usdtInfo = await ethData.getReserveData(envs.token.usdtAddress);
    const usdcInfo = await ethData.getReserveData(envs.token.usdcAddress);
    const busdInfo = await bscData.getReserveData(
      envs.dataPipeline.busdAddress,
    );

    return [
      { ...daiInfo, tokenName: Token.DAI },
      { ...usdtInfo, tokenName: Token.USDT },
      { ...usdcInfo, tokenName: Token.USDC },
      { ...busdInfo, tokenName: Token.BUSD },
    ];
  };
