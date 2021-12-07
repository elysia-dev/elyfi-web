import { ethers } from 'ethers';
import envs from 'src/core/envs';

const getIncentiveId = (round: number): string[] => {
  const poolAddress = [envs.daiElfiPoolAddress, envs.ethElfiPoolAddress];

  return poolAddress.map((address) => {
    const incentives = [
      envs.governanceAddress, // rewardToken
      address, // pool
      envs.lpTokenStakingStartTime, // start
      envs.lpTokenStakingEndTime, // end
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
