import { useWeb3React } from '@web3-react/core';
import { useContext, useMemo } from 'react';
import { StakingPool, StakingPoolFactory } from '@elysia-dev/elyfi-v1-sdk';
import envs from 'src/core/envs';
import Token from 'src/enums/Token';
import { poolAddress } from 'src/utiles/stakingPoolAddress';
import MainnetContext from 'src/contexts/MainnetContext';

const useStakingPool = (
  staked: Token.EL | Token.ELFI,
  v2: boolean,
): {
  contract: StakingPool | undefined;
  rewardContractForV2: StakingPool | undefined;
  elfiV2StakingContract: StakingPool | undefined;
} => {
  const { library } = useWeb3React();
  const { type: getMainnetType } = useContext(MainnetContext);
  const contract = useMemo(() => {
    if (!library) return;
    return StakingPoolFactory.connect(
      poolAddress(getMainnetType, staked),
      library.getSigner(),
    );
  }, [library, staked, v2, getMainnetType]);

  const rewardContractForV2 = useMemo(() => {
    if (!library) return;
    if (staked === Token.ELFI && v2 && getMainnetType === 'Ethereum') {
      return StakingPoolFactory.connect(
        envs.staking.elfyV2StakingPoolRewardAddress,
        library.getSigner(),
      );
    }
  }, [library, staked, v2, getMainnetType]);

  const elfiV2StakingContract = useMemo(() => {
    if (!library) return;
    if (staked === Token.ELFI && v2 && getMainnetType === 'Ethereum') {
      return StakingPoolFactory.connect(
        envs.staking.elfyV2StakingPoolAddress,
        library.getSigner(),
      );
    }
  }, [library, staked, v2, getMainnetType]);

  return { contract, rewardContractForV2, elfiV2StakingContract };
};

export default useStakingPool;
