import { utils } from 'ethers';
import { useContext, useEffect, useState } from 'react';
import MainnetContext from 'src/contexts/MainnetContext';
import stakingRoundTimes, {
  busdStakingRoundTimes,
} from 'src/core/data/stakingRoundTimes';
import {
  BUSDPerDayOnELFIStakingPool,
  DAIPerDayOnELFIStakingPool,
  ELFIPerDayOnELStakingPool,
  TETHERPerDayOnELFIStakingPool,
} from 'src/core/data/stakings';
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
} from 'src/core/utils/calcMintedByDaiMoneypool';
import { rewardPerDayByToken } from 'src/utiles/stakingInfoBytoken';

const useCalcReward = (token: string) => {
  const { type: getMainnetType } = useContext(MainnetContext);
  const roundTimes =
    token === 'ELFI' && getMainnetType === 'BSC'
      ? busdStakingRoundTimes
      : stakingRoundTimes;
  const rewardPerDay = rewardPerDayByToken(token, getMainnetType);

  const [state, setState] = useState({
    beforeStakingPool: roundTimes.map(() => 0),
    afterStakingPool: calcMintedAmounts(
      parseFloat(utils.formatEther(rewardPerDay)),
      roundTimes,
    ),
    beforeMintedByDaiMoneypool: 0,
    mintedByDaiMoneypool: calcMintedByDaiMoneypool(),
    beforeTetherRewardByElFiStakingPool: [0, 0, 0],
    tetherRewardByElFiStakingPool: calcMintedAmounts(
      parseFloat(utils.formatEther(TETHERPerDayOnELFIStakingPool)),
      roundTimes,
    ),
    beforeMintedByTetherMoneypool: 0,
    mintedByTetherMoneypool: calcMintedByTetherMoneypool(),
    beforeElfiRewardByLp: [0, 0, 0],
    elfiRewardByLp: calcElfiRewardByLp(),
    beforeDaiRewardByLp: [0, 0, 0],
    daiRewardByLp: calcDaiRewardByLp(),
    beforeEthRewardByLp: [0, 0, 0],
    ethRewardByLp: calcEthRewardByLp(),
    beforeMintedByBuscMoneypool: 0,
    mintedByBusdMoneypool: calcMintedByBusdMoneypool(),
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setState({
        beforeStakingPool: state.afterStakingPool,
        afterStakingPool: calcMintedAmounts(
          parseFloat(utils.formatEther(rewardPerDay)),
          roundTimes,
        ),
        beforeMintedByDaiMoneypool: state.mintedByDaiMoneypool,
        mintedByDaiMoneypool: calcMintedByDaiMoneypool(),
        beforeTetherRewardByElFiStakingPool:
          state.tetherRewardByElFiStakingPool,
        tetherRewardByElFiStakingPool: calcMintedAmounts(
          Number(utils.formatEther(TETHERPerDayOnELFIStakingPool)),
          roundTimes,
        ),
        beforeMintedByTetherMoneypool: state.mintedByTetherMoneypool,
        mintedByTetherMoneypool: calcMintedByTetherMoneypool(),
        beforeElfiRewardByLp: state.elfiRewardByLp,
        elfiRewardByLp: calcElfiRewardByLp(),
        beforeDaiRewardByLp: state.daiRewardByLp,
        daiRewardByLp: calcDaiRewardByLp(),
        beforeEthRewardByLp: state.ethRewardByLp,
        ethRewardByLp: calcEthRewardByLp(),
        beforeMintedByBuscMoneypool: state.mintedByBusdMoneypool,
        mintedByBusdMoneypool: calcMintedByBusdMoneypool(),
      });
    }, 2000);
    return () => {
      clearInterval(interval);
    };
  }, [state]);

  return { state };
};

export default useCalcReward;
