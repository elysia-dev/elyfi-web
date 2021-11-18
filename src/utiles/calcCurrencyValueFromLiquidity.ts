import { BigNumber, utils } from 'ethers';

function calcCurrencyValueFromLiquidity(
  token0Price: number,
  token1Price: number,
  liquidity: BigNumber,
): number {
  return (
    (token0Price + token1Price) *
    Math.sqrt(parseFloat(utils.formatUnits(liquidity, 18)))
  );
}

export default calcCurrencyValueFromLiquidity;
