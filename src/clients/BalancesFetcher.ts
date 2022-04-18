import { ERC20__factory } from '@elysia-dev/contract-typechain';
import { providers } from 'ethers';
import envs from 'src/core/envs';

const provider = new providers.JsonRpcProvider(process.env.REACT_APP_JSON_RPC);
const bscProvider = new providers.JsonRpcProvider(envs.jsonRpcUrl.bsc);

export const elBalanceOfFetcher =
  (): any =>
  (...args: [string]) => {
    const [...params] = args;
    const contract: any = ERC20__factory.connect(
      envs.token.elAddress,
      provider as any,
    );

    return contract.balanceOf(params[0]);
  };
export const elfiBalanceOfFetcher =
  (): any =>
  (...args: [string]) => {
    const [...params] = args;
    const contract: any = ERC20__factory.connect(
      envs.token.governanceAddress,
      provider as any,
    );

    return contract.balanceOf(params[0]);
  };

export const bscBalanceOfFetcher =
  (): any =>
  (...args: [string]) => {
    const [...params] = args;
    const contract: any = ERC20__factory.connect(
      envs.token.bscElfiAddress,
      bscProvider as any,
    );

    return contract.balanceOf(params[0]);
  };
export const v2EthLPPoolElfiFetcher =
  (): any =>
  (...args: [string]) => {
    const [...params] = args;
    const contract: any = ERC20__factory.connect(
      envs.token.governanceAddress,
      provider as any,
    );

    return contract.balanceOf(params[0]);
  };
export const v2LDaiLPPoolElfiFetcher =
  (): any =>
  (...args: [string]) => {
    const [...params] = args;
    const contract: any = ERC20__factory.connect(
      envs.token.governanceAddress,
      provider as any,
    );

    return contract.balanceOf(params[0]);
  };
export const v2LPPoolDaiFetcher =
  (): any =>
  (...args: [string]) => {
    const [...params] = args;
    const contract: any = ERC20__factory.connect(
      envs.token.wEthAddress,
      provider as any,
    );

    return contract.balanceOf(params[0]);
  };
export const v2LPPoolEthFetcher =
  (): any =>
  (...args: [string]) => {
    const [...params] = args;
    const contract: any = ERC20__factory.connect(
      envs.token.daiAddress,
      provider as any,
    );

    return contract.balanceOf(params[0]);
  };
