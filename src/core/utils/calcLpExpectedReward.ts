const calcLpExpectedReward = (
  rewardToken: number,
  stakedLiquidity: number,
  totalLiquidity: number,
  minedPerDay: number,
): number => {
  return (
    rewardToken +
    (((minedPerDay / (24 * 3600)) * stakedLiquidity) / totalLiquidity) * 2
  );
};

export default calcLpExpectedReward;
