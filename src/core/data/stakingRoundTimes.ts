import moment from 'moment';
import 'moment-timezone';
import MainnetType from 'src/enums/MainnetType';
import Token from 'src/enums/Token';

export interface IStakingPoolRound {
  startedAt: moment.Moment;
  endedAt: moment.Moment;
}

const format = 'YYYY.MM.DD hh:mm:ss Z';

export const busdStakingRoundTimes: IStakingPoolRound[] = [
  {
    startedAt: '2022.02.25 19:00:00 +9:00',
    endedAt: '2022.03.04 19:00:00 +9:00',
  },
  {
    startedAt: '2022.03.05 19:00:00 +9:00',
    endedAt: '2022.03.06 19:00:00 +9:00',
  },
  {
    startedAt: '2022.03.06 19:00:00 +9:00',
    endedAt: '2022.03.07 19:00:00 +9:00',
  },
  {
    startedAt: '2022.03.07 19:00:00 +9:00',
    endedAt: '2022.05.28 19:00:00 +9:00',
  },
].map((item) => {
  return {
    startedAt: moment(item.startedAt, format).tz('Asia/Seoul', true),
    endedAt: moment(item.endedAt, format).tz('Asia/Seoul', true),
  };
});

const stakingRoundTimes: IStakingPoolRound[] = [
  {
    startedAt: '2021.7.27 19:00:00 +9:00',
    endedAt: '2021.8.16 19:00:00 +9:00',
  },
  {
    startedAt: '2021.8.26 19:00:00 +9:00',
    endedAt: '2021.9.15 19:00:00 +9:00',
  },
  {
    startedAt: '2021.9.25 19:00:00 +9:00',
    endedAt: '2021.11.04 19:00:00 +9:00',
  },
  {
    startedAt: '2021.11.05 19:00:00 +9:00',
    endedAt: '2021.12.15 19:00:00 +9:00',
  },
  {
    startedAt: '2021.12.16 19:00:00 +9:00',
    endedAt: '2022.01.25 19:00:00 +9:00',
  },
  {
    startedAt: '2022.01.26 19:00:00 +9:00',
    endedAt: '2022.03.07 19:00:00 +9:00',
  },
  {
    startedAt: '2022.03.07 19:00:00 +9:00',
    endedAt: '2022.04.17 19:00:00 +9:00',
  },
  // {
  //   startedAt: '2022.04.18 19:00:00 +9:00',
  //   endedAt: '2022.05.27 19:00:00 +9:00',
  // },
].map((item) => {
  return {
    startedAt: moment(item.startedAt, format).tz('Asia/Seoul', true),
    endedAt: moment(item.endedAt, format).tz('Asia/Seoul', true),
  };
});

export const roundTimes = (
  stakedToken: string,
  mainnet: string,
): IStakingPoolRound[] => {
  return stakedToken === Token.ELFI && mainnet === MainnetType.BSC
    ? busdStakingRoundTimes
    : stakingRoundTimes;
};

export default stakingRoundTimes;
