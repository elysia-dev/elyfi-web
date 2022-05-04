import { useWeb3React } from '@web3-react/core';
import { BigNumber, constants } from 'ethers';
import useSWR from 'swr';
import envs from 'src/core/envs';
import moment from 'moment';
import { useContext, useEffect, useState } from 'react';
import { pricesFetcher, PriceType } from 'src/clients/Coingecko';
import MainnetContext from 'src/contexts/MainnetContext';
import {
  DAIPerDayOnELFIStakingPool,
  ELFIPerDayOnELStakingPool,
} from 'src/core/data/stakings';
import RoundData from 'src/core/types/RoundData';
import calcAPR from 'src/core/utils/calcAPR';
import Token from 'src/enums/Token';
import priceMiddleware from 'src/middleware/priceMiddleware';
import useReadOnlyStakingPool from './useReadOnlyStakingPool';

const useStakingFetchRoundDataV2 = (
  stakedToken: Token,
  rewardToken: string,
  poolApr: BigNumber,
): {
  roundData: RoundData[];
  loading: boolean;
  error: boolean;
  fetchRoundData: (account: string | null | undefined) => Promise<void>;
} => {
  const { type: getMainnetType } = useContext(MainnetContext);
  const { account } = useWeb3React();
  const stakingPool = useReadOnlyStakingPool(stakedToken)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [roundData, setroundData] = useState<RoundData[]>([]);

  const { data: priceData } = useSWR(
    envs.externalApiEndpoint.coingackoURL,
    pricesFetcher,
    {
      use: [priceMiddleware],
    },
  );

  const stakedData = (
    priceData: PriceType,
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
            stakedToken === Token.UNI ? priceData.elPrice : priceData.elfiPrice,
            rewardToken === Token.ELFI
              ? ELFIPerDayOnELStakingPool
              : DAIPerDayOnELFIStakingPool,
            rewardToken === Token.ELFI ? priceData.elfiPrice : 1,
          )
        : poolApr,
      loadedAt: moment(),
    };
  };

  const fetchRoundData = async (account: string | null | undefined) => {
    try {
      setLoading(true);
      setError(false);
      if (!priceData) return;
      const data: RoundData[] = [];
      const poolData = await stakingPool?.getPoolData();
      if (stakingPool && account) {
        const userData = await stakingPool.getUserData(account);
        const accountReward = await stakingPool.getUserReward(account);

        data.push(
          stakedData(
            priceData,
            accountReward,
            poolData?.totalPrincipal || constants.Zero,
            userData.userPrincipal,
          ),
        );
      } else {
        data.push(stakedData(priceData));
      }
      setroundData(data);
      setError(false);
      setLoading(false);
    } catch (error) {
      console.log(error);
      if (!priceData) return;
      const data: RoundData[] = [];
      data.push(stakedData(priceData));
      setroundData(data);
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoundData(account);
  }, [account, getMainnetType, poolApr, stakingPool]);

  return { roundData, loading, error, fetchRoundData };
};

export default useStakingFetchRoundDataV2;
