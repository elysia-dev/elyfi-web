type RoundRewardType = {
  beforeStakingPool: number[];
  afterStakingPool: number[];
  beforeMintedByDaiMoneypool: number;
  mintedByDaiMoneypool: number;
  beforeTetherRewardByElFiStakingPool: number[];
  tetherRewardByElFiStakingPool: number[];
  beforeMintedByTetherMoneypool: number;
  mintedByTetherMoneypool: number;
  beforeElfiRewardByLp: number[];
  elfiRewardByLp: number[];
  beforeDaiRewardByLp: number[];
  daiRewardByLp: number[];
  beforeEthRewardByLp: number[];
  ethRewardByLp: number[];
  beforeMintedByBuscMoneypool: number;
  mintedByBusdMoneypool: number;
  beforeMintedByUsdcMoneypool: number;
  mintedByUsdcMoneypool: number;
};

export default RoundRewardType;
