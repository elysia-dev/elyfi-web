import { BigNumber } from 'ethers';
import { Dispatch, SetStateAction } from 'react';
import Token from 'src/enums/Token';
import Position, { TokenInfo } from './Position';
import RewardTypes, { ExpectedRewardTypes } from './RewardTypes';

export type tokenTypes = {
  token0: string;
  token1: string;
};
export type DetailBoxItemHeaderProps = {
  totalLiquidity: string;
  apr: string;
};

export type DetailBoxItemStakingProps = {
  tokens: tokenTypes;
  totalStakedLiquidity: string;
  setModalAndSetStakeToken: () => void;
};
export type DetailBoxProps = {
  tokens: tokenTypes;
  totalLiquidity: number;
  totalStakedLiquidity: BigNumber;
  apr: string;
  isLoading: boolean;
  setModalAndSetStakeToken: () => void;
  round: number;
};

export type LpStakingModalProps = {
  visible: boolean;
  closeHandler: () => void;
  token0: string;
  token1?: Token.DAI | Token.ETH;
  unstakedPositions: TokenInfo[];
  tokenImg: string;
  stakingPoolAddress: string;
  rewardTokenAddress: string;
  round: number;
};

export type StakedLpItemProps = {
  position: Position;
  setUnstakeTokenId: Dispatch<SetStateAction<number>>;
  expectedReward: ExpectedRewardTypes;
  positionInfo: () => {
    rewardToken: number;
    beforeRewardToken: number;
    tokenImg: string;
    rewardTokenType: Token.ETH | Token.DAI;
    pricePerLiquidity: number;
    lpTokenType: string;
  };
  round: number;
};

export type StakingTitleProps = {
  rewardToReceive: RewardTypes;
  onHandler: () => void;
};
