import { useWeb3React } from '@web3-react/core';
import { useContext, useMemo } from 'react';
import {
  StakingPool,
  StakingPool__factory,
} from '@elysia-dev/contract-typechain';
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
} => {
  const { library } = useWeb3React();
  const { type: getMainnetType } = useContext(MainnetContext);
  const contract = useMemo(() => {
    if (!library) return;
    return StakingPool__factory.connect(
      poolAddress(getMainnetType, staked, v2),
      library.getSigner(),
    );
  }, [library, staked, v2]);

  const rewardContractForV2 = useMemo(() => {
    if (!library) return;
    if (staked === Token.ELFI && v2 && getMainnetType === 'Ethereum') {
      return StakingPool__factory.connect(
        envs.staking.elfyV2StakingPoolRewardAddress,
        library.getSigner(),
      );
    }
  }, [library, staked, v2, getMainnetType]);

  return { contract, rewardContractForV2 };
};

export default useStakingPool;
