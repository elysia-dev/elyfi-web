import { constants, utils } from 'ethers';
import moment from 'moment';
import envs from 'src/core/envs';
import {
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import LpStakingBox from 'src/components/RewardPlan/LpStakingBox';
import StakingBox from 'src/components/RewardPlan/StakingBox';
import TokenDeposit from 'src/components/RewardPlan/TokenDeposit';
import PriceContext from 'src/contexts/PriceContext';
import UniswapPoolContext from 'src/contexts/UniswapPoolContext';
import {
  daiMoneyPoolTime,
  tetherMoneyPoolTime,
  busdMoneyPoolTime,
} from 'src/core/data/moneypoolTimes';
import { roundTimes } from 'src/core/data/stakingRoundTimes';
import {
  DAI_REWARD_PER_POOL,
  ELFI_REWARD_PER_POOL,
  ETH_REWARD_PER_POOL,
} from 'src/core/data/stakings';
import {
  ETH_REWARD_PER_POOL_2,
  ETH_REWARD_PER_POOL_3,
} from 'src/core/utils/calcLpReward';
import Token from 'src/enums/Token';
import useStakingRoundData from 'src/hooks/useStakingRoundData';
import { ordinalNumberConverter } from 'src/utiles/ordinalNumberConverter';
import ELFI from 'src/assets/images/ELFI.png';
import ETH from 'src/assets/images/eth-color.png';
import DAI from 'src/assets/images/dai.png';
import useLpApr from 'src/hooks/useLpApy';
import StakerSubgraph, { IPoolPosition } from 'src/clients/StakerSubgraph';
import getIncentiveId from 'src/utiles/getIncentive';
import usePricePerLiquidity from 'src/hooks/usePricePerLiquidity';
import { lpRoundDate } from 'src/core/data/lpStakingTime';
import DrawWave from 'src/utiles/drawWave';
import TokenColors from 'src/enums/TokenColors';
import MediaQuery from 'src/enums/MediaQuery';
import useMediaQueryType from 'src/hooks/useMediaQueryType';
import SubgraphContext from 'src/contexts/SubgraphContext';
import isSupportedReserve from 'src/core/utils/isSupportedReserve';
import MainnetContext from 'src/contexts/MainnetContext';
import getTokenNameByAddress from 'src/core/utils/getTokenNameByAddress';
import useCalcReward from 'src/hooks/useCalcReward';
import { rewardToken } from 'src/utiles/stakingReward';

const RewardPlan: FunctionComponent = () => {
  const { t, i18n } = useTranslation();
  const { stakingType } = useParams<{ stakingType: string }>();
  const history = useHistory();
  const { latestPrice, ethPool, daiPool } = useContext(UniswapPoolContext);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const { ethPrice } = useContext(PriceContext);
  const { data: getSubgraphData } = useContext(SubgraphContext);
  const { type: getMainnetType } = useContext(MainnetContext);
  const current = moment();
  const { value: mediaQuery } = useMediaQueryType();

  const isEl = stakingType === 'EL';
  const stakingRoundDate = roundTimes(stakingType, getMainnetType);

  const currentPhase = useMemo(() => {
    return stakingRoundDate.filter(
      (round) => current.diff(round.startedAt) >= 0,
    ).length;
  }, [current]);
  const { state: rewardInfo } = useCalcReward(stakingType);

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
    history.goBack();
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
    stakingType,
    rewardToken(stakingType, getMainnetType),
  );

  const moneyPoolInfo = {
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
    USDT: {
      beforeMintedToken: rewardInfo.beforeMintedByTetherMoneypool,
    },
    BUSD: {
      beforeMintedToken: rewardInfo.beforeMintedByBuscMoneypool,
    },
  };
  const mintedMoneypool = {
    DAI: { mintedToken: rewardInfo.mintedByDaiMoneypool },
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

    if (mediaQuery === MediaQuery.Mobile) {
      new DrawWave(ctx, browserWidth).drawMobileOnPages(
        headerY,
        TokenColors.ELFI,
        browserHeight,
        false,
        stakingType === 'LP' ? stakingType : undefined,
      );
      return;
    }

    new DrawWave(ctx, browserWidth).drawOnPages(
      headerY,
      stakingType === Token.EL ? TokenColors.EL : TokenColors.ELFI,
      browserHeight,
      false,
      stakingType === 'LP' ? stakingType : undefined,
    );
  };

  const getAllStakedPositions = () => {
    StakerSubgraph.getIncentivesWithPositionsByPoolId(
      envs.lpStaking.ethElfiPoolAddress,
      envs.lpStaking.daiElfiPoolAddress,
    ).then((res) => {
      setTotalStakedPositions(res.data);
    });
  };

  // total value of the steak in the pool.
  const calcTotalStakedLpToken = useCallback(() => {
    const daiElfiPoolTotalLiquidity =
      totalStakedPositions?.data.daiIncentive
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
      totalStakedPositions?.data.wethIncentive
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
        {stakingType === 'deposit' ? (
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
              {t('staking.token_staking', { stakedToken: stakingType })}
              &nbsp;&nbsp;
            </p>
            {` > ${t('reward.reward_plan')}`}
          </div>
        )}

        {stakingType === 'LP' ? (
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
                total:
                  lpStakingRound.ethElfiRound <= 1
                    ? lpStakingRound.ethElfiRound === 2
                      ? ETH_REWARD_PER_POOL_3
                      : ETH_REWARD_PER_POOL_2
                    : ETH_REWARD_PER_POOL,
                start: rewardInfo.beforeEthRewardByLp,
                end: rewardInfo.ethRewardByLp,
              }}
              currentRound={currentPhase}
              selectedRound={lpStakingRound.ethElfiRound}
              lpStakingRound={lpStakingRound}
              setLpStakingRound={setLpStakingRound}
              ethReward={[ETH_REWARD_PER_POOL, ETH_REWARD_PER_POOL_2]}
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
          </>
        ) : ['EL', 'ELFI'].includes(stakingType) ? (
          <section className={`reward__${stakingType.toLowerCase()}`}>
            <StakingBox
              loading={poolLoading}
              poolApr={poolApr}
              poolPrincipal={poolPrincipal}
              stakedRound={state.round}
              unit={rewardToken(stakingType, getMainnetType)}
              start={
                isEl
                  ? beforeTotalMintedByElStakingPool
                  : rewardInfo.beforeStakingPool
              }
              end={
                isEl ? totalMintedByElStakingPool : rewardInfo.afterStakingPool
              }
              state={state}
              setState={setState}
              OrdinalNumberConverter={ordinalNumberConverter}
              stakedToken={stakingType}
              miningStart={isEl ? rewardInfo.beforeStakingPool : undefined}
              miningEnd={isEl ? rewardInfo.afterStakingPool : undefined}
            />
          </section>
        ) : (
          <>
            <div className="reward__token">
              <img src={ELFI} />
              <h2>{t('reward.deposit__reward_plan')}</h2>
              <div className="reward__token__elfi">
                <p>
                  <Trans
                    i18nKey="reward.elfi_price"
                    count={Math.round(latestPrice * 1000) / 1000}
                  />
                </p>
              </div>
            </div>
            <section className="reward__container">
              {getSubgraphData.reserves
                .filter((data) =>
                  isSupportedReserve(
                    getTokenNameByAddress(data.id),
                    getMainnetType,
                  ),
                )
                .map((reserve, index) => {
                  return (
                    <TokenDeposit
                      key={index}
                      idx={index}
                      reserve={reserve}
                      moneyPoolInfo={moneyPoolInfo}
                      beforeMintedMoneypool={
                        beforeMintedMoneypool[getTokenNameByAddress(reserve.id)]
                          .beforeMintedToken <= 0
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
                })}
            </section>
          </>
        )}
      </div>
    </>
  );
};

export default RewardPlan;
