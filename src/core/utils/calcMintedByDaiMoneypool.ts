import moment from 'moment';
import {
  moneyPoolEndedAt,
  moneyPoolStartedAt,
  tetherMoneyPoolStartedAt,
  tetherMoneyPoolEndedAt,
  daiMoneyPoolTime,
  tetherMoneyPoolTime,
} from 'src/core/data/moneypoolTimes';

const daiDepositRewardPerSecond = (3000000 * 2) / (365 * 24 * 3600);

export const calcMintedByDaiMoneypool = (): number[] => {
  const current = moment();

  return daiMoneyPoolTime.map((date) => {
    if (current.isBefore(date.startedAt)) {
      return 0;
    }
    if (current.isAfter(date.endedAt)) {
      return 3000000;
    }
    return current.diff(date.startedAt, 'seconds') * daiDepositRewardPerSecond;
  });

  // return current.diff(moneyPoolEndedAt) <= 0
  //   ? current.diff(moneyPoolStartedAt, 'seconds') * daiDepositRewardPerSecond
  //   : 3000000;
};

const tetherDepositRewardPerSecond = (1583333 * (365 / 95)) / (365 * 24 * 3600);

export const calcMintedByTetherMoneypool = (): number[] => {
  const current = moment();

  return tetherMoneyPoolTime.map((date) => {
    if (current.isBefore(date.startedAt)) {
      return 0;
    }
    if (current.isAfter(date.endedAt)) {
      return 3000000;
    }
    return (
      current.diff(date.startedAt, 'seconds') * tetherDepositRewardPerSecond
    );
  });

  // return current.diff(tetherMoneyPoolEndedAt) <= 0
  //   ? current.diff(tetherMoneyPoolStartedAt, 'seconds') *
  //       tetherDepositRewardPerSecond
  //   : 1583333;
};
