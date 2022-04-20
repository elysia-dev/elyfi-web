import { ERC20__factory } from '@elysia-dev/contract-typechain';
import { StakingPoolV2factory } from '@elysia-dev/elyfi-v1-sdk';
import { providers } from 'ethers';
import envs from 'src/core/envs';
import { getV2LPPoolContract } from 'src/utiles/v2LPPoolContract';

const provider = new providers.JsonRpcProvider(process.env.REACT_APP_JSON_RPC);
const bscProvider = new providers.JsonRpcProvider(envs.jsonRpcUrl.bsc);
const { daiPoolContract, ethPoolContract } = getV2LPPoolContract();

const erc20Contract = (address: string, provider: any) => {
  return ERC20__factory.connect(address, provider);
};
const stakingPoolV2Contract = (address: string, provider: any) => {
  return StakingPoolV2factory.connect(address, provider);
};

export const elBalanceOfFetcher =
  (): any =>
  (...args: [string]) => {
    const [...params] = args;
    const contract: any = erc20Contract(envs.token.elAddress, provider as any);

    return contract.balanceOf(params[0]);
  };
export const elfiBalanceOfFetcher =
  (): any =>
  (...args: [string]) => {
    const [...params] = args;
    const contract: any = erc20Contract(
      envs.token.governanceAddress,
      provider as any,
    );

    return contract.balanceOf(params[0]);
  };

export const bscBalanceOfFetcher =
  (): any =>
  (...args: [string]) => {
    const [...params] = args;
    const contract: any = erc20Contract(
      envs.token.bscElfiAddress,
      bscProvider as any,
    );

    return contract.balanceOf(params[0]);
  };
export const v2EthLPPoolElfiFetcher =
  (): any =>
  (...args: [string]) => {
    const [...params] = args;
    const contract: any = erc20Contract(
      envs.token.governanceAddress,
      provider as any,
    );

    return contract.balanceOf(params[0]);
  };
export const v2LDaiLPPoolElfiFetcher =
  (): any =>
  (...args: [string]) => {
    const [...params] = args;
    const contract: any = erc20Contract(
      envs.token.governanceAddress,
      provider as any,
    );

    return contract.balanceOf(params[0]);
  };
export const v2LPPoolDaiFetcher =
  (): any =>
  (...args: [string]) => {
    const [...params] = args;

    const contract: any = erc20Contract(envs.token.daiAddress, provider as any);

    return contract.balanceOf(params[0]);
  };
export const v2LPPoolEthFetcher =
  (): any =>
  (...args: [string]) => {
    const [...params] = args;
    const contract: any = erc20Contract(
      envs.token.wEthAddress,
      provider as any,
    );

    return contract.balanceOf(params[0]);
  };
export const elfiV2BalanceFetcher =
  (): any =>
  (...args: [string]) => {
    const [...params] = args;
    const contract: any = stakingPoolV2Contract(
      envs.stakingV2MoneyPool.elfiStaking,
      provider as any,
    );

    return contract.getPoolData();
  };
export const elfiBscV2BalanceFetcher =
  (): any =>
  (...args: [string]) => {
    const [...params] = args;
    const contract: any = stakingPoolV2Contract(
      envs.stakingV2MoneyPool.elfiBscStaking,
      bscProvider as any,
    );

    return contract.getPoolData();
  };
export const ethPoolDataFetcher =
  (): any =>
  (...args: [string]) => {
    return ethPoolContract.getPoolData();
  };
export const daiPoolDataFetcher =
  (): any =>
  (...args: [string]) => {
    return daiPoolContract.getPoolData();
  };
export const ethTotalSupplyFetcher =
  (): any =>
  (...args: [string]) => {
    return ethPoolContract.totalSupply();
  };
export const daiTotalSupplyFetcher =
  (): any =>
  (...args: [string]) => {
    return daiPoolContract.totalSupply();
  };
