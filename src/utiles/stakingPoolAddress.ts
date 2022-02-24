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
