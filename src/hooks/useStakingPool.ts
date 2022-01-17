import { useWeb3React } from '@web3-react/core';
import { useMemo } from 'react';
import {
  StakingPool,
  StakingPool__factory,
} from '@elysia-dev/contract-typechain';
import envs from 'src/core/envs';

const useStakingPool = (
  staked: 'EL' | 'ELFI',
  v2?: boolean,
): StakingPool | undefined => {
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

  return contract;
};

export default useStakingPool;
