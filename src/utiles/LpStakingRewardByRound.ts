import { ETH_REWARD_PER_POOL } from 'src/core/data/stakings';
import {
  ETH_REWARD_PER_POOL_2,
  ETH_REWARD_PER_POOL_3,
  ETH_REWARD_PER_POOL_4,
} from 'src/core/utils/calcLpReward';

export const ethRewardByRound = (round: number): number => {
  switch (round) {
    case 1:
      return ETH_REWARD_PER_POOL;
    case 2:
      return ETH_REWARD_PER_POOL_2;
    case 3:
      return ETH_REWARD_PER_POOL_3;
    default:
      return ETH_REWARD_PER_POOL_4;
  }
};

const lpStakingPerRewardByRound = (round: number): string => {
  switch (round) {
    case 0:
      return '0.1376 ETH';
    case 1:
      return '0.1609 ETH';
    case 2:
      return '0.255 ETH';
    default:
      return 'TBD';
  }
};

export default lpStakingPerRewardByRound;
