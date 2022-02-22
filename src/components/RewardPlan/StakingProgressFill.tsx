import { i18n } from 'i18next';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import stakingRoundTimes from 'src/core/data/stakingRoundTimes';
import MediaQuery from 'src/enums/MediaQuery';
import useMediaQueryType from 'src/hooks/useMediaQueryType';
import miningValueByToken from 'src/utiles/stakingReward';

type Props = {
  nth: string;
  staking: number;
  unit: string;
  end: number;
  currentPhase?: number;
  OrdinalNumberConverter?: (value: number, i18n: i18n) => string;
};

const StakingProgressFill: FunctionComponent<Props> = (props) => {
  const { t, i18n } = useTranslation();
  const isElfi = props.unit === 'ELFI';
  const { value: mediaQuery } = useMediaQueryType();

  const miningValue = miningValueByToken(props.unit, props.staking);

  return (
    <div className="reward__progress-bar__wrapper">
      <progress
        className="reward__progress-bar"
        value={props.end}
        max={miningValue}
      />
      <div className="reward__progress-bar__content">
        {!isElfi ? (
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
                  {mediaQuery === MediaQuery.PC
                    ? t('reward.nth_mining', {
                        nth: props.OrdinalNumberConverter!(index + 1, i18n),
                      })
                    : t('staking.nth--short', {
                        nth: props.OrdinalNumberConverter!(index + 1, i18n),
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
