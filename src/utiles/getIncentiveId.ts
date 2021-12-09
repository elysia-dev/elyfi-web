import { ethers } from 'ethers';
import { lpUnixTimestamp } from 'src/core/data/lpStakingTime';
import envs from 'src/core/envs';

const getIncentiveId = (round: number): string[] => {
  const poolAddress = [envs.daiElfiPoolAddress, envs.ethElfiPoolAddress];
  return poolAddress.map((address) => {
    const incentives = [
      address === envs.daiElfiPoolAddress ? envs.daiAddress : envs.wEthAddress, // rewardToken
      address, // pool
      lpUnixTimestamp[round].startedAt, // start
      lpUnixTimestamp[round].endedAt, // end
      envs.refundedAddress, // refundee
    ];
    const incentiveIdEncoded = ethers.utils.defaultAbiCoder.encode(
      ['tuple(address,address,uint256,uint256,address)'],
      [incentives],
    );
    return ethers.utils.keccak256(incentiveIdEncoded);
  });
};

export default getIncentiveId;
