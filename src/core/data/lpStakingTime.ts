import moment from 'moment';
import 'moment-timezone';

interface IStakingPool {
  startedAt: moment.Moment;
  endedAt: moment.Moment;
}

const format = 'YYYY.MM.DD hh:mm:ss Z';

export const lpRoundDate = [
  {
    startedAt: moment('2021.11.05 19:00:00 +9:00', 'YYYY.MM.DD hh:mm:ss Z'),
    endedAt: moment('2021.12.15 19:00:00 +9:00', 'YYYY.MM.DD hh:mm:ss Z'),
  },
  {
    startedAt: moment('2021.12.16 19:00:00 +9:00', 'YYYY.MM.DD hh:mm:ss Z'),
    endedAt: moment('2022.01.24 19:00:00 +9:00', 'YYYY.MM.DD hh:mm:ss Z'),
  },
  {
    startedAt: moment('2022.01.26 19:00:00 +9:00', 'YYYY.MM.DD hh:mm:ss Z'),
    endedAt: moment('2022.03.07 19:00:00 +9:00', 'YYYY.MM.DD hh:mm:ss Z'),
  },
  {
    startedAt: moment('2022.03.08 19:00:00 +9:00', 'YYYY.MM.DD hh:mm:ss Z'),
    endedAt: moment('2022.04.17 19:00:00 +9:00', 'YYYY.MM.DD hh:mm:ss Z'),
  },
];

export const lpUnixTimestamp = lpRoundDate.map((item) => {
  return { startedAt: item.startedAt.unix(), endedAt: item.endedAt.unix() };
});

const lpStakingTime: IStakingPool = {
  startedAt: moment('2021.11.05 19:00:00 +9:00', format).tz('Asia/Seoul', true),
  endedAt: moment('2021.12.15 19:00:00 +9:00', format).tz('Asia/Seoul', true),
};

export default lpStakingTime;

export const lpStakingStartedAt = moment(
  '2021.11.05 19:00:00 +9:00',
  'YYYY.MM.DD hh:mm:ss Z',
);

export const lpStakingEndedAt = moment(
  '2021.12.15 19:00:00 +9:00',
  'YYYY.MM.DD hh:mm:ss Z',
);
