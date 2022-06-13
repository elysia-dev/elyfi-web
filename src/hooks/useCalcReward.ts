import { BigNumber } from '@elysia-dev/contract-typechain/node_modules/ethers';
import { utils } from 'ethers';
import { useContext, useEffect, useState } from 'react';
import MainnetContext from 'src/contexts/MainnetContext';
import { IStakingPoolRound, roundTimes } from 'src/core/data/stakingRoundTimes';
import { TETHERPerDayOnELFIStakingPool } from 'src/core/data/stakings';
import RoundRewardType from 'src/core/types/RoundRewardType';
import {
  calcDaiRewardByLp,
  calcElfiRewardByLp,
  calcEthRewardByLp,
} from 'src/core/utils/calcLpReward';
import calcMintedAmounts from 'src/core/utils/calcMintedAmounts';
import {
  calcMintedByBusdMoneypool,
  calcMintedByDaiMoneypool,
  calcMintedByTetherMoneypool,
  calcMintedByUsdcMoneypool,
} from 'src/core/utils/calcMintedByDaiMoneypool';
import { rewardPerDayByToken } from 'src/utiles/stakingReward';

const initState = (
  stakingRoundDate: IStakingPoolRound[],
  rewardPerDay: BigNumber,
  state?: RoundRewardType,
) => {
  return {
    beforeStakingPool: state
      ? state.afterStakingPool
      : stakingRoundDate.map(() => 0),
    afterStakingPool: calcMintedAmounts(
      parseFloat(utils.formatEther(rewardPerDay)),
      stakingRoundDate,
    ),
    beforeMintedByDaiMoneypool: state ? state.mintedByDaiMoneypool : 0,
    mintedByDaiMoneypool: calcMintedByDaiMoneypool(),
    beforeTetherRewardByElFiStakingPool: state
      ? state.tetherRewardByElFiStakingPool
      : [0, 0, 0],
    tetherRewardByElFiStakingPool: calcMintedAmounts(
      parseFloat(utils.formatEther(TETHERPerDayOnELFIStakingPool)),
      stakingRoundDate,
    ),
    beforeMintedByTetherMoneypool: state ? state.mintedByTetherMoneypool : 0,
    mintedByTetherMoneypool: calcMintedByTetherMoneypool(),
    beforeElfiRewardByLp: state ? state.elfiRewardByLp : [0, 0, 0],
    elfiRewardByLp: calcElfiRewardByLp(),
    beforeDaiRewardByLp: state ? state.daiRewardByLp : [0, 0, 0],
    daiRewardByLp: calcDaiRewardByLp(),
    beforeEthRewardByLp: state ? state.ethRewardByLp : [0, 0, 0],
    ethRewardByLp: calcEthRewardByLp(),
    beforeMintedByBuscMoneypool: state ? state.mintedByBusdMoneypool : 0,
    mintedByBusdMoneypool: calcMintedByBusdMoneypool(),
    beforeMintedByUsdcMoneypool: state ? state.mintedByUsdcMoneypool : 0,
    mintedByUsdcMoneypool: calcMintedByUsdcMoneypool(),
  };
};

const useCalcReward = (
  token: string,
): {
  state: RoundRewardType;
} => {
  const { type: getMainnetType } = useContext(MainnetContext);
  const stakingRoundDate = roundTimes(token, getMainnetType);
  const rewardPerDay = rewardPerDayByToken(token, getMainnetType);

  const [state, setState] = useState<RoundRewardType>(
    initState(stakingRoundDate, rewardPerDay),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setState(initState(stakingRoundDate, rewardPerDay, state));
    }, 2000);
    return () => {
      clearInterval(interval);
    };
  }, [state]);

  useEffect(() => {
    setState(initState(stakingRoundDate, rewardPerDay));
  }, [getMainnetType]);

  return { state };
};

export default useCalcReward;
