import moment from 'moment';
import Token from 'src/enums/Token';
import { lpRoundDate } from '../data/lpStakingTime';

export const ELFI_REWARD_PER_POOL = 300000;
export const ETH_REWARD_PER_POOL = 5.507;
export const ETH_REWARD_PER_POOL_2 = 6.437;
export const DAI_REWARD_PER_POOL = 25000;

const ethRewardPerPool = (index: number, max: number, token?: string) => {
  return token === Token.ETH && index >= 1 ? ETH_REWARD_PER_POOL_2 : max;
};

const calcReward = (max: number, token?: string) => {
  const current = moment();

  return lpRoundDate.map((date, index) => {
    if (current.diff(date.startedAt) <= 0) return 0;

    return current.diff(date.endedAt) <= 0
      ? (current.diff(date.startedAt, 'seconds') *
          (ethRewardPerPool(index, max, token) / 40)) /
          (24 * 3600)
      : ethRewardPerPool(index, max, token);
  });
};

export const calcElfiRewardByLp = (): number[] => {
  return calcReward(ELFI_REWARD_PER_POOL);
};

export const calcEthRewardByLp = (): number[] => {
  return calcReward(ETH_REWARD_PER_POOL, Token.ETH);
};

export const calcDaiRewardByLp = (): number[] => {
  return calcReward(DAI_REWARD_PER_POOL);
};
