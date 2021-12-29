import moment from 'moment';

export const moneyPoolStartedAt = moment(
  '2021.07.15 10:42:33 +0',
  'YYYY.MM.DD hh:mm:ss Z',
);

export const tetherMoneyPoolStartedAt = moment(
  '2021.10.08 19:00:00 +9:00',
  'YYYY.MM.DD hh:mm:ss Z',
);

export const moneyPoolEndedAt = moment(moneyPoolStartedAt).add(180, 'd');

export const tetherMoneyPoolEndedAt = moment(
  '2022.01.11 19:00:00 +9:00',
  'YYYY.MM.DD hh:mm:ss Z',
);

export const daiMoneyPoolTime = [
  {
    startedAt: moment('2021.07.15 10:42:33 +0', 'YYYY.MM.DD hh:mm:ss Z'),
    endedAt: moneyPoolEndedAt,
  },
  {
    startedAt: moment('2022.01.11 19:00:00 +9:00', 'YYYY.MM.DD hh:mm:ss Z'),
    endedAt: '',
  },
];

export const tetherMoneyPoolTime = [
  {
    startedAt: tetherMoneyPoolStartedAt,
    endedAt: tetherMoneyPoolEndedAt,
  },
  {
    startedAt: moment('2022.01.11 19:00:00 +9:00', 'YYYY.MM.DD hh:mm:ss Z'),
    endedAt: '',
  },
];
