import moment from 'moment';
import 'moment-timezone';

interface IStakingPool {
  startedAt: moment.Moment;
  endedAt: moment.Moment;
}

const format = 'YYYY.MM.DD hh:mm:ss Z';

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
