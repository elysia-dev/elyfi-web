import moment from 'moment';
import 'moment-timezone';

interface IStakingPoolRound {
	startedAt: moment.Moment
	endedAt: moment.Moment
}

const format = 'YYYY.MM.DD hh:mm:ss Z';

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
		endedAt: '2021.10.15 19:00:00 +9:00',
	},
	{
		startedAt: '2021.10.25 19:00:00 +9:00',
		endedAt: '2021.11.14 19:00:00 +9:00',
	},
	{
		startedAt: '2021.11.24 19:00:00 +9:00',
		endedAt: '2021.12.14 19:00:00 +9:00',
	},
	{
		startedAt: '2021.12.24 19:00:00 +9:00',
		endedAt: '2022.1.13 19:00:00 +9:00',
	},
].map((item) => {
	return {
		startedAt: moment(item.startedAt, format).tz('Asia/Seoul', true),
		endedAt: moment(item.endedAt, format).tz('Asia/Seoul', true)
	}
})

export default stakingRoundTimes