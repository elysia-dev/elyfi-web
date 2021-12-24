import moment from 'moment';
import { lpRoundDate } from '../data/lpStakingTime';

export const ELFI_REWARD_PER_POOL = 300000;
export const ETH_REWARD_PER_POOL = 5.507;
export const ETH_REWARD_PER_POOL_2 = 6.437;
export const DAI_REWARD_PER_POOL = 25000;

const calcReward = (max: number) => {
  const current = moment();

  return lpRoundDate.map((date) => {
    if (current.diff(date.startedAt) <= 0) return 0;

    return current.diff(date.endedAt) <= 0
      ? (current.diff(date.startedAt, 'seconds') * (max / 40)) / (24 * 3600)
      : max;
  });
};

export const calcElfiRewardByLp = (): number[] => {
  return calcReward(ELFI_REWARD_PER_POOL);
};

export const calcEthRewardByLp = (round: number): number[] => {
  if (round === 1) {
    return calcReward(ETH_REWARD_PER_POOL_2);
  }
  return calcReward(ETH_REWARD_PER_POOL);
};

export const calcDaiRewardByLp = (): number[] => {
  return calcReward(DAI_REWARD_PER_POOL);
};
