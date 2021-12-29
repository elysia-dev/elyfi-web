import { useContext, useMemo } from 'react';
import {
  StakingPool,
  StakingPool__factory,
} from '@elysia-dev/contract-typechain';
import envs from 'src/core/envs';
import { Web3Context } from 'src/providers/Web3Provider';

const useStakingPool = (
  staked: 'EL' | 'ELFI',
  v2?: boolean,
): StakingPool | undefined => {
  const { provider } = useContext(Web3Context);
  const contract = useMemo(() => {
    if (!provider) return;
    return StakingPool__factory.connect(
      staked === 'EL'
        ? envs.elStakingPoolAddress
        : v2
        ? envs.elfyV2StakingPoolAddress
        : envs.elfyStakingPoolAddress,
      provider.getSigner(),
    );
  }, [provider, staked, v2]);

  return contract;
};

export default useStakingPool;
