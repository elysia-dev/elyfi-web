import { StakingPoolV2, StakingPoolV2factory } from '@elysia-dev/elyfi-v1-sdk';
import { providers } from 'ethers';
import { useContext, useMemo } from 'react';
import envs from 'src/core/envs';
import Token from 'src/enums/Token';
import MainnetContext from 'src/contexts/MainnetContext';
import MainnetType from 'src/enums/MainnetType';

const useReadOnlyStakingPool = (
  stakedToken: Token,
): StakingPoolV2 => {
  const { type: mainnet } = useContext(MainnetContext);

  const stakingPool = useMemo(() => {
    return StakingPoolV2factory.connect(
      stakedToken === Token.ELFI
        ? mainnet === MainnetType.BSC
          ? envs.stakingV2MoneyPool.elfiBscStaking
          : envs.stakingV2MoneyPool.elfiStaking
        : stakedToken === Token.ELFI_ETH_LP
        ? envs.stakingV2MoneyPool.elfiEthLp
        : stakedToken === Token.ELFI_DAI_LP
        ? envs.stakingV2MoneyPool.elfiDaiLp
        : envs.stakingV2MoneyPool.elfiStaking,
      new providers.JsonRpcProvider(
        mainnet === MainnetType.BSC
          ? envs.jsonRpcUrl.bsc
          : process.env.REACT_APP_JSON_RPC,
      ) as any,
    );
  }, [stakedToken, mainnet]);

  return stakingPool
};

export default useReadOnlyStakingPool;