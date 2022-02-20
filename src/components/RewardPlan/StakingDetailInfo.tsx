import { FunctionComponent, useMemo } from 'react';
import CountUp from 'react-countup';
import { useTranslation } from 'react-i18next';
import { IStakingPoolRound } from 'src/core/data/stakingRoundTimes';
import { formatCommaSmallFourDisits } from 'src/utiles/formatters';
import { rewardLimit } from 'src/utiles/stakingInfoBytoken';

type Props = {
  nth: string;
  isELFI: boolean;
  staking: number;
  unit: string;
  start: number;
  end: number;
  state: {
    round: number;
  };
  setState: (
    value: React.SetStateAction<{
      round: number;
    }>,
  ) => void;
  roundTimes: IStakingPoolRound[];
  miningStart?: number;
  miningEnd?: number;
};

const StakingDetailInfo: FunctionComponent<Props> = (props: Props) => {
  const { t } = useTranslation();
  const { nth, isELFI, staking, unit, start, end, miningEnd, miningStart } =
    props;

  const accumulateReward = useMemo(() => {
    return {
      start: isELFI ? start : miningStart!,
      end: isELFI ? end : miningEnd!,
    };
  }, [start, miningStart, end, miningEnd]);

  const calcRewardLimit = useMemo(() => {
    return {
      start: rewardLimit(unit, staking) - accumulateReward.start,
      end: rewardLimit(unit, staking) - accumulateReward.end,
    };
  }, [start, miningStart, end, miningEnd]);

  const roundDate = [
    t(isELFI ? 'reward.reward_term' : 'reward.mining_term'),
    `${props.roundTimes[staking].startedAt.format(
      'yyyy.MM.DD HH:mm:ss',
    )} ~ ${props.roundTimes[staking].endedAt.format(
      'yyyy.MM.DD HH:mm:ss',
    )} KST`,
  ];

  const miningDescription = isELFI
    ? [[t('reward.daily_reward'), `1,250 ${props.unit}`]]
    : [
        [
          t('reward.nth_total_mining', {
            nth,
          }),
          'ELFI',
        ],
        [t('reward.daily_mining'), '25,000 ELFI'],
      ];
  miningDescription.unshift(roundDate);

  return (
    <div className="reward__token__data__content">
      <h2>
        {t(isELFI ? 'reward.nth_reward' : 'reward.nth_mining', {
          nth,
        })}
      </h2>
      {miningDescription.map((data, index) => {
        return (
          <div key={`reward-term-${index}`}>
            <p>{data[0]}</p>
            {isELFI ? (
              <p>{data[1]}</p>
            ) : (
              <p>
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
          {t(
            isELFI ? 'reward.accumulated_reward' : 'reward.accumulated_mining',
          )}
        </p>
        <p>
          <CountUp
            start={accumulateReward.start}
            end={accumulateReward.end}
            decimals={4}
            duration={1}
            formattingFn={(number) => formatCommaSmallFourDisits(number)}
          />
          {` ${unit}`}
        </p>
      </div>
      <div>
        <p>{t(isELFI ? 'reward.reward_limit' : 'reward.mining_limit')}</p>
        <p>
          <CountUp
            start={calcRewardLimit.start}
            end={calcRewardLimit.end}
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
