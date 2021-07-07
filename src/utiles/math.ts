import { BigNumber, constants, utils } from "ethers";

export const WAD = utils.parseUnits('1', 18)

export const haldWAD = WAD.div(2)

export const RAY = utils.parseUnits('1', 27)

export const halfRAY = RAY.div(2)

export function rayMul(a: BigNumber, b: BigNumber): BigNumber {
	if (a.isZero() || b.isZero()) {
		return constants.Zero;
	}

	return (a.mul(b).add(halfRAY)).div(RAY);
}

export function rayDiv(a: BigNumber, b: BigNumber): BigNumber {
	if (b.isZero()) {
		throw new Error("Division by Zero");
	}

	return (a.mul(RAY).add((b.div(2)))).div(b)
}