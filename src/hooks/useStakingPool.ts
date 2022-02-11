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
        ? envs.elStakingPoolAddress
        : v2
        ? envs.elfyV2StakingPoolAddress
        : envs.elfyStakingPoolAddress,
      library.getSigner(),
    );
  }, [library, staked, v2]);

  const rewardContractForV2 = useMemo(() => {
    if (!library) return;
    if (staked === Token.ELFI && v2) {
      return StakingPool__factory.connect(
        envs.elfyV2StakingPoolRewardAddress,
        library.getSigner(),
      );
    }
  }, [library, staked, v2]);

  return { contract, rewardContractForV2 };
};

export default useStakingPool;
