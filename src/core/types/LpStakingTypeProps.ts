import { BigNumber } from 'ethers';
import { Dispatch, SetStateAction } from 'react';
import Token from 'src/enums/Token';
import { Position as IPosition } from 'src/hooks/usePositions';
import Position from './Position';
import RewardTypes, { ExpectedRewardTypes } from './RewardTypes';

export type tokenTypes = {
  token0: string;
  token1: string;
};
export type DetailBoxItemHeaderProps = {
  token1: string;
};

export type DetailBoxItemStakingProps = {
  tokens: tokenTypes;
  totalStakedLiquidity: string;
  isLoading: boolean;
};
export type DetailBoxProps = {
  tokens: tokenTypes;
  totalStakedLiquidity: BigNumber;
  isLoading: boolean;
  round: number;
};

export type LpStakingModalProps = {
  visible: boolean;
  closeHandler: () => void;
  token0: string;
  token1?: Token.DAI | Token.ETH;
  unstakedPositions: IPosition[];
  tokenImg: string;
  stakingPoolAddress: string;
  rewardTokenAddress: string;
  round: number;
  transactionWait: boolean;
  setTransactionWait: () => void;
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
