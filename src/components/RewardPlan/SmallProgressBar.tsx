import { BigNumber } from 'ethers';
import { FunctionComponent, ReactElement } from 'react';
import CountUp from 'react-countup';
import { useTranslation } from 'react-i18next';
import { formatCommaSmallFourDisits } from 'src/utiles/formatters';

type Props = {
  start: number;
  end: number;
  rewardOrMining: string;
  totalMiningValue: string | number;
  max: number;
  unit: string;
  nth?: string;
  stakingRoundFill?: ReactElement;
};

const SmallProgressBar: FunctionComponent<Props> = (props) => {
  const { t } = useTranslation();
  const { nth, unit, start, end, rewardOrMining, totalMiningValue, max } =
    props;
  const isDai = unit !== 'ELFI';
  return (
    <div className="component__progress-bar">
      <div>
        {isDai && rewardOrMining === 'reward' ? (
          nth ? (
            <>
              <p>
                {t(`reward.nth_current_reward`, {
                  nth,
                })}
              </p>
              <p>
                {t('reward.nth_total_reward', {
                  nth,
                })}
              </p>
            </>
          ) : (
            <>
              <p>
                {t(`reward.current_reward`, {
                  nth,
                })}
              </p>
              <p>
                {t('reward.total_reward', {
                  nth,
                })}
              </p>
            </>
          )
        ) : (
          <>
            <p>{t('reward.current_mining')}</p>
            <p>{t('reward.total_mining')}</p>
          </>
        )}
      </div>
      <div>
        <p className="bold">
          <CountUp
            className={`bold ${unit.toLowerCase()}`}
            start={start}
            end={end}
            decimals={4}
            duration={1}
            formattingFn={(number) => formatCommaSmallFourDisits(number)}
          />
          {` ${unit}`}
        </p>
        <p className="bold">
          <span className="bold">{totalMiningValue}</span> {unit}
        </p>
      </div>
      {props.stakingRoundFill ? (
        props.stakingRoundFill
      ) : (
        <progress
          className={`${unit.toLowerCase()}_progress`}
          value={end}
          max={max}
        />
      )}
    </div>
  );
};

export default SmallProgressBar;
