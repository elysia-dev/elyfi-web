import { useWeb3React } from '@web3-react/core';
import { BigNumber, constants } from 'ethers';
import moment from 'moment';
import { useContext, useEffect, useMemo, useState } from 'react';
import MainnetContext from 'src/contexts/MainnetContext';
import { roundTimes } from 'src/core/data/stakingRoundTimes';
import RoundData from 'src/core/types/RoundData';
import Token from 'src/enums/Token';
import useStakingPool from './useStakingPool';

let poolData;
let userData;
let rewardPool;
let modifiedRound;
let accountReward;

const useStakingFetchRoundData = (
  stakedToken: Token.EL | Token.ELFI,
  poolApr: BigNumber,
): {
  roundData: RoundData[];
  loading: boolean;
  error: boolean;
  fetchRoundData: (account: string | null | undefined) => Promise<void>;
} => {
  const { type: getMainnetType } = useContext(MainnetContext);
  const { account } = useWeb3React();
  const { contract: stakingPool, rewardContractForV2 } = useStakingPool(
    stakedToken,
    true,
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [roundData, setroundData] = useState<RoundData[]>([]);

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
      apr: poolApr,
      loadedAt: moment(),
      startedAt: roundTime[round].startedAt,
      endedAt: roundTime[round].endedAt,
    };
  };

  const fetchRoundData = async (account: string | null | undefined) => {
    setLoading(true);
    try {
      const data = await Promise.all(
        roundTime.map(async (_item, round) => {
          if (stakingPool && account) {
            if (
              round >= v2Threshold &&
              stakedToken === Token.ELFI &&
              rewardContractForV2
            ) {
              rewardPool = rewardContractForV2;
              modifiedRound = (round + 1 - v2Threshold).toString();
            } else {
              rewardPool = stakingPool;
              modifiedRound = (round + 1).toString();
            }
            poolData = await stakingPool.getPoolData(modifiedRound);
            userData = await stakingPool.getUserData(modifiedRound, account);
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
  }, [account, poolApr, getMainnetType]);

  return { roundData, loading, error, fetchRoundData };
};

export default useStakingFetchRoundData;
