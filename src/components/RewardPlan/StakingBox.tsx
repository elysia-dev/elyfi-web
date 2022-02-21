import { BigNumber } from 'ethers';
import {
  FunctionComponent,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import Token from 'src/enums/Token';
import elfi from 'src/assets/images/ELFI.png';
import el from 'src/assets/images/el.png';
import stakingRoundTimes, {
  busdStakingRoundTimes,
} from 'src/core/data/stakingRoundTimes';
import { useTranslation } from 'react-i18next';
import useMediaQueryType from 'src/hooks/useMediaQueryType';
import MediaQuery from 'src/enums/MediaQuery';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
import SwiperCore, { Navigation, Pagination } from 'swiper';
import 'swiper/modules/pagination/pagination.scss';
import 'swiper/swiper.scss';
import miningValueByToken, { countValue } from 'src/utiles/stakingReward';
import MainnetContext from 'src/contexts/MainnetContext';
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
    round: number;
  };
  setState: (
    value: React.SetStateAction<{
      round: number;
    }>,
  ) => void;
  OrdinalNumberConverter: (value: number) => string;
  stakingToken: string;
  miningStart?: number[];
  miningEnd?: number[];
  currentPhase?: number;
};

const StakingBox: FunctionComponent<Props> = (props: Props) => {
  const isElfi = !(props.unit === 'ELFI');
  const rewardOrMining = isElfi ? 'reward' : 'mining';
  const tokenImg = isElfi ? elfi : el;
  const { t } = useTranslation();
  const { value: mediaQuery } = useMediaQueryType();
  const [currentSwipe, setCurrnetSwipe] = useState(props.staking);
  const { type: getMainnetType } = useContext(MainnetContext);
  const prevNavigation = useRef<HTMLDivElement>(null);
  const nextNavigation = useRef<HTMLDivElement>(null);
  const pagination = useRef<HTMLDivElement>(null);

  const roundTimes =
    props.stakingToken === 'ELFI' && getMainnetType === 'BSC'
      ? busdStakingRoundTimes
      : stakingRoundTimes;

  useEffect(() => {
    props.setState({
      ...props.state,
      round: currentSwipe,
    });
  }, [currentSwipe]);

  SwiperCore.use([Navigation, Pagination]);
  return (
    <>
      <div className="reward__token">
        <img src={tokenImg} />
        <h2>
          {t(`reward.token_staking__reward_plan`, {
            token: !(props.unit === 'ELFI') ? 'ELFI' : 'EL',
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
          onSlideChange={(slides) => setCurrnetSwipe(slides.realIndex)}
          initialSlide={currentSwipe}
          style={{
            height:
              mediaQuery === 'PC'
                ? props.unit === Token.ELFI
                  ? '280px'
                  : '240px'
                : undefined,
          }}>
          {roundTimes.map((_x, index) => {
            const miningValue = miningValueByToken(props.unit, props.staking);
            const { start, end } = countValue(props.start, props.end, index);

            return (
              <SwiperSlide key={`slide-${index}`}>
                <div className="reward__token__data">
                  <SmallProgressBar
                    start={start}
                    end={end}
                    rewardOrMining={rewardOrMining}
                    totalMiningValue={miningValue
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    max={miningValue}
                    unit={props.unit}
                    nth={props.nth}
                    stakingRoundFill={
                      <StakingProgressFill
                        nth={props.nth}
                        staking={props.staking}
                        unit={props.unit}
                        end={end}
                        currentPhase={props.currentPhase}
                        OrdinalNumberConverter={props.OrdinalNumberConverter}
                      />
                    }
                  />
                  <StakingDetailInfo
                    nth={props.OrdinalNumberConverter(index + 1)}
                    isELFI={!(props.unit === 'ELFI')}
                    staking={index}
                    unit={props.unit}
                    start={start}
                    end={end}
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
                    roundTimes={roundTimes}
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

export default StakingBox;
