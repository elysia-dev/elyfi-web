import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import stakingRoundTimes from 'src/core/data/stakingRoundTimes';

type Props = {
  nth: string;
  staking: number;
  unit: string;
  end: number;
  currentPhase?: number;
  OrdinalNumberConverter?: (value: number) => string;
};

const StakingProgressFill: FunctionComponent<Props> = (props) => {
  const { t } = useTranslation();
  const isDai = props.unit === 'DAI';

  return (
    <div className="reward__progress-bar__wrapper">
      <progress
        className="reward__progress-bar"
        value={props.end}
        max={isDai ? (props.staking > 1 ? 50000 : 25000) : 3000000}
      />
      <div className="reward__progress-bar__content">
        {isDai ? (
          <div className={`reward__progress-bar__content__fill`}>
            <p className="spoqa">
              {t('reward.nth_reward', {
                nth: props.nth,
              })}
            </p>
          </div>
        ) : (
          stakingRoundTimes.map((_x, index) => {
            return (
              <div
                className={`reward__progress-bar__content__fill${
                  index > props.currentPhase! - 1 ? ' disable' : ''
                }`}
                key={`elfi-reward-progress-${index}`}
                style={{ flex: index < 2 ? 1 : 2 }}>
                <p className="spoqa">
                  {t('reward.nth_mining', {
                    nth: props.OrdinalNumberConverter!(index + 1),
                  })}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default StakingProgressFill;
