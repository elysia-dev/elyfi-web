import { Dispatch, FunctionComponent, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import {
  lpStakingStartedAt,
  lpStakingEndedAt,
  lpRoundDate,
} from 'src/core/data/lpStakingTime';
import Token from 'src/enums/Token';
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
  currentRound: number;
  selectedRound: number;
  lpStakingRound: {
    daiElfiRound: number;
    ethElfiRound: number;
  };
  setLpStakingRound: React.Dispatch<
    React.SetStateAction<{
      daiElfiRound: number;
      ethElfiRound: number;
    }>
  >;
};

const format = 'yyyy.MM.DD HH:mm:ss';

const LpStakingBox: FunctionComponent<Props> = (props) => {
  const {
    token0,
    firstTokenValue,
    token1,
    secondTokenValue,
    currentRound,
    selectedRound,
    lpStakingRound,
    setLpStakingRound,
  } = props;
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
          [
            t('reward.daily_reward'),
            `${
              lpStakingRound.ethElfiRound >= 2
                ? '0.0000 ETH'
                : lpStakingRound.ethElfiRound === 1
                ? '0.1609 ETH'
                : '0.1376 ETH'
            }`,
          ],
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
    <div className="reward__token__lp__container">
      <div className="reward__token__array-handler">
        <div
          className={`reward__token__array-handler--left${
            token1 === Token.DAI
              ? lpStakingRound.daiElfiRound === 0
                ? ' disabled'
                : ''
              : lpStakingRound.ethElfiRound === 0
              ? ' disabled'
              : ''
          }`}
          onClick={() => {
            setLpStakingRound({
              ...lpStakingRound,
              daiElfiRound:
                token1 === Token.DAI
                  ? lpStakingRound.daiElfiRound === 0
                    ? lpStakingRound.daiElfiRound
                    : lpStakingRound.daiElfiRound - 1
                  : lpStakingRound.daiElfiRound,
              ethElfiRound:
                token1 === Token.DAI
                  ? lpStakingRound.ethElfiRound
                  : lpStakingRound.ethElfiRound === 0
                  ? lpStakingRound.ethElfiRound
                  : lpStakingRound.ethElfiRound - 1,
            });
          }}
          style={{
            top: -90,
          }}>
          <i />
          <i />
        </div>
        <div
          className={`reward__token__array-handler--right${
            token1 === Token.DAI
              ? lpStakingRound.daiElfiRound === lpRoundDate.length - 1
                ? ' disabled'
                : ''
              : lpStakingRound.ethElfiRound === lpRoundDate.length - 1
              ? ' disabled'
              : ''
          }`}
          onClick={() => {
            setLpStakingRound({
              ...lpStakingRound,
              daiElfiRound:
                token1 === Token.DAI
                  ? lpStakingRound.daiElfiRound === lpRoundDate.length - 1
                    ? lpStakingRound.daiElfiRound
                    : lpStakingRound.daiElfiRound + 1
                  : lpStakingRound.daiElfiRound,
              ethElfiRound:
                token1 === Token.DAI
                  ? lpStakingRound.ethElfiRound
                  : lpStakingRound.ethElfiRound === lpRoundDate.length - 1
                  ? lpStakingRound.ethElfiRound
                  : lpStakingRound.ethElfiRound + 1,
            });
          }}
          style={{
            top: -90,
          }}>
          <i />
          <i />
        </div>
      </div>
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
          totalMiningValue={
            token1 === Token.DAI
              ? secondTokenValue.total
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              : lpStakingRound.ethElfiRound >= 2
              ? 'TBD'
              : secondTokenValue.total
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          }
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
