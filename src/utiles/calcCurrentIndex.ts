import { BigNumber } from "ethers";
import moment from 'moment';
import { RAY, rayMul } from "./math";

const calcCurrentIndex = (
	lastIndex: BigNumber,
	lastTimestamp: number,
	rate: BigNumber,
): BigNumber => {
	return rayMul(
		BigNumber.from(moment().unix() - lastTimestamp)
			.mul(rate)
			.div(365 * 24 * 3600)
			.add(RAY),
		lastIndex
	);
}

export default calcCurrentIndex;