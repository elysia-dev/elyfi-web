import { BigNumber, utils } from 'ethers';

// sqrtPriceX96, https://docs.uniswap.org/sdk/guides/fetching-prices#understanding-sqrtprice
// sqrtPriceX96 = sqrtPrice * 2 ** 96 ~= sqrtPrice * 7.92 * 10^28
const calcPriceFromSqrtPriceX96 = (
	sqrtPrice: BigNumber,
): number => {
	return Math.sqrt(parseFloat(utils.formatUnits(sqrtPrice, 28)) / 7.92);
};

export default calcPriceFromSqrtPriceX96;
