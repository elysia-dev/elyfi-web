import { JsonRpcProvider, Provider } from '@ethersproject/providers';
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ERC20__factory } from '@elysia-dev/contract-typechain';
import {
  DataPipelineFactory,
  StakingPoolV2factory,
} from '@elysia-dev/elyfi-v1-sdk';
import axios from 'axios';
import { BigNumber, constants, Contract, ethers, utils } from 'ethers';
import controllerAbi from 'src/abis/Controller.json';
import nftAbi from 'src/abis/NftBond.json';
import envs from 'src/core/envs';
import Token from 'src/enums/Token';
import { getV2LPPoolContract } from 'src/utiles/v2LPPoolContract';

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

export const getControllerContract = (provider: any): Contract => {
  return new ethers.Contract(
    controllerAbi.address,
    controllerAbi.abi,
    provider,
  );
};

export const getNFTContract = (provider: Provider) => {
  return new ethers.Contract(nftAbi.address, nftAbi.abi, provider);
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
    const bscDataprovider = new JsonRpcProvider(envs.jsonRpcUrl.bsc);
    const bscData = DataPipelineFactory.connect(args[0].bsc, bscDataprovider);
    let busdInfo;
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.REACT_APP_TEST_MODE
    ) {
      busdInfo = {
        depositAPY: constants.Zero,
        borrowAPY: constants.Zero,
        totalDTokenSupply: constants.Zero,
        totalLTokenSupply: constants.Zero,
      };
    } else {
      busdInfo = await bscData.getReserveData(envs.token.busdAddress);
    }
    const ethData = DataPipelineFactory.connect(args[0].eth, provider);
    const daiInfo = await ethData.getReserveData(envs.token.daiAddress);
    const usdtInfo = await ethData.getReserveData(envs.token.usdtAddress);
    const usdcInfo = await ethData.getReserveData(envs.token.usdcAddress);

    return [
      { ...daiInfo, tokenName: Token.DAI },
      { ...usdtInfo, tokenName: Token.USDT },
      { ...usdcInfo, tokenName: Token.USDC },
      { ...busdInfo, tokenName: Token.BUSD },
    ];
  };

export const walletCryptoFetcher =
  () =>
  async (
    ...args: [{ usdc: string; account: string }]
  ): Promise<{ eth: BigNumber; usdc: BigNumber }> => {
    if (!args[0].account) {
      return { eth: constants.Zero, usdc: constants.Zero };
    }
    const contract = erc20Contract(args[0].usdc, provider);

    const eth = await provider.getBalance(args[0].account);
    const usdc = await contract.balanceOf(args[0].account);

    return {
      eth,
      usdc,
    };
  };

export const gasPriceFetcher =
  () =>
  async (...args: [{ account: string }]): Promise<number> => {
    try {
      const controllerContract = getControllerContract(provider);
      const estimatedGas = await controllerContract.estimateGas.deposit(
        1,
        utils.parseUnits('10', 6),
        {
          from: args[0].account,
        },
      );

      const gasFee =
        parseFloat(utils.formatEther(await provider.getGasPrice())) *
        parseFloat(utils.formatUnits(estimatedGas, 0));

      return gasFee;
    } catch (error) {
      console.log(error);
      return 0;
    }
  };

export const nftTotalSupplyFetcher = () => async (): Promise<number> => {
  try {
    const nftContract = getNFTContract(provider);
    return parseInt(utils.formatUnits(await nftContract.totalSupply(1), 0), 10);
  } catch (error) {
    console.log(error);
    return 0;
  }
};
