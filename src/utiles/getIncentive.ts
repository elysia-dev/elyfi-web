import { ethers } from 'ethers';
import { lpUnixTimestamp } from 'src/core/data/lpStakingTime';
import envs from 'src/core/envs';

const getIncentiveId = (): {
  daiIncentiveId: string;
  ethIncentiveId: string;
}[] => {
  const poolAddress = [
    envs.lpStaking.daiElfiPoolAddress,
    envs.lpStaking.ethElfiPoolAddress,
  ];
  const incentiveIds: { daiIncentiveId: string; ethIncentiveId: string }[] = [];

  const get = (time: { startedAt: number; endedAt: number }) => {
    return poolAddress.map((address) => {
      const incentives = [
        address === envs.lpStaking.daiElfiPoolAddress
          ? envs.token.daiAddress
          : envs.token.wEthAddress, // rewardToken
        address, // pool
        time.startedAt, // start
        time.endedAt, // end
        envs.lpStaking.refundedAddress, // refundee
      ];
      const incentiveIdEncoded = ethers.utils.defaultAbiCoder.encode(
        ['tuple(address,address,uint256,uint256,address)'],
        [incentives],
      );
      return ethers.utils.keccak256(incentiveIdEncoded).toLowerCase();
    });
  };

  lpUnixTimestamp.forEach((time) => {
    incentiveIds.push({
      daiIncentiveId: get(time)[0],
      ethIncentiveId: get(time)[1],
    });
  });

  return incentiveIds;
};

export default getIncentiveId;
