import { BigNumber } from "ethers"
import moment from "moment"

type RoundData = {
	accountReward: BigNumber,
	accountPrincipal: BigNumber,
	totalPrincipal: BigNumber,
	apr: BigNumber,
	loadedAt: moment.Moment,
	startedAt: moment.Moment,
	endedAt: moment.Moment,
}

export default RoundData