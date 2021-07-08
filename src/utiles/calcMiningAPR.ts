import { BigNumber, utils, constants } from "ethers";

// FIXME : load the price from uniswap LP pool;
export const ELFI_PRICE = 0.1; // USD
const ELFI_MINING_AMOUNT_PER_YEAR = 3000000 * 2;

const calcMiningAPR = (totalDeposit: BigNumber): BigNumber => {
	if (totalDeposit.isZero()) {
		return constants.Zero;
	}

	return utils.parseUnits(
		(
			(
				(ELFI_PRICE * ELFI_MINING_AMOUNT_PER_YEAR) /
				(parseFloat(utils.formatEther(totalDeposit)))
			) * 100
		).toString(),
		25
	)
}

export default calcMiningAPR;