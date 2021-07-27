import { BigNumber, constants, utils } from "ethers"

/*
	return APR 10^25
*/
const calcAPR = (
	staked: BigNumber,
	stakedPrice: number,
	mintedPerDay: BigNumber,
	mintedPrice: number,
): BigNumber => {
	if (staked.isZero() || stakedPrice === 0) {
		// APR is infinite
		return constants.MaxUint256;
	}

	return mintedPerDay
		.mul(365)
		.mul(utils.parseEther(mintedPrice.toFixed(4)))
		.mul(utils.parseUnits('1', 27))
		.div(
			staked.mul(utils.parseEther(stakedPrice.toFixed(4)))
		);
}

export default calcAPR;