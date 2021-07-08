import { GetAllAssetBonds_assetBondTokens } from "src/queries/__generated__/GetAllAssetBonds"
import { parseTokenId } from "./parseTokenId"

const calcPortfolioRatio = (
	abTokens: GetAllAssetBonds_assetBondTokens[],
	productNumber: number
): number => {
	if (abTokens.length === 0) {
		return 33;
	}

	return abTokens.reduce((sum, cur) => {
		const { productNumber: pn } = parseTokenId(cur.id);
		if (pn === productNumber) {
			return sum + 1
		} else {
			return sum;
		}
	}, 0) * 100 / abTokens.length;
}

export default calcPortfolioRatio