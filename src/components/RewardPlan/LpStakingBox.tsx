import { FunctionComponent, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
import SwiperCore, { Navigation, Pagination } from 'swiper';
import 'swiper/modules/pagination/pagination.scss';
import 'swiper/swiper.scss';

import { lpRoundDate } from 'src/core/data/lpStakingTime';
import MediaQuery from 'src/enums/MediaQuery';
import Token from 'src/enums/Token';
import useMediaQueryType from 'src/hooks/useMediaQueryType';
import lpStakingPerRewardByRound, {
  ethRewardByRound,
} from 'src/utiles/LpStakingRewardByRound';
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
  ethReward?: number[];
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
  const [currentSwipe, setCurrnetSwipe] = useState(selectedRound);
  const { value: mediaQuery } = useMediaQueryType();
  const prevNavigation = useRef<HTMLDivElement>(null);
  const nextNavigation = useRef<HTMLDivElement>(null);
  const pagination = useRef<HTMLDivElement>(null);
  SwiperCore.use([Navigation, Pagination]);

  const miningElfiDescription = [
    [
      t('reward.mining_term'),
      `${lpRoundDate[selectedRound].startedAt.format(format)} ~ ${lpRoundDate[
        selectedRound
      ].endedAt.format(format)} KST`,
    ],
    [t('reward.daily_mining'), '7,500 ELFI'],
  ];
  const miningDescription =
    token1 === 'ETH'
      ? [
          [
            t('reward.reward_term'),
            `${lpRoundDate[selectedRound].startedAt.format(
              format,
            )} ~ ${lpRoundDate[selectedRound].endedAt.format(format)} KST`,
          ],
          [
            t('reward.daily_reward'),
            lpStakingPerRewardByRound(lpStakingRound.ethElfiRound),
          ],
        ]
      : [
          [
            t('reward.reward_term'),
            `${lpRoundDate[selectedRound].startedAt.format(
              format,
            )} ~ ${lpRoundDate[selectedRound].endedAt.format(format)} KST`,
          ],
          [t('reward.daily_reward'), '625 DAI'],
        ];
  return (
    <>
      <div className="reward__token__lp__container">
        <LpStakingHeader
          tvl={props.tvl}
          apr={props.apr}
          token0={token0}
          token1={token1}
        />
        <Swiper
          className="component__swiper"
          spaceBetween={100}
          loop={false}
          slidesPerView={1}
          navigation={{
            prevEl: prevNavigation.current,
            nextEl: nextNavigation.current,
          }}
          pagination={
            mediaQuery === MediaQuery.PC
              ? {
                  el: pagination.current,
                  clickable: true,
                  type: 'bullets',
                  renderBullet: (index, className) => {
                    return `<div class=${className}>${index + 1}</div>`;
                  },
                }
              : {
                  clickable: true,
                }
          }
          onSlideChange={(slides) => {
            setLpStakingRound({
              ...lpStakingRound,
              daiElfiRound:
                token1 === Token.DAI
                  ? slides.realIndex
                  : lpStakingRound.daiElfiRound,
              ethElfiRound:
                token1 === Token.DAI
                  ? lpStakingRound.ethElfiRound
                  : slides.realIndex,
            });
            setCurrnetSwipe(slides.realIndex);
          }}
          initialSlide={currentSwipe}
          style={{
            height: mediaQuery === 'PC' ? '320px' : undefined,
          }}>
          {lpRoundDate.map((_x, index) => {
            return (
              <SwiperSlide key={`slide-${index}`}>
                <div className="reward__token__data">
                  <SmallProgressBar
                    start={
                      firstTokenValue.start[index] <= 0
                        ? 0
                        : firstTokenValue.start[index]
                    }
                    end={
                      firstTokenValue.end[index] <= 0
                        ? 0
                        : firstTokenValue.end[index]
                    }
                    rewardOrMining={'mining'}
                    totalMiningValue={firstTokenValue.total
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    max={firstTokenValue.total}
                    unit={token0}
                  />
                  <RewardDetailInfo
                    start={
                      firstTokenValue.start[index] <= 0
                        ? 0
                        : firstTokenValue.start[index]
                    }
                    end={
                      firstTokenValue.end[index] <= 0
                        ? 0
                        : firstTokenValue.end[index]
                    }
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
                    start={
                      secondTokenValue.start[index] <= 0
                        ? 0
                        : secondTokenValue.start[index]
                    }
                    end={
                      secondTokenValue.end[index] <= 0
                        ? 0
                        : secondTokenValue.end[index]
                    }
                    rewardOrMining={'reward'}
                    totalMiningValue={
                      token1 === Token.DAI
                        ? secondTokenValue.total
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                        : ethRewardByRound(lpStakingRound.ethElfiRound + 1)
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                    max={
                      props.ethReward
                        ? index === 0
                          ? props.ethReward[0]
                          : props.ethReward[1]
                        : secondTokenValue.total
                    }
                    unit={token1}
                  />
                  <RewardDetailInfo
                    start={
                      secondTokenValue.start[index] <= 0
                        ? 0
                        : secondTokenValue.start[index]
                    }
                    end={
                      secondTokenValue.end[index] <= 0
                        ? 0
                        : secondTokenValue.end[index]
                    }
                    miningStart={
                      secondTokenValue.start[index] <= 0
                        ? 0
                        : (props.ethReward
                            ? index === 0
                              ? props.ethReward[0]
                              : props.ethReward[1]
                            : secondTokenValue.total) -
                          secondTokenValue.start[index]
                    }
                    miningEnd={
                      secondTokenValue.end[index] <= 0
                        ? 0
                        : (props.ethReward
                            ? index === 0
                              ? props.ethReward[0]
                              : props.ethReward[1]
                            : secondTokenValue.total) -
                          secondTokenValue.end[index]
                    }
                    miningDescription={miningDescription}
                    unit={token1}
                  />
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
        {mediaQuery === MediaQuery.PC && (
          <div className="swiper-custom-wrapper">
            <div className="swiper-navigation" ref={prevNavigation}>
              &lt;
            </div>
            <div ref={pagination}></div>
            <div className="swiper-navigation" ref={nextNavigation}>
              &gt;
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default LpStakingBox;
