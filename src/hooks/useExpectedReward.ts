import React, { useCallback, useContext, useEffect, useState } from 'react';
import { BigNumber, ethers, utils } from 'ethers';
import envs from 'src/core/envs';
import stakerABI from 'src/core/abi/StakerABI.json';
import { useWeb3React } from '@web3-react/core';
import Position from 'src/core/types/Position';
import { lpTokenValues } from 'src/utiles/lpTokenValues';

function useExpectedReward() {
  const { library } = useWeb3React();
  const [expectedReward, setExpectedReward] = useState<{
    rewardToken0: string;
    rewardToken1: string;
  }>({
    rewardToken0: '0',
    rewardToken1: '0',
  });
  const [totalExpectedReward, setTotalExpectedReward] = useState<{
    totalElfiReward: number;
    totalEthReward: number;
    totalDaiReward: number;
  }>({
    totalElfiReward: 0,
    totalEthReward: 0,
    totalDaiReward: 0,
  });

  const staker = new ethers.Contract(
    envs.stakerAddress,
    stakerABI,
    library.getSigner(),
  );

  const getExpectedReward = async (
    rewardTokenAddress: string,
    poolAddress: string,
    tokenId: number,
  ) => {
    try {
      const rewardToken1 = await staker.getRewardInfo(
        lpTokenValues(poolAddress, rewardTokenAddress),
        tokenId,
      );
      const rewardToken0 = await staker.getRewardInfo(
        lpTokenValues(poolAddress, envs.governanceAddress),
        tokenId,
      );
      setExpectedReward({
        ...expectedReward,
        rewardToken0: utils.formatEther(rewardToken0.reward),
        rewardToken1: utils.formatEther(rewardToken1.reward),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const addTotalExpectedReward = useCallback(async (positions: Position[]) => {
    let ethTotal = 0;
    let daiTotal = 0;
    let elfiTotal = 0;
    positions.forEach(async (position, idx) => {
      const isEthToken =
        position.incentivePotisions[0].incentive.pool.toLowerCase() ===
        envs.ethElfiPoolAddress.toLowerCase();
      const poolAddress = isEthToken
        ? envs.ethElfiPoolAddress
        : envs.daiElfiPoolAddress;
      const rewardTokenAddress = isEthToken
        ? envs.wEthAddress
        : envs.daiAddress;
      const rewardToken1 = new Promise<{ reward: BigNumber }>(
        (resolve, reject) => {
          resolve(
            staker.getRewardInfo(
              lpTokenValues(poolAddress, rewardTokenAddress),
              position.tokenId,
            ),
          );
          reject(new Error());
        },
      );
      const rewardToken0 = new Promise<{ reward: BigNumber }>(
        (resolve, reject) => {
          resolve(
            staker.getRewardInfo(
              lpTokenValues(poolAddress, envs.governanceAddress),
              position.tokenId,
            ),
          );
          reject(new Error());
        },
      );
      Promise.all([rewardToken1, rewardToken0])
        .then((res) => {
          elfiTotal += parseFloat(utils.formatEther(res[1].reward));
          if (isEthToken) {
            ethTotal += parseFloat(utils.formatEther(res[0].reward));
          } else {
            daiTotal += parseFloat(utils.formatEther(res[0].reward));
          }
          if (
            (positions.length - 1 === idx &&
              totalExpectedReward.totalElfiReward < elfiTotal) ||
            totalExpectedReward.totalEthReward < ethTotal ||
            totalExpectedReward.totalDaiReward < daiTotal
          ) {
            setTotalExpectedReward({
              ...totalExpectedReward,
              totalElfiReward: elfiTotal,
              totalDaiReward: daiTotal,
              totalEthReward: ethTotal,
            });
          }
        })
        .catch((error) => console.log(error));
    });
  }, []);

  return {
    expectedReward,
    getExpectedReward,
    addTotalExpectedReward,
    totalExpectedReward,
  };
}

export default useExpectedReward;
