import { BigNumber } from "ethers"
import moment from "moment"

type RoundData = {
	id?: number,
	loading: boolean,
	error: string,
	accountReward: BigNumber,
	accountPrincipal: BigNumber,
	totalPrincipal: BigNumber,
	apr: BigNumber,
	loadedAt: moment.Moment,
	startedAt: moment.Moment,
	endedAt: moment.Moment,
}

export default RoundData