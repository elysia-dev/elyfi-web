import { Dispatch, FunctionComponent, SetStateAction, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  lpStakingStartedAt,
  lpStakingEndedAt,
  lpRoundDate,
} from 'src/core/data/lpStakingTime';
import MediaQuery from 'src/enums/MediaQuery';
import Token from 'src/enums/Token';
import useMediaQueryType from 'src/hooks/useMediaQueryType';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
import SwiperCore, { Pagination } from 'swiper';
import 'swiper/modules/pagination/pagination.scss';
import 'swiper/swiper.scss'
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
    start: number[];
    end: number[];
  };
  token1: string;
  secondTokenValue: {
    total: number;
    start: number[];
    end: number[];
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
  ethReward?: number[]
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
  const [currentSwipe, setCurrnetSwipe] = useState(0);
  const { value: mediaQuery } = useMediaQueryType();

  SwiperCore.use([Pagination]);

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
      {
        mediaQuery === MediaQuery.PC ? (
          <>
            <div className="reward__token__data">
              <SmallProgressBar
                start={firstTokenValue.start[currentSwipe] <= 0 ? 0 : firstTokenValue.start[currentSwipe]}
                end={firstTokenValue.end[currentSwipe] <= 0 ? 0 : firstTokenValue.end[currentSwipe]}
                rewardOrMining={'mining'}
                totalMiningValue={firstTokenValue.total
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                max={firstTokenValue.total}
                unit={token0}
              />
              <RewardDetailInfo
                start={firstTokenValue.start[currentSwipe] <= 0 ? 0 : firstTokenValue.start[currentSwipe]}
                end={firstTokenValue.end[currentSwipe] <= 0 ? 0 : firstTokenValue.end[currentSwipe]}
                miningStart={
                  firstTokenValue.start[currentSwipe] <= 0
                    ? 0
                    : firstTokenValue.total - firstTokenValue.start[currentSwipe]
                }
                miningEnd={
                  firstTokenValue.end[currentSwipe] <= 0
                    ? 0
                    : firstTokenValue.total - firstTokenValue.end[currentSwipe]
                }
                miningDescription={miningElfiDescription}
                unit={token0}
              />
            </div>
            <div className="reward__token__data">
              <SmallProgressBar
                start={secondTokenValue.start[currentSwipe] <= 0 ? 0 : secondTokenValue.start[currentSwipe]}
                end={secondTokenValue.end[currentSwipe] <= 0 ? 0 : secondTokenValue.end[currentSwipe]}
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
                start={secondTokenValue.start[currentSwipe] <= 0 ? 0 : secondTokenValue.start[currentSwipe]}
                end={secondTokenValue.end[currentSwipe] <= 0 ? 0 : secondTokenValue.end[currentSwipe]}
                miningStart={
                  secondTokenValue.start[currentSwipe] <= 0
                    ? 0
                    : secondTokenValue.total - secondTokenValue.start[currentSwipe]
                }
                miningEnd={
                  secondTokenValue.end[currentSwipe] <= 0
                    ? 0
                    : secondTokenValue.total - secondTokenValue.end[currentSwipe]
                }
                miningDescription={miningDescription}
                unit={token1}
              />
            </div>
          </>
        ) : (
          <Swiper 
            className="component__swiper"
            spaceBetween={100}
            loop={false}
            slidesPerView={1}
            pagination={{ clickable: true }}
            onSlideChange={(slides) => setCurrnetSwipe(slides.realIndex)}
            initialSlide={currentSwipe}
          >
          {  
            lpRoundDate.map((_x, index) => {
              return (
                <SwiperSlide key={`slide-${index}`}>
                  <div className="reward__token__data">
                    <SmallProgressBar
                      start={firstTokenValue.start[index] <= 0 ? 0 : firstTokenValue.start[index]}
                      end={firstTokenValue.end[index] <= 0 ? 0 : firstTokenValue.end[index]}
                      rewardOrMining={'mining'}
                      totalMiningValue={firstTokenValue.total
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      max={firstTokenValue.total}
                      unit={token0}
                    />
                    <RewardDetailInfo
                      start={firstTokenValue.start[index] <= 0 ? 0 : firstTokenValue.start[index]}
                      end={firstTokenValue.end[index] <= 0 ? 0 : firstTokenValue.end[index]}
                      miningStart={
                        firstTokenValue.start[index] <= 0
                          ? 0
                          : firstTokenValue.total - firstTokenValue.start[index]
                      }
                      miningEnd={
                        firstTokenValue.end[index] <= 0
                          ? 0
                          : firstTokenValue.total - firstTokenValue.end[index]
                      }
                      miningDescription={miningElfiDescription}
                      unit={token0}
                    />
                  </div>
                  <div className="reward__token__data">
                    <SmallProgressBar
                      start={secondTokenValue.start[index] <= 0 ? 0 : secondTokenValue.start[index]}
                      end={secondTokenValue.end[index] <= 0 ? 0 : secondTokenValue.end[index]}
                      rewardOrMining={'reward'}
                      totalMiningValue={
                        token1 === Token.DAI
                          ? (
                              props.ethReward ? 
                                (index === 0 ? 
                                  props.ethReward[0] : 
                                  props.ethReward[1]
                                ) :
                                secondTokenValue.total
                            ).toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                          : lpStakingRound.ethElfiRound >= 2
                          ? 'TBD'
                          : (props.ethReward ? 
                              (index === 0 ? 
                                props.ethReward[0] : 
                                props.ethReward[1]
                              ) :
                              secondTokenValue.total)
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      }
                      max={
                        props.ethReward ? 
                          (index === 0 ? 
                            props.ethReward[0] : 
                            props.ethReward[1]
                          ) :
                          secondTokenValue.total
                        }
                      unit={token1}
                    />
                    <RewardDetailInfo
                      start={secondTokenValue.start[index] <= 0 ? 0 : secondTokenValue.start[index]}
                      end={secondTokenValue.end[index] <= 0 ? 0 : secondTokenValue.end[index]}
                      miningStart={
                        secondTokenValue.start[index] <= 0
                          ? 0
                          : (props.ethReward ? 
                              (index === 0 ? 
                                props.ethReward[0] : 
                                props.ethReward[1]
                              ) :
                              secondTokenValue.total) - secondTokenValue.start[index]
                      }
                      miningEnd={
                        secondTokenValue.end[index] <= 0
                          ? 0
                          : (props.ethReward ? 
                              (index === 0 ? 
                                props.ethReward[0] : 
                                props.ethReward[1]
                              ) :
                              secondTokenValue.total) - secondTokenValue.end[index]
                      }
                      miningDescription={miningDescription}
                      unit={token1}
                    />
                  </div>
                </SwiperSlide>
              )
            })
          }
          </Swiper>
        )
      }
    </div>
  );
};

export default LpStakingBox;
