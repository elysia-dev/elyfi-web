import { useWeb3React } from '@web3-react/core';
import { useContext, useMemo } from 'react';
import { StakingPoolV2, StakingPoolV2factory } from '@elysia-dev/elyfi-v1-sdk';
import envs from 'src/core/envs';
import Token from 'src/enums/Token';
import { poolAddressV2 } from 'src/utiles/stakingPoolAddress';
import MainnetContext from 'src/contexts/MainnetContext';

const useStakingPoolV2 = (
  staked: Token,
): {
  contract: StakingPoolV2 | undefined;
} => {
  const { library } = useWeb3React();
  const { type: getMainnetType } = useContext(MainnetContext);
  const contract = useMemo(() => {
    if (!library) return;
    return StakingPoolV2factory.connect(
      poolAddressV2(getMainnetType, staked),
      library.getSigner(),
    );
  }, [library, staked, getMainnetType]);

  return { contract };
};

export default useStakingPoolV2;
