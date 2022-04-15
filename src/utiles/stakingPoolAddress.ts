import Token from 'src/enums/Token';
import envs from 'src/core/envs';

export const poolAddress = (mainnet: string, stakedToken: string): string => {
  switch (stakedToken) {
    case Token.EL:
      return envs.staking.elStakingPoolAddress;
    case Token.ELFI:
      if (mainnet === 'BSC') {
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
      if (mainnet === 'BSC') {
        return envs.stakingV2MoneyPool.elfiStaking; // elfi only... yet
      }
      return envs.stakingV2MoneyPool.elfiStaking;
    case Token.UNI:
      return envs.stakingV2MoneyPool.lpStaking;
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
      if (mainnet === 'BSC') {
        return currentChain === 'BSC Test'
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
): string => {
  if (mainnet === 'BSC') {
    return currentChain === 'BSC Test'
      ? envs.token.testBscElfiAddress
      : envs.token.bscElfiAddress;
  }
  return envs.token.governanceAddress;
};
