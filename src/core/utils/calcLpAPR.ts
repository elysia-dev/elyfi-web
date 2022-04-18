import { BigNumber, constants, utils } from 'ethers';

/*
	return APR 10^25
*/
const calcLpAPR = (
  rewardPerSecond: BigNumber,
  totalPrincipal: BigNumber,
  stakedPrice: number,
  minedPerDay: BigNumber,
  minedPrice: BigNumber,
): BigNumber => {
  if (totalPrincipal.isZero() || stakedPrice === 0) {
    // APR is infinite
    return constants.MaxUint256;
  }

  return rewardPerSecond
    .div(totalPrincipal)
    .mul(utils.parseEther(stakedPrice.toFixed(4)))
    .mul(utils.parseEther('31536000'))
    .mul(utils.parseEther('100'));

  // return minedPerDay
  //   .mul(365)
  //   .mul(utils.parseEther(minedPrice.toFixed(4)))
  //   .mul(utils.parseUnits('1', 27))
  //   .div(staked.mul(utils.parseEther(stakedPrice.toFixed(4))));
};

export default calcLpAPR;
