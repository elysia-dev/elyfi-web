type RewardTypes = {
  elfiReward: number;
  ethReward: number;
  daiReward: number;
};

export default RewardTypes;

export type ExpectedRewardTypes = {
  beforeElfiReward: number;
  elfiReward: number;
  beforeEthReward: number;
  ethReward: number;
  beforeDaiReward: number;
  daiReward: number;
  tokenId: number;
};

export type LpRewardModalProps = {
  visible: boolean;
  closeHandler: () => void;
  rewardToReceive: RewardTypes;
};
