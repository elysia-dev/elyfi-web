import { useWeb3React } from '@web3-react/core';
import { BigNumber, constants } from 'ethers';
import moment from 'moment';
import { useContext, useEffect, useState } from 'react';
import PriceContext from 'src/contexts/PriceContext';
import stakingRoundTimes from 'src/core/data/stakingRoundTimes';
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
  rewardToken: Token.ELFI | Token.DAI,
  elPoolApr: BigNumber,
  elfiPoolApr: BigNumber,
): {
  roundData: RoundData[];
  loading: boolean;
  error: boolean;
  fetchRoundData: (account: string | null | undefined) => Promise<void>;
} => {
  const { elPrice, elfiPrice } = useContext(PriceContext);
  const { account } = useWeb3React();
  const { contract: stakingPool } = useStakingPool(stakedToken);
  const { contract: stakingPoolV2, rewardContractForV2 } = useStakingPool(
    Token.ELFI,
    true,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [roundData, setroundData] = useState<RoundData[]>([]);

  const v2Threshold = 2;

  const fetchRoundData = async (account: string | null | undefined) => {
    try {
      const data = await Promise.all(
        stakingRoundTimes.map(async (_item, round) => {
          let poolData;
          let userData;
          let accountReward;
          if (stakingPoolV2 && stakingPool && account) {
            if (
              round >= v2Threshold &&
              stakedToken === Token.ELFI &&
              rewardContractForV2
            ) {
              const modifiedRound = (round + 1 - v2Threshold).toString();
              poolData = await stakingPoolV2.getPoolData(modifiedRound);
              userData = await stakingPoolV2.getUserData(
                modifiedRound,
                account,
              );
              accountReward = await rewardContractForV2.getUserReward(
                account,
                modifiedRound,
              );
            } else {
              const modifiedRound = (round + 1).toString();
              poolData = await stakingPool.getPoolData(modifiedRound);
              userData = await stakingPool.getUserData(modifiedRound, account);
              accountReward = await stakingPool.getUserReward(
                account,
                modifiedRound,
              );
            }

            return {
              accountReward,
              totalPrincipal: poolData.totalPrincipal,
              accountPrincipal: userData.userPrincipal,
              apr: calcAPR(
                poolData.totalPrincipal,
                stakedToken === Token.EL ? elPrice : elfiPrice,
                rewardToken === Token.ELFI
                  ? ELFIPerDayOnELStakingPool
                  : DAIPerDayOnELFIStakingPool,
                rewardToken === Token.ELFI ? elfiPrice : 1,
              ),
              loadedAt: moment(),
              startedAt: stakingRoundTimes[round].startedAt,
              endedAt: stakingRoundTimes[round].endedAt,
            } as RoundData;
          } else {
            return {
              accountReward: constants.Zero,
              totalPrincipal: constants.Zero,
              accountPrincipal: constants.Zero,
              apr: stakedToken === Token.ELFI ? elfiPoolApr : elPoolApr,
              loadedAt: moment(),
              startedAt: stakingRoundTimes[round].startedAt,
              endedAt: stakingRoundTimes[round].endedAt,
            } as RoundData;
          }
        }),
      );

      setroundData(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      const data = await Promise.all(
        stakingRoundTimes.map(async (_item, round) => {
          return {
            accountReward: constants.Zero,
            totalPrincipal: constants.Zero,
            accountPrincipal: constants.Zero,
            apr: stakedToken === Token.ELFI ? elfiPoolApr : elPoolApr,
            loadedAt: moment(),
            startedAt: stakingRoundTimes[round].startedAt,
            endedAt: stakingRoundTimes[round].endedAt,
          } as RoundData;
        }),
      );
      setroundData(data);
      setLoading(false);
      setError(true);
    }
  };

  useEffect(() => {
    fetchRoundData(account);
  }, [account, elfiPoolApr, elPoolApr]);

  return { roundData, loading, error, fetchRoundData };
};

export default useStakingFetchRoundData;
