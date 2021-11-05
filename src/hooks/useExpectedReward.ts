import React, { useCallback, useContext, useEffect, useState } from 'react';
import { BigNumber, ethers, utils } from 'ethers';
import envs from 'src/core/envs';
import stakerABI from 'src/core/abi/StakerABI.json';
import { useWeb3React } from '@web3-react/core';
import Position from 'src/core/types/Position';
import usePricePerLiquidity from './usePricePerLiquidity';

function useExpectedReward() {
  const { account, library } = useWeb3React();
  const { pricePerDaiLiquidity, pricePerEthLiquidity } = usePricePerLiquidity();
  const [expectedReward, setExpectedReward] = useState<{
    elfiReward: string;
    ethOrDaiReward: string;
  }>({
    elfiReward: '0',
    ethOrDaiReward: '0',
  });
  const [totalExpectedReward, setTotalExpectedReward] = useState<{
    totalElfiReward: number;
    totalEthReward: number;
    totalDaiReward: number;
    totalliquidity: number;
  }>({
    totalElfiReward: 0,
    totalEthReward: 0,
    totalDaiReward: 0,
    totalliquidity: 0,
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
      const ethOrDaiReward = await staker.getRewardInfo(
        [
          rewardTokenAddress,
          poolAddress,
          envs.lpTokenStakingStartTime,
          envs.lpTokenStakingEndTime,
          envs.refundedAddress,
        ],
        tokenId,
      );
      const elfiReward = await staker.getRewardInfo(
        [
          envs.governanceAddress,
          poolAddress,
          envs.lpTokenStakingStartTime,
          envs.lpTokenStakingEndTime,
          envs.refundedAddress,
        ],
        tokenId,
      );
      setExpectedReward({
        ...expectedReward,
        elfiReward: utils.formatEther(elfiReward.reward),
        ethOrDaiReward: utils.formatEther(ethOrDaiReward.reward),
      });
    } catch (error) {
      // console.log(error);
    }
  };

  const a = () => { };
  const addTotalExpectedReward = useCallback(async (positions: Position[]) => {
    try {
      let ethTotal = 0;
      let daiTotal = 0;
      let elfiTotal = 0;
      let liquidityTotal = 0;
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
        const ethOrDaiReward = new Promise<{ reward: BigNumber }>(
          (resolve, reject) => {
            resolve(
              staker.getRewardInfo(
                [
                  rewardTokenAddress,
                  poolAddress,
                  envs.lpTokenStakingStartTime,
                  envs.lpTokenStakingEndTime,
                  envs.refundedAddress,
                ],
                position.tokenId,
              ),
            );
            reject(new Error('unstaking'));
          },
        );
        const elfiReward = new Promise<{ reward: BigNumber }>(
          (resolve, reject) => {
            resolve(
              staker.getRewardInfo(
                [
                  envs.governanceAddress,
                  poolAddress,
                  envs.lpTokenStakingStartTime,
                  envs.lpTokenStakingEndTime,
                  envs.refundedAddress,
                ],
                position.tokenId,
              ),
            );
            reject(new Error('unstaking'));
          },
        );
        Promise.all([ethOrDaiReward, elfiReward])
          .then((res) => {
            liquidityTotal +=
              parseFloat(utils.formatEther(position.liquidity)) *
              (isEthToken ? pricePerEthLiquidity : pricePerDaiLiquidity);
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
                totalliquidity: liquidityTotal,
              });
            }
          })
          .catch((error) => console.log(error));
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  return {
    expectedReward,
    getExpectedReward,
    addTotalExpectedReward,
    totalExpectedReward,
  };
}

export default useExpectedReward;
