import moment from 'moment';
import {
  moneyPoolStartedAt,
  tetherMoneyPoolStartedAt,
  tetherMoneyPoolEndedAt,
  busdMoneypoolStartedAt,
  busdMoneypoolEndedAt,
} from 'src/core/data/moneypoolTimes';
import Token from 'src/enums/Token';

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

const busdDepositRewardPerSecond = (3000000 * 2) / (365 * 24 * 3600);

export const calcMintedByBusdMoneypool = (): number => {
  const current = moment();

  return current.diff(busdMoneypoolEndedAt) <= 0
    ? current.diff(busdMoneypoolStartedAt, 'seconds') *
        busdDepositRewardPerSecond +
        50000 * 7
    : 1583333;
};
