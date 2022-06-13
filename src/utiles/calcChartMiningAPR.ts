import { BigNumber, utils, constants } from 'ethers';
import moment from 'moment';

const calcChartMiningAPR = (
  mintPrice: number,
  totalDeposit: BigNumber,
  date: number,
  allocation: number,
  decimals?: number,
): BigNumber => {
  if (totalDeposit.isZero()) {
    return constants.Zero;
  }
  let amountPerYear;

  if (moment(date).isBefore(1655114400)) {
    amountPerYear = 3000000 * 2;
  } else {
    amountPerYear = allocation * 365;
  }

  return utils.parseUnits(
    (
      ((mintPrice * amountPerYear) /
        parseFloat(utils.formatUnits(totalDeposit, decimals || '18'))) *
      100
    ).toLocaleString('fullwide', { useGrouping: false }),
    25,
  );
};

export default calcChartMiningAPR;
