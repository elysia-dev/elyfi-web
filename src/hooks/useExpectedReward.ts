import React, { useCallback, useContext, useEffect, useState } from 'react';
import { BigNumber, ethers, utils } from 'ethers';
import envs from 'src/core/envs';
import stakerABI from 'src/core/abi/StakerABI.json';
import { useWeb3React } from '@web3-react/core';
import Position from 'src/core/types/Position';
import PriceContext from 'src/contexts/PriceContext';

function useExpectedReward() {
  const { account, library } = useWeb3React();
  const { elfiDaiPool, elfiEthPool } = useContext(PriceContext);
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
        [rewardTokenAddress, poolAddress, 1635751200, 1638005456, account],
        tokenId,
      );
      const elfiReward = await staker.getRewardInfo(
        [envs.governanceAddress, poolAddress, 1635751200, 1638005456, account],
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

  const a = () => {};
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
        const rewardTokenAddress = isEthToken ? envs.wEth : envs.daiAddress;
        const ethOrDaiReward = new Promise<{ reward: BigNumber }>(
          (resolve, reject) => {
            resolve(
              staker.getRewardInfo(
                [
                  rewardTokenAddress,
                  poolAddress,
                  1635751200,
                  1638005456,
                  account,
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
                  1635751200,
                  1638005456,
                  account,
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
              (isEthToken ? elfiEthPool.price : elfiDaiPool.price);
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
          .catch(() => console.log('unstaking'));
      });
    } catch (error) {
      console.log('');
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
