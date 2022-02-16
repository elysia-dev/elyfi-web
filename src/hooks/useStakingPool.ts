import { useWeb3React } from '@web3-react/core';
import { useMemo } from 'react';
import {
  StakingPool,
  StakingPool__factory,
} from '@elysia-dev/contract-typechain';
import envs from 'src/core/envs';
import Token from 'src/enums/Token';

const useStakingPool = (
  staked: 'EL' | 'ELFI',
  v2?: boolean,
): {
  contract: StakingPool | undefined;
  rewardContractForV2: StakingPool | undefined;
} => {
  const { library } = useWeb3React();
  const contract = useMemo(() => {
    if (!library) return;
    return StakingPool__factory.connect(
      staked === 'EL'
        ? envs.staking.elStakingPoolAddress
        : v2
        ? envs.staking.elfyV2StakingPoolAddress
        : envs.staking.elfyStakingPoolAddress,
      library.getSigner(),
    );
  }, [library, staked, v2]);

  const rewardContractForV2 = useMemo(() => {
    if (!library) return;
    if (staked === Token.ELFI && v2) {
      return StakingPool__factory.connect(
        envs.staking.elfyV2StakingPoolRewardAddress,
        library.getSigner(),
      );
    }
  }, [library, staked, v2]);

  return { contract, rewardContractForV2 };
};

export default useStakingPool;
