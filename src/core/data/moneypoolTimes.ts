import moment from 'moment';

export const moneyPoolStartedAt = moment(
  '2021.07.15 10:42:33 +0',
  'YYYY.MM.DD hh:mm:ss Z',
);

export const tetherMoneyPoolStartedAt = moment(
  '2021.10.08 19:00:00 +9:00',
  'YYYY.MM.DD hh:mm:ss Z',
);
export const usdcMoneyPoolStartedAt = moment(
  '2022.06.13 19:00:00 +9:00',
  'YYYY.MM.DD hh:mm:ss Z',
);

export const moneyPoolEndedAt = moment(moneyPoolStartedAt).add(180, 'd');

export const tetherMoneyPoolEndedAt = moment(
  '2022.01.11 19:37:43 +9:00',
  'YYYY.MM.DD hh:mm:ss Z',
);

export const busdMoneypoolStartedAt = moment(
  '2022.01.20 19:00:00 +9:00',
  'YYYY.MM.DD hh:mm:ss Z',
);
export const usdcMoneypoolStartedAt = moment(
  '2022.01.20 19:00:00 +9:00',
  'YYYY.MM.DD hh:mm:ss Z',
);

export const busdMoneypoolEndedAt = moment(
  '2022.08.20 20:00:00 +9:00',
  'YYYY.MM.DD hh:mm:ss Z',
);
export const daiMoneyPoolTime = [
  {
    startedAt: moneyPoolStartedAt,
    endedAt: moment('2022.01.11 18:24:14 +0', 'YYYY.MM.DD hh:mm:ss Z'),
  },
  {
    startedAt: moment('2022.01.11 18:00:00 +9:00', 'YYYY.MM.DD hh:mm:ss Z'),
    endedAt: moment('2022.08.20 20:00:00 +9:00', 'YYYY.MM.DD hh:mm:ss Z'),
  },
];

export const tetherMoneyPoolTime = [
  {
    startedAt: tetherMoneyPoolStartedAt,
    endedAt: tetherMoneyPoolEndedAt,
  },
  {
    startedAt: moment('2022.01.11 18:00:00 +9:00', 'YYYY.MM.DD hh:mm:ss Z'),
    endedAt: moment('2022.08.20 20:00:00 +9:00', 'YYYY.MM.DD hh:mm:ss Z'),
  },
];
export const busdMoneyPoolTime = [
  {
    startedAt: busdMoneypoolStartedAt,
    endedAt: busdMoneypoolEndedAt,
  },
  {
    startedAt: moment('2022.01.20 18:00:00 +9:00', 'YYYY.MM.DD hh:mm:ss Z'),
    endedAt: moment('2022.08.20 20:00:00 +9:00', 'YYYY.MM.DD hh:mm:ss Z'),
  },
];

export const usdcMoneyPoolTime = [
  {
    startedAt: moment('2022.06.13 19:00:00 +9:00', 'YYYY.MM.DD hh:mm:ss Z'),
    endedAt: moment('2022.08.20 20:00:00 +9:00', 'YYYY.MM.DD hh:mm:ss Z'),
  },
];
