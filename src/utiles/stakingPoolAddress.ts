import Token from 'src/enums/Token';
import envs from 'src/core/envs';
import MainnetType from 'src/enums/MainnetType';

export const poolAddress = (mainnet: string, stakedToken: string): string => {
  switch (stakedToken) {
    case Token.EL:
      return envs.staking.elStakingPoolAddress;
    case Token.ELFI:
      if (mainnet === MainnetType.BSC) {
        return envs.staking.elfyBscStakingPoolAddress; // elfi busd pool address
      }
      return envs.staking.elfyStakingPoolAddress;
    default:
      return envs.staking.elfyBscStakingPoolAddress;
  }
};

export const poolAddressV2 = (mainnet: string, stakedToken: string): string => {
  switch (stakedToken) {
    case Token.ELFI:
      if (mainnet === MainnetType.BSC) {
        return envs.stakingV2MoneyPool.elfiBscStaking;
      }
      return envs.stakingV2MoneyPool.elfiStaking;
    case Token.ELFI_ETH_LP:
      return envs.stakingV2MoneyPool.elfiEthLp;
    case Token.ELFI_DAI_LP:
      return envs.stakingV2MoneyPool.elfiDaiLp;
    default:
      return envs.stakingV2MoneyPool.elfiStaking;
  }
};

export const stakingRewardTokenAddress = (
  mainnet: string,
  stakedToken: string,
  currentChain?: string,
): string => {
  switch (stakedToken) {
    case Token.EL:
      return envs.token.elAddress;
    case Token.ELFI:
      if (mainnet === MainnetType.BSC) {
        return currentChain === MainnetType.BSCTest
          ? envs.token.testBscElfiAddress
          : envs.token.bscElfiAddress;
      }
      return envs.token.governanceAddress;
    default:
      return envs.token.bscElfiAddress;
  }
};

export const stakingRewardTokenAddressV2 = (
  mainnet: string,
  currentChain?: string,
  token?: Token,
): string => {
  if (mainnet === MainnetType.BSC) {
    return currentChain === MainnetType.BSCTest
      ? envs.token.testBscElfiAddress
      : envs.token.bscElfiAddress;
  }
  if (token === Token.ELFI_ETH_LP) {
    return envs.lpStaking.ethElfiV2PoolAddress;
  } else if (token === Token.ELFI_DAI_LP) {
    return envs.lpStaking.daiElfiV2PoolAddress;
  } else {
    return envs.token.governanceAddress;
  }
};
