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
    startedAt: moment('2022.01.25 19:00:00 +9:00', 'YYYY.MM.DD hh:mm:ss Z'),
    endedAt: moment('2022.03.05 19:00:00 +9:00', 'YYYY.MM.DD hh:mm:ss Z'),
  },
];

export const lpUnixTimestamp = [
  {
    startedAt: 1638880500,
    endedAt: 1640950200,
  },
  {
    startedAt: 1638880800,
    endedAt: 1640950200,
  },
];

const lpStakingTime: IStakingPool = {
  startedAt: moment('2021.11.05 19:00:00 +9:00', format).tz('Asia/Seoul', true),
  endedAt: moment('2021.12.15 19:00:00 +9:00', format).tz('Asia/Seoul', true),
};

export default lpStakingTime;
