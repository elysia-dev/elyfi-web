import Token from 'src/enums/Token';
import envs from 'src/core/envs';

const getIncentivePoolAddress = (round: number, token: Token): string => {
  switch (token) {
    case Token.DAI:
      return round === 1
        ? envs.incentivePool.prevDaiIncentivePool
        : envs.incentivePool.currentDaiIncentivePool;
    case Token.USDT:
      return round === 1
        ? envs.incentivePool.prevUSDTIncentivePool
        : envs.incentivePool.currentUSDTIncentivePool;
    case Token.BUSD:
      return envs.incentivePool.busdIncentivePoolAddress;
    default:
      return envs.incentivePool.prevDaiIncentivePool;
  }
};

export default getIncentivePoolAddress;
