import { ELFIPerDayOnLpStakingPool } from '../data/stakings';

const calcLpExpectedReward = (
  rewardToken: number,
  stakedLiquidity: number,
  totalLiquidity: number,
  minedPerDay: number,
): string => {
  return (
    rewardToken +
    (((minedPerDay / (24 * 3600)) * stakedLiquidity) / totalLiquidity) * 2
  ).toString();
};

export default calcLpExpectedReward;
