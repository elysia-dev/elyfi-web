import Token from 'src/enums/Token';
import envs from 'src/core/envs';

export const poolAddress = (
  mainnet: string,
  stakedToken: string,
  v2: boolean,
): string => {
  switch (stakedToken) {
    case Token.EL:
      return envs.staking.elStakingPoolAddress;
    case Token.ELFI:
      if (mainnet === 'BSC') {
        return envs.staking.elfyBscStakingPoolAddress; // elfi busd pool address
      }
      if (v2) {
        return envs.staking.elfyV2StakingPoolAddress;
      }
      return envs.staking.elfyStakingPoolAddress;
    default:
      return '';
  }
};

export const tokenAddress = (mainnet: string, stakedToken: string): string => {
  switch (stakedToken) {
    case Token.EL:
      return envs.token.elAddress;
    case Token.ELFI:
      if (mainnet === 'BSC') {
        return envs.token.testBscElfiAddress;
      }
      return envs.token.governanceAddress;
    default:
      return envs.token.bscElfiAddress;
  }
};
