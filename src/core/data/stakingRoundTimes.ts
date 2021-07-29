import moment from 'moment';

interface IStakingPoolRound {
	startedAt: moment.Moment
	endedAt: moment.Moment
}

const format = 'YYYY.MM.DD hh:mm:ss Z';

const stakingRoundTimes: IStakingPoolRound[] = [
	{
		startedAt: moment('2021.7.27 19:00:00 +9:00', format),
		endedAt: moment('2021.8.16 19:00:00 +9:00', format),
	},
	{
		startedAt: moment('2021.8.26 19:00:00 +9:00', format),
		endedAt: moment('2021.9.15 19:00:00 +9:00', format),
	},
	{
		startedAt: moment('2021.9.25 19:00:00 +9:00', format),
		endedAt: moment('2021.10.15 19:00:00 +9:00', format),
	},
	{
		startedAt: moment('2021.10.25 19:00:00 +9:00', format),
		endedAt: moment('2021.11.14 19:00:00 +9:00', format),
	},
	{
		startedAt: moment('2021.11.24 19:00:00 +9:00', format),
		endedAt: moment('2021.12.14 19:00:00 +9:00', format),
	},
	{
		startedAt: moment('2021.12.24 19:00:00 +9:00', format),
		endedAt: moment('2022.1.13 19:00:00 +9:00', format),
	},
]

export default stakingRoundTimes