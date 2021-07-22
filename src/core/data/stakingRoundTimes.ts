import moment from 'moment';

interface IStakingPoolRound {
	startedAt: moment.Moment
	endedAt: moment.Moment
}

const stakingRoundTimes: IStakingPoolRound[] = [
	{
		startedAt: moment('2021.7.21 19:00:00 +9:00'),
		endedAt: moment('2021.8.10 18:59:59 +9:00'),
	},
	{
		startedAt: moment('2021.8.20 19:00:00 +9:00'),
		endedAt: moment('2021.9.9 18:59:59 +9:00'),
	},
	{
		startedAt: moment('2021.9.19 19:00:00 +9:00'),
		endedAt: moment('2021.10.9 18:59:59 +9:00'),
	},
	{
		startedAt: moment('2021.10.19 19:00:00 +9:00'),
		endedAt: moment('2021.11.8 18:59:59 +9:00'),
	},
	{
		startedAt: moment('2021.11.18 19:00:00 +9:00'),
		endedAt: moment('2021.12.8 18:59:59 +9:00'),
	},
	{
		startedAt: moment('2021.12.18 19:00:00 +9:00'),
		endedAt: moment('2022.01.7 18:59:59 +9:00'),
	},
]

export default stakingRoundTimes