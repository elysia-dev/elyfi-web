import envs from 'src/core/envs';
import Position from '../types/Position';

export const isEthElfiPoolAddress = (position: Position) => {
  return (
    position.incentivePotisions[0].incentive.pool.toLowerCase() ===
    envs.ethElfiPoolAddress.toLowerCase()
  );
};

const getAddressesByPool = (position: Position) => {
  const poolAddress = isEthElfiPoolAddress(position)
    ? envs.ethElfiPoolAddress
    : envs.daiElfiPoolAddress;
  const rewardTokenAddress = isEthElfiPoolAddress(position)
    ? envs.wEthAddress
    : envs.daiAddress;

  return { poolAddress, rewardTokenAddress };
};

export default getAddressesByPool;
