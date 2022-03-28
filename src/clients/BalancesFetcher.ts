import { ERC20__factory } from '@elysia-dev/contract-typechain';
import { providers } from 'ethers';
import envs from 'src/core/envs';

const provider = new providers.JsonRpcProvider(process.env.REACT_APP_JSON_RPC);
const bscProvider = new providers.JsonRpcProvider(envs.jsonRpcUrl.bsc);

export const elStakingFetcher =
  (): any =>
  (...args: any) => {
    const [...params] = args;
    const contract: any = ERC20__factory.connect(
      envs.token.elAddress,
      provider as any,
    );

    return contract.balanceOf(params[0]);
  };
export const elfiStakingFetcher =
  (): any =>
  (...args: any) => {
    const [...params] = args;
    const contract: any = ERC20__factory.connect(
      envs.token.governanceAddress,
      provider as any,
    );

    return contract.balanceOf(params[0]);
  };

export const bscStakingFetcher =
  (): any =>
  (...args: any) => {
    const [...params] = args;
    const contract: any = ERC20__factory.connect(
      envs.token.bscElfiAddress,
      bscProvider as any,
    );

    return contract.balanceOf(params[0]);
  };
