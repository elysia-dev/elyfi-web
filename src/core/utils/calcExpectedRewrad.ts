import { BigNumber, constants } from "ethers"
import moment from "moment";
import RoundData from "../types/RoundData";

const calcExpectedRewrad = (
	round: RoundData,
	mintedPerDay: BigNumber,
): BigNumber => {
	if (round.totalPrincipal.isZero()) return constants.Zero;

	const current = moment();

	if (current.diff(round.startedAt) < 0 || current.diff(round.endedAt) > 0) {
		return round.accountReward;
	}

	return round.accountReward.add(
		mintedPerDay
			.div(24 * 3600)
			.mul(round.accountPrincipal)
			.div(round.totalPrincipal)
			.mul(current.diff(round.loadedAt, 'seconds'))
	)
}

export default calcExpectedRewrad;