import { render, screen } from '@testing-library/react';
import stakingRoundTimes from 'src/core/data/stakingRoundTimes';
import StakingEnded from './StakingEnded';

jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (str: string): string => str,
      i18n: {
        language: 'ko',
      },
    };
  },
}));

describe('StakingEnded', () => {
  test('confirm staking date', () => {
    render(
      <StakingEnded
        visible={true}
        round={7}
        onClose={() => {}}
        stakingRoundDate={stakingRoundTimes}
      />,
    );

    expect(screen.getByText('2022.03.08 19:00:00').textContent).toEqual(
      '2022.03.08 19:00:00',
    );
    expect(screen.getByText('2022.04.17 19:00:00 (KST)').textContent).toEqual(
      '2022.04.17 19:00:00 (KST)',
    );
  });
});
