import { useCallback, useState } from 'react';
import { ethers, utils } from 'ethers';
import envs from 'src/core/envs';
import stakerABI from 'src/core/abi/StakerABI.json';
import { useWeb3React } from '@web3-react/core';
import Position from 'src/core/types/Position';
import { lpTokenValues } from 'src/utiles/lpTokenValues';
import {
  DAIPerDayOnElfiDaiPool,
  ELFIPerDayOnLpStakingPool,
  ETHPerDayOnElfiEthPool,
} from 'src/core/data/stakings';
import calcLpExpectedReward from 'src/core/utils/calcLpExpectedReward';
import getAddressesByPool, {
  isEthElfiPoolAddress,
} from 'src/core/utils/getAddressesByPool';
import { ExpectedRewardTypes } from 'src/core/types/RewardTypes';
import usePricePerLiquidity from './usePricePerLiquidity';

function useExpectedReward(): {
  setExpecteReward: (positions: Position[]) => Promise<void>;
  expectedReward: ExpectedRewardTypes[];
  updateExpectedReward: (
    positions: Position[],
    ethPoolTotalLiquidity: number,
    daiPoolTotalLiquidity: number,
  ) => void;
} {
  const { library } = useWeb3React();
  const { pricePerDaiLiquidity, pricePerEthLiquidity } = usePricePerLiquidity();
  const [expectedReward, setExpectedReward] = useState<ExpectedRewardTypes[]>(
    [],
  );

  const staker = new ethers.Contract(
    envs.stakerAddress,
    stakerABI,
    library.getSigner(),
  );

  const getReward = async (position: Position) => {
    const isEthPoolAddress = isEthElfiPoolAddress(position);
    const { poolAddress, rewardTokenAddress } = getAddressesByPool(position);

    const rewardToken0 = await staker.getRewardInfo(
      lpTokenValues(poolAddress, envs.governanceAddress),
      position.tokenId,
    );

    const rewardToken1 = await staker.getRewardInfo(
      lpTokenValues(poolAddress, rewardTokenAddress),
      position.tokenId,
    );

    return {
      beforeElfiReward: parseFloat(utils.formatEther(rewardToken0[0])),
      elfiReward: parseFloat(utils.formatEther(rewardToken0[0])),
      beforeEthReward: isEthPoolAddress
        ? parseFloat(utils.formatEther(rewardToken1[0]))
        : 0,
      ethReward: isEthPoolAddress
        ? parseFloat(utils.formatEther(rewardToken1[0]))
        : 0,
      beforeDaiReward: isEthPoolAddress
        ? 0
        : parseFloat(utils.formatEther(rewardToken1[0])),
      daiReward: isEthPoolAddress
        ? 0
        : parseFloat(utils.formatEther(rewardToken1[0])),
      tokenId: position.tokenId,
    };
  };

  const setExpecteReward = useCallback(
    async (positions: Position[]) => {
      const allReward: {
        beforeElfiReward: number;
        elfiReward: number;
        beforeEthReward: number;
        ethReward: number;
        beforeDaiReward: number;
        daiReward: number;
        tokenId: number;
      }[] = [];
      const reward = positions.map(async (position, idx) => {
        allReward.push(await getReward(position));
      });

      await Promise.all(reward).then(() => {
        allReward.sort((prev, next) => prev.tokenId - next.tokenId);
        setExpectedReward(allReward);
      });
    },
    [expectedReward],
  );

  const updateExpectedReward = (
    positions: Position[],
    ethPoolTotalLiquidity: number,
    daiPoolTotalLiquidity: number,
  ) => {
    const allReward: {
      beforeElfiReward: number;
      elfiReward: number;
      beforeEthReward: number;
      ethReward: number;
      beforeDaiReward: number;
      daiReward: number;
      tokenId: number;
    }[] = [];
    positions.forEach((position, idx) => {
      const isEthElfiPoolAddress =
        position.incentivePotisions[0].incentive.pool.toLowerCase() ===
        envs.ethElfiPoolAddress.toLowerCase();
      const pricePerLiquidity = isEthElfiPoolAddress
        ? pricePerEthLiquidity
        : pricePerDaiLiquidity;
      const mintedPerDay = isEthElfiPoolAddress
        ? ETHPerDayOnElfiEthPool
        : DAIPerDayOnElfiDaiPool;
      const stakedLiquidity =
        parseFloat(utils.formatEther(position.liquidity)) * pricePerLiquidity;
      const totalLiquidity = isEthElfiPoolAddress
        ? ethPoolTotalLiquidity
        : daiPoolTotalLiquidity;

      allReward.push({
        beforeElfiReward: expectedReward[idx].elfiReward,
        elfiReward: calcLpExpectedReward(
          expectedReward[idx].beforeElfiReward,
          stakedLiquidity,
          totalLiquidity,
          ELFIPerDayOnLpStakingPool,
        ),
        beforeEthReward: expectedReward[idx].ethReward,
        ethReward: isEthElfiPoolAddress
          ? calcLpExpectedReward(
              expectedReward[idx].beforeEthReward,
              stakedLiquidity,
              totalLiquidity,
              mintedPerDay,
            )
          : 0,
        beforeDaiReward: expectedReward[idx].daiReward,
        daiReward: isEthElfiPoolAddress
          ? 0
          : calcLpExpectedReward(
              expectedReward[idx].beforeDaiReward,
              stakedLiquidity,
              totalLiquidity,
              mintedPerDay,
            ),
        tokenId: expectedReward[idx].tokenId,
      });
    });
    setExpectedReward(allReward);
  };

  return {
    setExpecteReward,
    expectedReward,
    updateExpectedReward,
  };
}

export default useExpectedReward;
