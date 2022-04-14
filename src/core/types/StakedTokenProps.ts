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
    totalElfi: number;
    totalEth: number;
    totalDai: number;
  };
  isError: string;
  round: number;
  isLoading: boolean;
};

export default StakedTokenProps;
