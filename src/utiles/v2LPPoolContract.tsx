import { StakingPoolV2, StakingPoolV2factory } from '@elysia-dev/elyfi-v1-sdk';
import { providers } from 'ethers';
import envs from 'src/core/envs';

const provider = new providers.JsonRpcProvider(process.env.REACT_APP_JSON_RPC);

export const getV2LPPoolContract = (): {
  ethPoolContract: StakingPoolV2;
  daiPoolContract: StakingPoolV2;
} => {
  const ethPoolContract = StakingPoolV2factory.connect(
    envs.stakingV2MoneyPool.elfiEthLp,
    provider as any,
  );

  const daiPoolContract = StakingPoolV2factory.connect(
    envs.stakingV2MoneyPool.elfiDaiLp,
    provider as any,
  );
  return { ethPoolContract, daiPoolContract };
};
