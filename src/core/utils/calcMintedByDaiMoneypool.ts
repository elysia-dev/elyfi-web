import moment from 'moment';
import {
  moneyPoolStartedAt,
  tetherMoneyPoolStartedAt,
} from 'src/core/data/moneypoolTimes';

const daiDepositRewardPerSecond = (3000000 * 2) / (365 * 24 * 3600);

export const calcMintedByDaiMoneypool = (): number => {
  const current = moment();

  return (
    current.diff(moneyPoolStartedAt, 'seconds') * daiDepositRewardPerSecond
  );
};

const tetherDepositRewardPerSecond = (1583333 * (365 / 95)) / (365 * 24 * 3600);

export const calcMintedByTetherMoneypool = (): number => {
  const current = moment();

  return (
    current.diff(tetherMoneyPoolStartedAt, 'seconds') *
    tetherDepositRewardPerSecond
  );
};
