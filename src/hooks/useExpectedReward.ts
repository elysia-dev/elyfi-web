import React, { useEffect, useState } from 'react';
import { BigNumber, ethers, utils } from 'ethers';
import envs from 'src/core/envs';
import stakerABI from 'src/core/abi/StakerABI.json';
import { useWeb3React } from '@web3-react/core';

function useExpectedReward() {
  const { account, library } = useWeb3React();
  const [expectedReward, setExpectedReward] = useState<{
    elfiReward: string;
    ethOrDaiReward: string;
  }>({
    elfiReward: '0',
    ethOrDaiReward: '0',
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
      alert(error);
    }
  };

  return { expectedReward, getExpectedReward };
}

export default useExpectedReward;
