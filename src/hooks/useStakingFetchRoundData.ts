import { useWeb3React } from '@web3-react/core';
import { BigNumber, constants } from 'ethers';
import moment from 'moment';
import { useContext, useEffect, useMemo, useState } from 'react';
import MainnetContext from 'src/contexts/MainnetContext';
import PriceContext from 'src/contexts/PriceContext';
import { roundTimes } from 'src/core/data/stakingRoundTimes';
import {
  DAIPerDayOnELFIStakingPool,
  ELFIPerDayOnELStakingPool,
} from 'src/core/data/stakings';
import RoundData from 'src/core/types/RoundData';
import calcAPR from 'src/core/utils/calcAPR';
import Token from 'src/enums/Token';
import useStakingPool from './useStakingPool';

const useStakingFetchRoundData = (
  stakedToken: Token.EL | Token.ELFI,
  rewardToken: string,
  poolApr: BigNumber,
  currentPhase: number,
): {
  roundData: RoundData[];
  loading: boolean;
  error: boolean;
  fetchRoundData: (account: string | null | undefined) => Promise<void>;
} => {
  const { type: getMainnetType } = useContext(MainnetContext);
  const { account } = useWeb3React();
  const {
    contract: stakingPool,
    rewardContractForV2,
    elfiV2StakingContract,
  } = useStakingPool(stakedToken, true);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [roundData, setroundData] = useState<RoundData[]>([]);
  const { elPrice, elfiPrice } = useContext(PriceContext);

  const roundTime = useMemo(
    () => roundTimes(stakedToken, getMainnetType),
    [getMainnetType, stakedToken],
  );

  const v2Threshold = 2;

  const stakedData = (
    round: number,
    accountReward?: BigNumber,
    totalPrincipal?: BigNumber,
    accountPrincipal?: BigNumber,
  ) => {
    return {
      accountReward: accountReward ? accountReward : constants.Zero,
      totalPrincipal: totalPrincipal ? totalPrincipal : constants.Zero,
      accountPrincipal: accountPrincipal ? accountPrincipal : constants.Zero,
      apr: totalPrincipal
        ? calcAPR(
            totalPrincipal,
            stakedToken === Token.EL ? elPrice : elfiPrice,
            rewardToken === Token.ELFI
              ? ELFIPerDayOnELStakingPool
              : DAIPerDayOnELFIStakingPool,
            rewardToken === Token.ELFI ? elfiPrice : 1,
          )
        : poolApr,
      loadedAt: moment(),
      startedAt: roundTime[round].startedAt,
      endedAt: roundTime[round].endedAt,
    };
  };

  const fetchRoundData = async (account: string | null | undefined) => {
    try {
      const data = await Promise.all(
        roundTime.map(async (_item, round) => {
          let poolData;
          let userData;
          let rewardPool;
          let modifiedRound;
          let accountReward;
          let stakingContract;
          if (stakingPool && account && round <= currentPhase - 1) {
            if (
              round >= v2Threshold &&
              stakedToken === Token.ELFI &&
              rewardContractForV2 &&
              elfiV2StakingContract
            ) {
              stakingContract = elfiV2StakingContract;
              rewardPool = rewardContractForV2;
              modifiedRound = (round + 1 - v2Threshold).toString();
            } else {
              stakingContract = stakingPool;
              rewardPool = stakingPool;
              modifiedRound = (round + 1).toString();
            }
            poolData = await stakingContract.getPoolData(modifiedRound);
            userData = await stakingContract.getUserData(
              modifiedRound,
              account,
            );
            accountReward = await rewardPool.getUserReward(
              account,
              modifiedRound,
            );
            return stakedData(
              round,
              accountReward,
              poolData.totalPrincipal,
              userData.userPrincipal,
            );
          } else {
            return stakedData(round);
          }
        }),
      );
      setroundData(data);
      setLoading(false);
      setError(false);
    } catch (error) {
      console.log(error);
      const data = await Promise.all(
        roundTime.map(async (_item, round) => {
          return stakedData(round);
        }),
      );
      setroundData(data);
      setLoading(false);
      setError(true);
    }
  };

  useEffect(() => {
    fetchRoundData(account);
  }, [
    account,
    poolApr,
    getMainnetType,
    stakingPool,
    rewardContractForV2,
    elfiV2StakingContract,
  ]);

  useEffect(() => {
    setLoading(true);
    setError(false);
  }, [account, getMainnetType]);

  return { roundData, loading, error, fetchRoundData };
};

export default useStakingFetchRoundData;
