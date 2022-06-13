import { constants, utils } from 'ethers';
import moment from 'moment';
import envs from 'src/core/envs';
import {
  FunctionComponent,
  lazy,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import useSWR from 'swr';
import { useTranslation, Trans } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  daiMoneyPoolTime,
  tetherMoneyPoolTime,
  busdMoneyPoolTime,
  usdcMoneyPoolTime,
} from 'src/core/data/moneypoolTimes';
import { roundTimes } from 'src/core/data/stakingRoundTimes';
import Token from 'src/enums/Token';
import useStakingRoundData from 'src/hooks/useStakingRoundData';
import ELFI from 'src/assets/images/ELFI.png';
import useLpApr from 'src/hooks/useLpApy';
import {
  IPoolPosition,
  positionsByPoolIdFetcher,
  positionsByPoolIdQuery,
} from 'src/clients/StakerSubgraph';
import getIncentiveId from 'src/utiles/getIncentive';
import usePricePerLiquidity from 'src/hooks/usePricePerLiquidity';
import { lpRoundDate } from 'src/core/data/lpStakingTime';
import DrawWave from 'src/utiles/drawWave';
import TokenColors from 'src/enums/TokenColors';
import MediaQuery from 'src/enums/MediaQuery';
import useMediaQueryType from 'src/hooks/useMediaQueryType';
import isSupportedReserve from 'src/core/utils/isSupportedReserve';
import MainnetContext from 'src/contexts/MainnetContext';
import getTokenNameByAddress from 'src/core/utils/getTokenNameByAddress';
import useCalcReward from 'src/hooks/useCalcReward';
import { rewardToken } from 'src/utiles/stakingReward';
import Skeleton from 'react-loading-skeleton';
import { poolDataFetcher } from 'src/clients/CachedUniswapV3';
import poolDataMiddleware from 'src/middleware/poolDataMiddleware';
import useReserveData from 'src/hooks/useReserveData';

const LazyImage = lazy(() => import('src/utiles/lazyImage'));
const LpStakingBox = lazy(
  () => import('src/components/RewardPlan/LpStakingBox'),
);
const StakingBox = lazy(() => import('src/components/RewardPlan/StakingBox'));
const TokenDeposit = lazy(
  () => import('src/components/RewardPlan/TokenDeposit'),
);

