import { renderHook } from '@testing-library/react-hooks';
import '@testing-library/jest-dom';
import { utils } from 'ethers';
import moment from 'moment';
import calcMintedAmounts from 'src/core/utils/calcMintedAmounts';
import { rewardPerDayByToken } from 'src/utiles/stakingReward';
import { roundTimes } from 'src/core/data/stakingRoundTimes';
import MainnetType from 'src/enums/MainnetType';
import useCalcReward from './useCalcReward';

describe('Reward hooks', () => {
  test('LPstaking total reward for each round', () => {
    const { result } = renderHook(() => useCalcReward('LP'));

    expect(result.current.state.ethRewardByLp[0]).toEqual(5.507);
    expect(result.current.state.ethRewardByLp[1]).toEqual(6.437);
    expect(result.current.state.ethRewardByLp[2]).toEqual(10.203);
    expect(result.current.state.ethRewardByLp[3]).toEqual(
      (moment().diff(
        moment('2022.03.08 19:00:00 +9:00', 'YYYY.MM.DD hh:mm:ss Z'),
        'seconds',
      ) *
        (9.855 / 40)) /
        (24 * 3600),
    );

    expect(result.current.state.daiRewardByLp[0]).toEqual(25000);
    expect(result.current.state.daiRewardByLp[1]).toEqual(25000);
    expect(result.current.state.daiRewardByLp[2]).toEqual(25000);
    expect(result.current.state.daiRewardByLp[3]).toEqual(
      (moment().diff(
        moment('2022.03.08 19:00:00 +9:00', 'YYYY.MM.DD hh:mm:ss Z'),
        'seconds',
      ) *
        (25000 / 40)) /
        (24 * 3600),
    );
  });

  test('Deposit total reward for each round', () => {
    const { result } = renderHook(() => useCalcReward(''));
    const current = moment();

    expect(result.current.state.mintedByDaiMoneypool).toEqual(
      current.diff(
        moment('2021.07.15 10:42:33 +0', 'YYYY.MM.DD hh:mm:ss Z'),
        'seconds',
      ) *
        ((3000000 * 2) / (365 * 24 * 3600)),
    );
    expect(result.current.state.mintedByTetherMoneypool).toEqual(
      current.diff(
        moment('2021.10.08 19:00:00 +9:00', 'YYYY.MM.DD hh:mm:ss Z'),
        'seconds',
      ) *
        ((1583333 * (365 / 95)) / (365 * 24 * 3600)),
    );
    expect(result.current.state.mintedByBusdMoneypool).toEqual(
      current.diff(
        moment('2022.01.20 19:00:00 +9:00', 'YYYY.MM.DD hh:mm:ss Z'),
        'seconds',
      ) *
        ((3000000 * 2) / (365 * 24 * 3600)) +
        50000 * 7,
    );
  });

  test('ELFI Staking total reward for each round', () => {
    const { result } = renderHook(() => useCalcReward('ELFI'));
    const current = moment();

    expect(result.current.state.afterStakingPool).toEqual(
      calcMintedAmounts(
        parseFloat(
          utils.formatEther(rewardPerDayByToken('ELFI', MainnetType.Ethereum)),
        ),
        roundTimes('ELFI', MainnetType.Ethereum),
      ),
    );
  });
  test('EL Staking total reward for each round', () => {
    const { result } = renderHook(() => useCalcReward('EL'));
    const current = moment();

    expect(result.current.state.afterStakingPool).toEqual(
      calcMintedAmounts(
        parseFloat(
          utils.formatEther(rewardPerDayByToken('EL', MainnetType.Ethereum)),
        ),
        roundTimes('ELFI', MainnetType.Ethereum),
      ),
    );
  });
});
