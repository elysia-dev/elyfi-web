import { BigNumber } from 'ethers';
import { FunctionComponent } from 'react';
import CountUp from 'react-countup';
import { useTranslation } from 'react-i18next';
import stakingRoundTimes from 'src/core/data/stakingRoundTimes';
import { formatCommaSmallFourDisits } from 'src/utiles/formatters';

type Props = {
  nth: string;
  isDai: boolean;
  staking: number;
  unit: string;
  start: number;
  end: number;
  state: {
    elStaking: number;
    currentElfiLevel: number;
  };
  setState: (
    value: React.SetStateAction<{
      elStaking: number;
      currentElfiLevel: number;
    }>,
  ) => void;
  miningStart?: number;
  miningEnd?: number;
};

const StakingDetailInfo: FunctionComponent<Props> = (props: Props) => {
  const { t } = useTranslation();
  const { nth, isDai, staking, unit, start, end, miningEnd, miningStart } =
    props;

  const miningDescription = isDai
    ? [
        [
          t('reward.reward_term'),
          `${stakingRoundTimes[staking].startedAt.format(
            'yyyy.MM.DD HH:mm:ss',
          )} ~ ${stakingRoundTimes[staking].endedAt.format(
            'yyyy.MM.DD HH:mm:ss',
          )} KST`,
        ],
        [t('reward.daily_reward'), '1,250 DAI'],
      ]
    : [
        [
          t('reward.mining_term'),
          `${stakingRoundTimes[staking].startedAt.format(
            'yyyy.MM.DD HH:mm:ss',
          )} ~ ${stakingRoundTimes[staking].endedAt.format(
            'yyyy.MM.DD HH:mm:ss',
          )} KST`,
        ],
        [
          t('reward.nth_total_mining', {
            nth,
          }),
          'ELFI',
        ],
        [t('reward.daily_mining'), '25,000 ELFI'],
      ];
  return (
    <div className="reward__token__data__content">
      <h2>
        {t(isDai ? 'reward.nth_reward' : 'reward.nth_mining', {
          nth,
        })}
      </h2>
      {miningDescription.map((data, index) => {
        return (
          <div
            key={`reward-term-${index}`}
            className={`jreward__data__${index}`}>
            <p>{data[0]}</p>
            {isDai ? (
              <p className="spoqa data">{data[1]}</p>
            ) : (
              <p className="spoqa data">
                {index === 1 && staking >= 2
                  ? '1,000,000'
                  : index === 1
                  ? '500,000'
                  : ''}
                &nbsp;
                {data[1]}
              </p>
            )}
          </div>
        );
      })}
      <div>
        <p>
          {t(isDai ? 'reward.accumulated_reward' : 'reward.accumulated_mining')}
        </p>
        <p className="spoqa data">
          <CountUp
            className="spoqa data"
            start={isDai ? start : miningStart}
            end={isDai ? end : miningEnd!}
            decimals={4}
            duration={1}
            formattingFn={(number) => formatCommaSmallFourDisits(number)}
          />
          {` ${unit}`}
        </p>
      </div>
      <div>
        <p>{t(isDai ? 'reward.reward_limit' : 'reward.mining_limit')}</p>
        <p className="spoqa data">
          <CountUp
            className="spoqa data"
            start={
              staking <= 1
                ? isDai
                  ? 25000
                  : 500000
                : isDai
                ? 50000 - start
                : 1000000 - miningStart!
            }
            end={
              staking <= 1
                ? isDai
                  ? 25000
                  : 500000
                : isDai
                ? 50000 - end
                : 1000000 - miningEnd!
            }
            decimals={4}
            duration={1}
            formattingFn={(number) => formatCommaSmallFourDisits(number)}
          />
          {` ${unit}`}
        </p>
      </div>
    </div>
  );
};

export default StakingDetailInfo;