const RewardPlan: FunctionComponent = () => {
  const { t, i18n } = useTranslation();
  const { stakingType } = useParams<{ stakingType: string }>();
  const navigate = useNavigate();
  const { data: poolData, isValidating: poolDataLoading } = useSWR(
    envs.externalApiEndpoint.cachedUniswapV3URL,
    poolDataFetcher,
    {
      use: [poolDataMiddleware],
    },
  );
  const { data: positionsByPoolId } = useSWR(
    positionsByPoolIdQuery,
    positionsByPoolIdFetcher,
  );
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const { reserveState, loading: subgraphLoading } = useReserveData();
  const { type: getMainnetType } = useContext(MainnetContext);
  const current = moment();
  const { value: mediaQuery } = useMediaQueryType();
  const rewardType = stakingType || 'EL';
  const isEl = rewardType === 'EL';
  const stakingRoundDate = roundTimes(rewardType, getMainnetType);

  const currentPhase = useMemo(() => {
    return stakingRoundDate.filter(
      (round) => current.diff(round.startedAt) >= 0,
    ).length;
  }, [current]);
  const { state: rewardInfo } = useCalcReward(rewardType);

  const lpCurrentPhase = useMemo(() => {
    return lpRoundDate.filter((round) => current.diff(round.startedAt) >= 0)
      .length;
  }, [current]);

  const depositCurrentPhase = useMemo(() => {
    return daiMoneyPoolTime.findIndex((round) =>
      current.isBetween(round.startedAt, round.endedAt),
    );
  }, [current]);

  const onClickHandler = () => {
    navigate(-1);
  };

  const [state, setState] = useState({
    round: currentPhase - 1,
  });

  const [lpStakingRound, setLpStakingRound] = useState({
    daiElfiRound: lpCurrentPhase - 1,
    ethElfiRound: lpCurrentPhase - 1,
  });

  const [depositRound, setDepositRound] = useState({
    daiRound: depositCurrentPhase === -1 ? 0 : depositCurrentPhase,
    tetherRound: depositCurrentPhase === -1 ? 0 : depositCurrentPhase,
  });

  const [totalStakedPositions, setTotalStakedPositions] = useState<
    IPoolPosition | undefined
  >();
  const [totalLiquidity, setTotalLiquidity] = useState<{
    daiElfiPoolTotalLiquidity: number;
    ethElfiPoolTotalLiquidity: number;
    ethElfiliquidityForApr: string;
    daiElfiliquidityForApr: string;
  }>({
    daiElfiPoolTotalLiquidity: 0,
    ethElfiPoolTotalLiquidity: 0,
    ethElfiliquidityForApr: '0',
    daiElfiliquidityForApr: '0',
  });
  const incentiveIds = getIncentiveId();
  const { pricePerDaiLiquidity, pricePerEthLiquidity } = usePricePerLiquidity();
  const { calcEthElfiPoolApr, calcDaiElfiPoolApr } = useLpApr();

  const {
    totalPrincipal: poolPrincipal,
    apr: poolApr,
    loading: poolLoading,
  } = useStakingRoundData(
    state.round,
    rewardType,
    rewardToken(rewardType, getMainnetType),
  );

  const moneyPoolInfo = {
    USDC: {
      startedMoneyPool: usdcMoneyPoolTime[0].startedAt.format('yyyy.MM.DD'),
      endedMoneyPool: usdcMoneyPoolTime[0].endedAt.format('yyyy.MM.DD'),
    },
    DAI: {
      startedMoneyPool: daiMoneyPoolTime[0].startedAt.format('yyyy.MM.DD'),
      endedMoneyPool: daiMoneyPoolTime[0].endedAt.format('yyyy.MM.DD'),
    },
    USDT: {
      startedMoneyPool: tetherMoneyPoolTime[0].startedAt.format('yyyy.MM.DD'),
      endedMoneyPool: tetherMoneyPoolTime[0].endedAt.format('yyyy.MM.DD'),
    },
    BUSD: {
      startedMoneyPool: busdMoneyPoolTime[0].startedAt.format('yyyy.MM.DD'),
      endedMoneyPool: busdMoneyPoolTime[0].endedAt.format('yyyy.MM.DD'),
    },
  };

  const beforeMintedMoneypool = {
    DAI: { beforeMintedToken: rewardInfo.beforeMintedByDaiMoneypool },
    USDC: { beforeMintedToken: rewardInfo.beforeMintedByUsdcMoneypool },
    USDT: {
      beforeMintedToken: rewardInfo.beforeMintedByTetherMoneypool,
    },
    BUSD: {
      beforeMintedToken: rewardInfo.beforeMintedByBuscMoneypool,
    },
  };
  const mintedMoneypool = {
    DAI: { mintedToken: rewardInfo.mintedByDaiMoneypool },
    USDC: { mintedToken: rewardInfo.mintedByUsdcMoneypool },
    USDT: { mintedToken: rewardInfo.mintedByTetherMoneypool },
    BUSD: {
      mintedToken: rewardInfo.mintedByBusdMoneypool,
    },
  };

  const beforeTotalMintedByElStakingPool = useMemo(() => {
    return rewardInfo.beforeStakingPool.reduce((res, cur) => res + cur, 0);
  }, [rewardInfo.beforeStakingPool]);

  const totalMintedByElStakingPool = useMemo(() => {
    return rewardInfo.afterStakingPool.reduce((res, cur) => res + cur, 0);
  }, [rewardInfo.afterStakingPool]);

  const draw = () => {
    const dpr = window.devicePixelRatio;
    const canvas: HTMLCanvasElement | null = canvasRef.current;

    if (!headerRef.current) return;
    const headerY =
      headerRef.current.offsetTop +
      (document.body.clientWidth > 1190 ? 250 : 120);
    if (!canvas) return;
    canvas.width = document.body.clientWidth * dpr;
    canvas.height = document.body.clientHeight * dpr;
    const browserWidth = canvas.width / dpr + 40;
    const browserHeight = canvas.height / dpr;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;
    ctx.scale(dpr, dpr);

    if (mediaQuery === MediaQuery.Mobile) return;

    new DrawWave(ctx, browserWidth).drawOnPages(
      headerY,
      rewardType === Token.EL ? TokenColors.EL : TokenColors.ELFI,
      browserHeight,
      false,
      rewardType === 'LP' ? rewardType : undefined,
    );
  };

  const getAllStakedPositions = () => {
    if (!positionsByPoolId) return;
    setTotalStakedPositions(positionsByPoolId);
  };

  // total value of the steak in the pool.
  const calcTotalStakedLpToken = useCallback(() => {
    const daiElfiPoolTotalLiquidity =
      totalStakedPositions?.daiIncentive
        .filter(
          (incentive) =>
            incentive.id ===
            incentiveIds[lpStakingRound.daiElfiRound].daiIncentiveId,
        )[0]
        ?.incentivePotisions.reduce(
          (sum, current) => sum.add(current.position.liquidity),
          constants.Zero,
        ) || constants.Zero;

    const ethElfiPoolTotalLiquidity =
      totalStakedPositions?.wethIncentive
        .filter(
          (incentive) =>
            incentive.id ===
            incentiveIds[lpStakingRound.ethElfiRound].ethIncentiveId,
        )[0]
        ?.incentivePotisions.reduce(
          (sum, current) => sum.add(current.position.liquidity),
          constants.Zero,
        ) || constants.Zero;

    const daiElfiLiquidityToDollar =
      parseFloat(utils.formatEther(daiElfiPoolTotalLiquidity)) *
      pricePerDaiLiquidity;
    const ethElfiLiquidityToDollar =
      parseFloat(utils.formatEther(ethElfiPoolTotalLiquidity)) *
      pricePerEthLiquidity;

    setTotalLiquidity({
      ...totalLiquidity,
      daiElfiPoolTotalLiquidity: daiElfiLiquidityToDollar,
      ethElfiPoolTotalLiquidity: ethElfiLiquidityToDollar,
      daiElfiliquidityForApr: calcDaiElfiPoolApr(daiElfiLiquidityToDollar),
      ethElfiliquidityForApr: calcEthElfiPoolApr(ethElfiLiquidityToDollar),
    });
  }, [totalLiquidity, lpStakingRound, totalStakedPositions]);

  useEffect(() => {
    getAllStakedPositions();
  }, []);

  useEffect(() => {
    calcTotalStakedLpToken();
  }, [totalStakedPositions, lpStakingRound]);

  useEffect(() => {
    draw();
    window.addEventListener('resize', () => draw());

    return () => {
      window.removeEventListener('resize', () => draw());
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          width: '100%',
          top: 0,
          left: 0,
          zIndex: -1,
        }}
      />
      <div ref={headerRef} className="reward">
        {rewardType === 'deposit' ? (
          <div className="component__text-navigation">
            <p onClick={() => onClickHandler()} className="pointer">
              {t('dashboard.deposit')}
            </p>
            &nbsp;&nbsp;&gt;&nbsp;&nbsp;
            <p>{t('reward.reward_plan')}</p>
          </div>
        ) : (
          <div className="component__text-navigation">
            {`${t('staking.location_staking')} > `}
            <p onClick={() => onClickHandler()} className="pointer">
              &nbsp;&nbsp;
              {t('staking.token_staking', { stakedToken: rewardType })}
              &nbsp;&nbsp;
            </p>
            {` > ${t('reward.reward_plan')}`}
          </div>
        )}

        <>
          <div className="reward__token">
            <LazyImage src={ELFI} name="elfi" />
            <h2>{t('reward.deposit__reward_plan')}</h2>
            <div className="reward__token__elfi">
              {!poolDataLoading && poolData ? (
                <p>
                  <Trans
                    i18nKey="reward.elfi_price"
                    count={Math.round(poolData.latestPrice * 1000) / 1000}
                  />
                </p>
              ) : (
                <Skeleton width={50} height={40} />
              )}
            </div>
          </div>
          <section className="reward__container">
            <Suspense
              fallback={
                <div
                  style={{
                    marginTop: 50,
                    height: 300,
                    background: '#FFFFFF',
                  }}
                />
              }>
              {!subgraphLoading ? (
                reserveState.reserves
                  .filter((data) => {
                    if (
                      !data.id ||
                      data.id === '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
                    )
                      return;
                    return isSupportedReserve(
                      getTokenNameByAddress(data.id),
                      getMainnetType,
                    );
                  })
                  .map((reserve, index) => {
                    return (
                      <TokenDeposit
                        key={index}
                        idx={index}
                        reserve={reserve}
                        moneyPoolInfo={moneyPoolInfo}
                        beforeMintedMoneypool={
                          beforeMintedMoneypool[
                            getTokenNameByAddress(reserve.id)
                          ].beforeMintedToken <= 0
                            ? 0
                            : beforeMintedMoneypool[
                                getTokenNameByAddress(reserve.id)
                              ].beforeMintedToken
                        }
                        mintedMoneypool={
                          mintedMoneypool[getTokenNameByAddress(reserve.id)]
                            .mintedToken
                        }
                        depositRound={depositRound}
                        setDepositRound={setDepositRound}
                      />
                    );
                  })
              ) : (
                <Skeleton width={'100%'} height={330} />
              )}
            </Suspense>
          </section>
        </>

        {/* {rewardType === 'LP' ? (
          <>
            <div className="reward__token">
              <div className="reward__token__image-container">
                {[ELFI, ETH, DAI].map((tokenImage, _index, _array) => {
                  return (
                    <img
                      src={tokenImage}
                      style={{
                        zIndex: _array.length + 1 - _index,
                        left: _array.length * 10 - (_index + 2) * 10,
                      }}
                    />
                  );
                })}
              </div>
              <h2>{t('reward.token_staking__reward_plan', { token: 'LP' })}</h2>
            </div>
            <Suspense
              fallback={
                <div
                  style={{ marginTop: 150, height: 400, background: '#FFFFFF' }}
                />
              }>
              <LpStakingBox
                index={1}
                tvl={totalLiquidity.ethElfiPoolTotalLiquidity}
                apr={totalLiquidity.ethElfiliquidityForApr}
                token0={'ELFI'}
                firstTokenValue={{
                  total: ELFI_REWARD_PER_POOL,
                  start: rewardInfo.beforeElfiRewardByLp,
                  end: rewardInfo.elfiRewardByLp,
                }}
                token1={'ETH'}
                secondTokenValue={{
                  total: ethRewardByRound(lpStakingRound.ethElfiRound + 1),
                  start: rewardInfo.beforeEthRewardByLp,
                  end: rewardInfo.ethRewardByLp,
                }}
                currentRound={currentPhase}
                selectedRound={lpStakingRound.ethElfiRound}
                lpStakingRound={lpStakingRound}
                setLpStakingRound={setLpStakingRound}
              />
              <LpStakingBox
                index={1}
                tvl={totalLiquidity.daiElfiPoolTotalLiquidity}
                apr={totalLiquidity.daiElfiliquidityForApr}
                token0={'ELFI'}
                firstTokenValue={{
                  total: ELFI_REWARD_PER_POOL,
                  start: rewardInfo.beforeElfiRewardByLp,
                  end: rewardInfo.elfiRewardByLp,
                }}
                token1={'DAI'}
                secondTokenValue={{
                  total: DAI_REWARD_PER_POOL,
                  start: rewardInfo.beforeDaiRewardByLp,
                  end: rewardInfo.daiRewardByLp,
                }}
                currentRound={currentPhase}
                selectedRound={lpStakingRound.daiElfiRound}
                lpStakingRound={lpStakingRound}
                setLpStakingRound={setLpStakingRound}
              />
            </Suspense>
          </>
        ) : ['EL', 'ELFI'].includes(stakingType || 'EL') ? (
          <section className={`reward__${(stakingType || 'EL').toLowerCase()}`}>
            <Suspense
              fallback={
                <div
                  style={{ marginTop: 250, height: 400, background: '#FFFFFF' }}
                />
              }>
              <StakingBox
                loading={poolLoading}
                poolApr={poolApr}
                poolPrincipal={poolPrincipal}
                stakedRound={state.round}
                unit={rewardToken(stakingType || 'EL', getMainnetType)}
                start={
                  isEl
                    ? beforeTotalMintedByElStakingPool
                    : rewardInfo.beforeStakingPool
                }
                end={
                  isEl
                    ? totalMintedByElStakingPool
                    : rewardInfo.afterStakingPool
                }
                state={state}
                setState={setState}
                OrdinalNumberConverter={ordinalNumberConverter}
                stakedToken={stakingType || 'EL'}
                miningStart={isEl ? rewardInfo.beforeStakingPool : undefined}
                miningEnd={isEl ? rewardInfo.afterStakingPool : undefined}
              />
            </Suspense>
          </section>
        ) : (
         
        )} */}
      </div>
    </>
  );
};

export default RewardPlan;
