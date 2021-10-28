import { BigNumber } from 'ethers';
import moment from 'moment';
import RoundData from '../types/RoundData';

const calcExpectedReward = (
  round: RoundData,
  minedPerDay: BigNumber,
): BigNumber => {
  const current = moment();

  if (
    round.totalPrincipal.isZero() ||
    round.accountPrincipal.isZero() ||
    current.diff(round.startedAt) < 0 ||
    current.diff(round.endedAt) > 0
  ) {
    return round.accountReward;
  }

  return round.accountReward.add(
    minedPerDay
      .div(24 * 3600)
      .mul(round.accountPrincipal)
      .div(round.totalPrincipal)
      .mul(current.diff(round.loadedAt, 'seconds')),
  );
};

export default calcExpectedReward;
