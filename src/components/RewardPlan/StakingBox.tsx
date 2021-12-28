import { BigNumber } from 'ethers';
import { FunctionComponent, useEffect, useState } from 'react';
import Token from 'src/enums/Token';
import elfi from 'src/assets/images/ELFI.png';
import el from 'src/assets/images/el.png';
import stakingRoundTimes from 'src/core/data/stakingRoundTimes';
import { useTranslation } from 'react-i18next';
import useMediaQueryType from 'src/hooks/useMediaQueryType';
import MediaQuery from 'src/enums/MediaQuery';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
import SwiperCore, { Pagination } from 'swiper';
import 'swiper/modules/pagination/pagination.scss';
import 'swiper/swiper.scss';
import { useLocation } from 'react-router-dom';
import SmallProgressBar from './SmallProgressBar';
import StakingBoxHeader from './StakingBoxHeader';
import StakingDetailInfo from './StakingDetailInfo';
import StakingProgressFill from './StakingProgressFill';

type Props = {
  nth: string;
  loading: boolean;
  poolApr: BigNumber;
  poolPrincipal: BigNumber;
  staking: number;
  unit: string;
  start: number[] | number;
  end: number[] | number;
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
  OrdinalNumberConverter: (value: number) => string;
  miningStart?: number[];
  miningEnd?: number[];
  currentPhase?: number;
};

const StakingBox: FunctionComponent<Props> = (props: Props) => {
  const isDai = props.unit === 'DAI';
  const rewardOrMining = isDai ? 'reward' : 'mining';
  const tokenImg = props.unit === Token.DAI ? elfi : el;
  const { t } = useTranslation();
  const { value: mediaQuery } = useMediaQueryType();
  const [currentSwipe, setCurrnetSwipe] = useState(props.staking);

  useEffect(() => {
    props.setState({
      elStaking: isDai ? props.state.elStaking : currentSwipe,
      currentElfiLevel: isDai ? currentSwipe : props.state.currentElfiLevel,
    });
  }, [currentSwipe]);

  SwiperCore.use([Pagination]);
  return (
    <>
      <div className="reward__token">
        <img src={tokenImg} />
        <h2>
          {t(`reward.token_staking__reward_plan`, {
            token: props.unit === 'DAI' ? 'ELFI' : 'EL',
          })}
        </h2>
      </div>
      <div className="reward__token__container">
        <StakingBoxHeader
          nth={props.nth}
          loading={props.loading}
          poolApr={props.poolApr}
          poolPrincipal={props.poolPrincipal}
          staking={props.staking}
          unit={props.unit}
        />

        <Swiper
          className="component__swiper"
          spaceBetween={100}
          loop={false}
          slidesPerView={1}
          pagination={{ clickable: true }}
          onSlideChange={(slides) => setCurrnetSwipe(slides.realIndex)}
          initialSlide={currentSwipe}
          style={{
            height:
              mediaQuery === 'PC'
                ? props.unit === Token.DAI
                  ? '240px'
                  : '280px'
                : undefined,
          }}>
          {stakingRoundTimes.map((_x, index) => {
            return (
              <SwiperSlide key={`slide-${index}`}>
                <div className="reward__token__data">
                  <SmallProgressBar
                    start={
                      typeof props.start === 'number'
                        ? props.start
                        : props.start[props.staking]
                    }
                    end={
                      typeof props.end === 'number'
                        ? props.end
                        : props.end[props.staking]
                    }
                    rewardOrMining={rewardOrMining}
                    totalMiningValue={
                      isDai
                        ? props.staking > 1
                          ? '50,000'
                          : '25,000'
                        : (5000000)
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                    max={isDai ? (props.staking > 1 ? 50000 : 25000) : 5000000}
                    unit={props.unit}
                    nth={props.nth}
                    stakingRoundFill={
                      <StakingProgressFill
                        nth={props.nth}
                        staking={props.staking}
                        unit={props.unit}
                        end={
                          typeof props.end === 'number'
                            ? props.end
                            : props.end[props.staking]
                        }
                        currentPhase={props.currentPhase}
                        OrdinalNumberConverter={props.OrdinalNumberConverter}
                      />
                    }
                  />
                  <StakingDetailInfo
                    nth={props.OrdinalNumberConverter(index + 1)}
                    isDai={props.unit === 'DAI'}
                    staking={index}
                    unit={props.unit}
                    start={
                      typeof props.start === 'number'
                        ? props.start
                        : props.start[index]
                    }
                    end={
                      typeof props.end === 'number'
                        ? props.end
                        : props.end[index]
                    }
                    state={props.state}
                    setState={props.setState}
                    miningStart={
                      typeof props.miningStart !== 'undefined'
                        ? props.miningStart[index]
                        : undefined
                    }
                    miningEnd={
                      typeof props.miningEnd !== 'undefined'
                        ? props.miningEnd[index]
                        : undefined
                    }
                  />
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
        {/* )} */}
      </div>
    </>
  );
};

export default StakingBox;
