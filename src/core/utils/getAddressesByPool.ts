import envs from 'src/core/envs';
import Position from '../types/Position';

export const isEthElfiPoolAddress = (position: Position): boolean => {
  return (
    position.incentivePotisions[0].incentive.pool.toLowerCase() ===
    envs.ethElfiPoolAddress.toLowerCase()
  );
};

const getAddressesByPool = (
  position: Position,
): {
  poolAddress: string;
  rewardTokenAddress: string;
} => {
  const poolAddress = isEthElfiPoolAddress(position)
    ? envs.ethElfiPoolAddress
    : envs.daiElfiPoolAddress;
  const rewardTokenAddress = isEthElfiPoolAddress(position)
    ? envs.wEthAddress
    : envs.daiAddress;

  return { poolAddress, rewardTokenAddress };
};

export default getAddressesByPool;
