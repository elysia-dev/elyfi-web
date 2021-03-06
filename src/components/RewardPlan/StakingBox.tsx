import { BigNumber } from 'ethers';
import {
  FunctionComponent,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { i18n } from 'i18next';
import { useNavigate } from 'react-router-dom';

import Token from 'src/enums/Token';
import elfi from 'src/assets/images/ELFI.png';
import el from 'src/assets/images/el.png';
import { roundTimes } from 'src/core/data/stakingRoundTimes';
import { useTranslation } from 'react-i18next';
import useMediaQueryType from 'src/hooks/useMediaQueryType';
import MediaQuery from 'src/enums/MediaQuery';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
import SwiperCore, { Navigation, Pagination } from 'swiper';
import 'swiper/modules/pagination/pagination.scss';
import 'swiper/swiper.scss';
import miningValueByToken, { countValue } from 'src/utiles/stakingReward';
import MainnetContext from 'src/contexts/MainnetContext';
import { ordinalNumberConverter } from 'src/utiles/ordinalNumberConverter';
import MainnetType from 'src/enums/MainnetType';
import useNavigator from 'src/hooks/useNavigator';
import SmallProgressBar from './SmallProgressBar';
import StakingBoxHeader from './StakingBoxHeader';
import StakingDetailInfo from './StakingDetailInfo';
import StakingProgressFill from './StakingProgressFill';

type Props = {
  loading: boolean;
  poolApr: BigNumber;
  poolPrincipal: BigNumber;
  stakedRound: number;
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
  OrdinalNumberConverter: (value: number, i18n: i18n) => string;
  stakedToken: string;
  miningStart?: number[];
  miningEnd?: number[];
  currentPhase?: number;
};

const StakingBox: FunctionComponent<Props> = (props: Props) => {
  const isElfi = !(props.unit === 'ELFI');
  const rewardOrMining = isElfi ? 'reward' : 'mining';
  const tokenImg = isElfi ? elfi : el;
  const { t, i18n } = useTranslation();
  const { value: mediaQuery } = useMediaQueryType();
  const [currentSwipe, setCurrnetSwipe] = useState(props.stakedRound);
  const navigate = useNavigator();
  const { type: getMainnetType } = useContext(MainnetContext);
  const prevNavigation = useRef<HTMLDivElement>(null);
  const nextNavigation = useRef<HTMLDivElement>(null);
  const pagination = useRef<HTMLDivElement>(null);

  const stakingRoundDate = roundTimes(props.stakedToken, getMainnetType);

  const nth = useMemo(
    () => ordinalNumberConverter(props.stakedRound + 1, i18n),
    [props.stakedRound, i18n.language],
  );

  useEffect(() => {
    props.setState({
      ...props.state,
      round: currentSwipe,
    });
  }, [currentSwipe]);

  useEffect(() => {
    if (props.stakedToken === Token.EL && getMainnetType === MainnetType.BSC) {
      navigate(`/${i18n.language}/staking/EL`);
    }
  }, [getMainnetType]);

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
          nth={nth}
          loading={props.loading}
          poolApr={props.poolApr}
          poolPrincipal={props.poolPrincipal}
          stakedRound={props.stakedRound}
          unit={props.unit}
          stakingRoundDate={stakingRoundDate}
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
          {stakingRoundDate.map((_x, index) => {
            const miningValue = miningValueByToken(
              props.unit,
              props.stakedRound,
            );
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
                    nth={nth}
                    stakingRoundFill={
                      <StakingProgressFill
                        nth={nth}
                        stakedRound={props.stakedRound}
                        unit={props.unit}
                        end={end}
                        currentPhase={props.currentPhase}
                        OrdinalNumberConverter={props.OrdinalNumberConverter}
                      />
                    }
                  />
                  <StakingDetailInfo
                    nth={props.OrdinalNumberConverter(index + 1, i18n)}
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
                    stakingRoundDate={stakingRoundDate}
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
