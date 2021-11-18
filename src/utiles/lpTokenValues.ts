import envs from 'src/core/envs';

export const lpTokenValues: (
  poolAddress: string,
  tokenAddress: string,
) => (string | number)[] = (poolAddress: string, tokenAddress: string) => {
  return [
    tokenAddress,
    poolAddress,
    envs.lpTokenStakingStartTime,
    envs.lpTokenStakingEndTime,
    envs.refundedAddress,
  ];
};
