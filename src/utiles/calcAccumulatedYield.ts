import { BigNumber, constants } from "ethers";
import { GetUser_user_lTokenBurn, GetUser_user_lTokenMint } from "src/queries/__generated__/GetUser";
import { RAY } from "./math";

const calcAccumulatedYield = (
	currentIndex: BigNumber,
	mints: GetUser_user_lTokenMint[],
	burns: GetUser_user_lTokenBurn[]
): BigNumber => {
	const mintYield = mints
		.reduce((res, cur) => res.add(BigNumber.from(cur.amount).mul(currentIndex.sub(BigNumber.from(cur.index)))), constants.Zero)
		.div(RAY)

	const burnYield = burns
		.reduce((res, cur) => res.add(BigNumber.from(cur.amount).mul(currentIndex.sub(BigNumber.from(cur.index)))), constants.Zero)
		.div(RAY)

	return mintYield.sub(burnYield)
}

export default calcAccumulatedYield;