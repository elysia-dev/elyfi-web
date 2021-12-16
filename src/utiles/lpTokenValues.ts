import { lpUnixTimestamp } from 'src/core/data/lpStakingTime';
import envs from 'src/core/envs';

export const lpTokenValues: (
  poolAddress: string,
  tokenAddress: string,
  round: number,
) => (string | number)[] = (
  poolAddress: string,
  tokenAddress: string,
  round: number,
) => {
  return [
    tokenAddress,
    poolAddress,
    lpUnixTimestamp[round].startedAt,
    lpUnixTimestamp[round].endedAt,
    envs.refundedAddress,
  ];
};
