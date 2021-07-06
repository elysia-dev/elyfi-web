import { BigNumber, constants } from "ethers";
import { GetUser_user_lTokenBurn, GetUser_user_lTokenMint } from "src/queries/__generated__/GetUser";

const calcAccumulatedYield = (
	currentIndex: BigNumber,
	mints: GetUser_user_lTokenMint[],
	burns: GetUser_user_lTokenBurn[]
): BigNumber => {
	return mints
		.reduce((res, cur) => res.add(BigNumber.from(cur.amount).mul(currentIndex.sub(BigNumber.from(cur.index)))), constants.Zero)
		.sub(
			burns.reduce((res, cur) => res.add(BigNumber.from(cur.amount)).mul(currentIndex.sub(BigNumber.from(cur.index))), constants.Zero)
		);
}

export default calcAccumulatedYield;