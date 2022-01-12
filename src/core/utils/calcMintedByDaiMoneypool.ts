import moment from 'moment';
import {
  moneyPoolEndedAt,
  moneyPoolStartedAt,
  tetherMoneyPoolStartedAt,
  tetherMoneyPoolEndedAt,
  busdMoneypoolStartedAt,
  busdMoneypoolEndedAt
} from 'src/core/data/moneypoolTimes';

const daiDepositRewardPerSecond = (3000000 * 2) / (365 * 24 * 3600);

export const calcMintedByDaiMoneypool = (): number => {
  const current = moment();

  return current.diff(moneyPoolEndedAt) <= 0
    ? current.diff(moneyPoolStartedAt, 'seconds') * daiDepositRewardPerSecond
    : 3000000;
};

const tetherDepositRewardPerSecond = (1583333 * (365 / 95)) / (365 * 24 * 3600);

export const calcMintedByTetherMoneypool = (): number => {
  const current = moment();

  return current.diff(tetherMoneyPoolEndedAt) <= 0
    ? current.diff(tetherMoneyPoolStartedAt, 'seconds') *
        tetherDepositRewardPerSecond
    : 1583333;
};

const busdDepositRewardPerSecond = (3000000 * 2) / (365 * 24 * 3600);

export const calcMintedByBusdMoneypool = (): number => {
  const current = moment();

  return current.diff(busdMoneypoolEndedAt) <= 0
    ? current.diff(busdMoneypoolStartedAt, 'seconds') *
        busdDepositRewardPerSecond
    : 1583333;
};
