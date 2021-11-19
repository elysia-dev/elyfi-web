import moment from 'moment';
import { lpStakingEndedAt, lpStakingStartedAt } from '../data/lpStakingTime';

export const ELFI_REWARD_PER_POOL = 300000;
export const ETH_REWARD_PER_POOL = 5.507;
export const DAI_REWARD_PER_POOL = 25000;

const calcReward = (max: number) => {
  const current = moment();

  if (current.diff(lpStakingStartedAt) <= 0) return 0;

  return current.diff(lpStakingEndedAt) <= 0
    ? (current.diff(lpStakingStartedAt, 'seconds') * (max / 40)) / (24 * 3600)
    : max;
};

export const calcElfiRewardByLp = (): number => {
  return calcReward(ELFI_REWARD_PER_POOL);
};

export const calcEthRewardByLp = (): number => {
  return calcReward(ETH_REWARD_PER_POOL);
};

export const calcDaiRewardByLp = (): number => {
  return calcReward(DAI_REWARD_PER_POOL);
};
