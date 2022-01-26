import moment from 'moment';
import stakingRoundTimes from 'src/core/data/stakingRoundTimes';

const calcMintedAmounts = (mintedPerDay: number): Array<number> => {
  const current = moment();
  return stakingRoundTimes.map((round) => {
    if (current.diff(round.endedAt) > 0) {
      return round.endedAt.diff(round.startedAt, 'days') * mintedPerDay;
    }

    return current.diff(round.startedAt) < 0
      ? 0
      : (current.diff(round.startedAt, 'seconds') * mintedPerDay) / (3600 * 24);
  });
};

export default calcMintedAmounts;
