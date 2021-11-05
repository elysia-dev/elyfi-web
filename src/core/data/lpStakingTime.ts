import moment from 'moment';
import 'moment-timezone';

interface IStakingPool {
  startedAt: moment.Moment;
  endedAt: moment.Moment;
}

const format = 'YYYY.MM.DD hh:mm:ss Z';

const lpStakingTime: IStakingPool = {
  startedAt: moment('2021.11.01 19:00:00 +9:00', format).tz('Asia/Seoul', true),
  endedAt: moment('2021.12.15 19:00:00 +9:00', format).tz('Asia/Seoul', true),
};

export default lpStakingTime;
