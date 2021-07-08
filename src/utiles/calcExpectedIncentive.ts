import { BigNumber, constants, utils } from "ethers";
import { RAY } from './math'
import moment from 'moment';
import { ELFI_PRICE } from "./calcMiningAPR";

const calcExpectedIncentive = (
	totalDeposit: BigNumber,
	miningAPR: BigNumber,
	lastUpdateTimestamp: number,
): BigNumber => {
	if (totalDeposit.isZero()) {
		return constants.Zero;
	}

	return totalDeposit.mul(miningAPR)
		.mul((moment().unix() - lastUpdateTimestamp))
		.div(3600 * 24 * 356)
		.div(RAY)
		.mul(utils.parseEther('1'))
		.div(utils.parseEther(ELFI_PRICE.toString()))
}

export default calcExpectedIncentive;