import { BigNumber, utils, constants } from "ethers";

const ELFI_MINING_AMOUNT_PER_YEAR = 3000000 * 2;

const calcMiningAPR = (mintPrice: number, totalDeposit: BigNumber): BigNumber => {
	if (totalDeposit.isZero()) {
		return constants.Zero;
	}

	return utils.parseUnits(
		(
			(
				(mintPrice * ELFI_MINING_AMOUNT_PER_YEAR) /
				(parseFloat(utils.formatEther(totalDeposit)))
			) * 100
		).toString(),
		25
	)
}

export default calcMiningAPR;