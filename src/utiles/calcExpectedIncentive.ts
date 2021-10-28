import { BigNumber, constants, utils } from 'ethers';
import moment from 'moment';
import { RAY } from './math';

const calcExpectedIncentive = (
  elfiPrice: number,
  totalDeposit: BigNumber,
  miningAPR: BigNumber,
  lastUpdateTimestamp: number,
): BigNumber => {
  if (totalDeposit.isZero() || !elfiPrice) {
    return constants.Zero;
  }

  return totalDeposit
    .mul(miningAPR)
    .mul(moment().unix() - lastUpdateTimestamp)
    .div(3600 * 24 * 356)
    .div(RAY)
    .mul(utils.parseEther('1'))
    .div(utils.parseEther(elfiPrice.toString()));
};

export default calcExpectedIncentive;
