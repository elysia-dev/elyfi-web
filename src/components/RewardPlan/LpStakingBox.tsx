import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import {
  lpStakingEndedAt,
  lpStakingStartedAt,
} from 'src/core/data/lpStakingTime';
import LpStakingHeader from './LpStakingHeader';
import RewardDetailInfo from './RewardDetailInfo';
import SmallProgressBar from './SmallProgressBar';

type Props = {
  index: number;
  token0: string;
  tvl: number;
  apr: string;
  firstTokenValue: {
    total: number;
    start: number;
    end: number;
  };
  token1: string;
  secondTokenValue: {
    total: number;
    start: number;
    end: number;
  };
};

const format = 'yyyy.MM.DD HH:mm:ss';

const LpStakingBox: FunctionComponent<Props> = (props) => {
  const { token0, firstTokenValue, token1, secondTokenValue } = props;
  const { t } = useTranslation();

  const miningElfiDescription = [
    [
      t('reward.mining_term'),
      `${lpStakingStartedAt.format(format)} ~ ${lpStakingEndedAt.format(
        format,
      )} KST`,
    ],
    [t('reward.daily_mining'), '7,500 ELFI'],
  ];
  const miningDescription =
    token1 === 'ETH'
      ? [
          [
            t('reward.reward_term'),
            `${lpStakingStartedAt.format(format)} ~ ${lpStakingEndedAt.format(
              format,
            )} KST`,
          ],
          [t('reward.daily_reward'), '0.1376 ETH'],
        ]
      : [
          [
            t('reward.reward_term'),
            `${lpStakingStartedAt.format(format)} ~ ${lpStakingEndedAt.format(
              format,
            )} KST`,
          ],
          [t('reward.daily_reward'), '625 DAI'],
        ];

  return (
    <div
      className="reward__token__lp__container">
      <LpStakingHeader
        tvl={props.tvl}
        apr={props.apr}
        token0={token0}
        token1={token1}
      />
      <div className="reward__token__data">
        <SmallProgressBar
          start={firstTokenValue.start <= 0 ? 0 : firstTokenValue.start}
          end={firstTokenValue.end <= 0 ? 0 : firstTokenValue.end}
          rewardOrMining={'mining'}
          totalMiningValue={firstTokenValue.total
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          max={firstTokenValue.total}
          unit={token0}
        />
        <RewardDetailInfo
          start={firstTokenValue.start <= 0 ? 0 : firstTokenValue.start}
          end={firstTokenValue.end <= 0 ? 0 : firstTokenValue.end}
          miningStart={
            firstTokenValue.start <= 0
              ? 0
              : firstTokenValue.total - firstTokenValue.start
          }
          miningEnd={
            firstTokenValue.end <= 0
              ? 0
              : firstTokenValue.total - firstTokenValue.end
          }
          miningDescription={miningElfiDescription}
          unit={token0}
        />
      </div>
      <div className="reward__token__data">
        <SmallProgressBar
          start={secondTokenValue.start <= 0 ? 0 : secondTokenValue.start}
          end={secondTokenValue.end <= 0 ? 0 : secondTokenValue.end}
          rewardOrMining={'reward'}
          totalMiningValue={secondTokenValue.total
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          max={secondTokenValue.total}
          unit={token1}
        />
        <RewardDetailInfo
          start={secondTokenValue.start <= 0 ? 0 : secondTokenValue.start}
          end={secondTokenValue.end <= 0 ? 0 : secondTokenValue.end}
          miningStart={
            secondTokenValue.start <= 0
              ? 0
              : secondTokenValue.total - secondTokenValue.start
          }
          miningEnd={
            secondTokenValue.end <= 0
              ? 0
              : secondTokenValue.total - secondTokenValue.end
          }
          miningDescription={miningDescription}
          unit={token1}
        />
      </div>
    </div>
  );
};

export default LpStakingBox;
