import Token from 'src/enums/Token';
import envs from 'src/core/envs';

const getIncentivePoolAddress = (round: number, token: Token): string => {
  switch (token) {
    case Token.DAI:
      return round === 1
        ? envs.moneyPool.prevDaiIncentivePool
        : envs.moneyPool.currentDaiIncentivePool;
    case Token.USDT:
      return round === 1
        ? envs.moneyPool.prevUSDTIncentivePool
        : envs.moneyPool.currentUSDTIncentivePool;
    case Token.BUSD:
      return envs.moneyPool.busdIncentivePoolAddress;
    default:
      return envs.moneyPool.prevDaiIncentivePool;
  }
};

export default getIncentivePoolAddress;
