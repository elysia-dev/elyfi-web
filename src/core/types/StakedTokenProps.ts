import { BigNumber } from 'ethers';
import { Dispatch, SetStateAction } from 'react';
import Position from './Position';
import { ExpectedRewardTypes } from './RewardTypes';

type StakedTokenProps = {
  stakedPositions: Position[];
  setUnstakeTokenId: Dispatch<SetStateAction<number>>;
  ethElfiStakedLiquidity: BigNumber;
  daiElfiStakedLiquidity: BigNumber;
  expectedReward: ExpectedRewardTypes[];
  totalExpectedReward: {
    beforeTotalElfi: number;
    totalElfi: number;
    beforeTotalEth: number;
    totalEth: number;
    beforeTotalDai: number;
    totalDai: number;
  };
  round: number;
  incentiveIds: string[];
  isLoading: boolean;
};

export default StakedTokenProps;
