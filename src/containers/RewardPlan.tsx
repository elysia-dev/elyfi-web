import { constants, utils } from 'ethers';
import moment from 'moment';
import envs from 'src/core/envs';
import wave from 'src/assets/images/wave_elyfi.png';
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
import ReservesContext from 'src/contexts/ReservesContext';
import UniswapPoolContext from 'src/contexts/UniswapPoolContext';
import { moneyPoolStartedAt } from 'src/core/data/moneypoolTimes';
import stakingRoundTimes from 'src/core/data/stakingRoundTimes';
import {
  DAIPerDayOnELFIStakingPool,
  DAI_REWARD_PER_POOL,
  ELFIPerDayOnELStakingPool,
  ELFI_REWARD_PER_POOL,
  ETH_REWARD_PER_POOL,
  TETHERPerDayOnELFIStakingPool,
} from 'src/core/data/stakings';
import {
  calcDaiRewardByLp,
  calcElfiRewardByLp,
  calcEthRewardByLp,
  ETH_REWARD_PER_POOL_2,
} from 'src/core/utils/calcLpReward';
import calcMintedAmounts from 'src/core/utils/calcMintedAmounts';
import {
  calcMintedByDaiMoneypool,
  calcMintedByTetherMoneypool,
} from 'src/core/utils/calcMintedByDaiMoneypool';
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
import { lpRoundDate, lpUnixTimestamp } from 'src/core/data/lpStakingTime';

const RewardPlan: FunctionComponent = () => {
  const { t } = useTranslation();
  const { stakingType } = useParams<{ stakingType: string }>();
  const history = useHistory();
  const { latestPrice, ethPool, daiPool } = useContext(UniswapPoolContext);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const { ethPrice } = useContext(PriceContext);
  const { reserves } = useContext(ReservesContext);
  const current = moment();
  const currentPhase = useMemo(() => {
    return stakingRoundTimes.filter(
      (round) => current.diff(round.startedAt) >= 0,
    ).length;
  }, [current]);

  const lpCurrentPhase = useMemo(() => {
    return lpRoundDate.filter((round) => current.diff(round.startedAt) >= 0)
      .length;
  }, [current]);

  const onClickHandler = () => {
    history.goBack();
  };

  const [state, setState] = useState({
    elStaking: currentPhase - 1,
    currentElfiLevel: currentPhase - 1,
  });

  const [lpStakingRound, setLpStakingRound] = useState({
    daiElfiRound: lpCurrentPhase - 1,
    ethElfiRound: lpCurrentPhase - 1,
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
    totalPrincipal: elPoolPrincipal,
    apr: elPoolApr,
    loading: elPoolLoading,
  } = useStakingRoundData(state.elStaking, Token.EL, Token.ELFI);
  const {
    totalPrincipal: elfiPoolPrincipal,
    apr: elfiPoolApr,
    loading: elfiPoolLoading,
  } = useStakingRoundData(state.currentElfiLevel, Token.ELFI, Token.DAI);
  const [amountData, setAmountData] = useState({
    beforeMintedByElStakingPool: [0, 0, 0, 0, 0, 0],
    mintedByElStakingPool: calcMintedAmounts(
      parseFloat(utils.formatEther(ELFIPerDayOnELStakingPool)),
    ),
    beforeDaiRewardByElFiStakingPool: [0, 0, 0, 0, 0, 0],
    daiRewardByElFiStakingPool: calcMintedAmounts(
      parseFloat(utils.formatEther(DAIPerDayOnELFIStakingPool)),
    ),
    beforeMintedByDaiMoneypool: 0,
    mintedByDaiMoneypool: calcMintedByDaiMoneypool(),
    beforeTetherRewardByElFiStakingPool: [0, 0, 0],
    tetherRewardByElFiStakingPool: calcMintedAmounts(
      parseFloat(utils.formatEther(TETHERPerDayOnELFIStakingPool)),
    ),
    beforeMintedByTetherMoneypool: 0,
    mintedByTetherMoneypool: calcMintedByTetherMoneypool(),
    beforeElfiRewardByLp: [0, 0, 0],
    elfiRewardByLp: calcElfiRewardByLp(),
    beforeDaiRewardByLp: [0, 0, 0],
    daiRewardByLp: calcDaiRewardByLp(),
    beforeEthRewardByLp: [0, 0, 0],
    ethRewardByLp: calcEthRewardByLp(lpStakingRound.ethElfiRound),
  });

  const moneyPoolInfo = {
    DAI: {
      totalMiningValue: 3000000,
      startMoneyPool: moneyPoolStartedAt.format('yyyy.MM.DD'),
    },
    USDT: { totalMiningValue: 1583333, startMoneyPool: '2021.10.08' },
  };
  const totalMiningValue = [3000000, 1583333];
  // const startMoneyPool = [
  //   moneyPoolStartedAt.format('yyyy.MM.DD'),
  //   '2021.10.08',
  // ];
  const beforeMintedMoneypool = {
    DAI: { beforeMintedToken: amountData.beforeMintedByDaiMoneypool },
    USDT: {
      beforeMintedToken: amountData.beforeMintedByTetherMoneypool,
    },
  };
  const mintedMoneypool = {
    DAI: { mintedToken: amountData.mintedByDaiMoneypool },
    USDT: { mintedToken: amountData.mintedByTetherMoneypool },
  };

  const beforeTotalMintedByElStakingPool = useMemo(() => {
    return amountData.beforeMintedByElStakingPool.reduce(
      (res, cur) => res + cur,
      0,
    );
  }, [amountData.beforeMintedByElStakingPool]);

  const totalMintedByElStakingPool = useMemo(() => {
    return amountData.mintedByElStakingPool.reduce((res, cur) => res + cur, 0);
  }, [amountData.mintedByElStakingPool]);

  const draw = () => {
    const dpr = window.devicePixelRatio;
    const canvas: HTMLCanvasElement | null = canvasRef.current;

    if (!headerRef.current) return;
    const headerY =
      headerRef.current.offsetTop +
      (document.body.clientWidth > 1190 ? 200 : 120);
    if (!canvas) return;
    canvas.width = document.body.clientWidth * dpr;
    canvas.height = document.body.clientHeight * dpr;
    const browserWidth = canvas.width / dpr + 40;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;
    ctx.scale(dpr, dpr);

    ctx.strokeStyle = stakingType === Token.EL ? '#3679B5' : '#00BFFF';
    ctx.beginPath();
    ctx.moveTo(0, headerY * 1.5);
    ctx.bezierCurveTo(
      browserWidth / 5,
      headerY * 1.2,
      browserWidth / 5,
      headerY * 1.6,
      browserWidth / 2,
      headerY * 1.55,
    );
    ctx.bezierCurveTo(
      browserWidth / 1.2,
      headerY * 1.5,
      browserWidth / 1.3,
      headerY * 1.15,
      browserWidth,
      headerY * 1.5,
    );
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, headerY * 1.6);
    ctx.bezierCurveTo(
      browserWidth / 5,
      headerY * 1.07,
      browserWidth / 5,
      headerY * 1.7,
      browserWidth / 2,
      headerY * 1.6,
    );
    ctx.bezierCurveTo(
      browserWidth / 1.2,
      headerY * 1.45,
      browserWidth / 1.3,
      headerY * 1.15,
      browserWidth,
      headerY * 1.6,
    );
    ctx.stroke();

    // circle
    ctx.strokeStyle =
      stakingType === Token.EL
        ? '#3679B5'
        : stakingType === 'LP'
        ? '#F9AE19'
        : '#00BFFF';
    ctx.beginPath();
    ctx.fillStyle = '#ffffff';
    ctx.moveTo(browserWidth / 7 + 10, headerY * 1.39);
    ctx.arc(browserWidth / 7, headerY * 1.39, 10, 0, Math.PI * 2);

    ctx.moveTo(browserWidth / 3 + 10, headerY * 1.52);
    ctx.arc(browserWidth / 3, headerY * 1.52, 10, 0, Math.PI * 2);

    ctx.moveTo(browserWidth / 1.46 + 5, headerY * 1.475);
    ctx.arc(browserWidth / 1.46, headerY * 1.475, 5, 0, Math.PI * 2);

    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle =
      stakingType === Token.EL
        ? '#3679B5'
        : stakingType === 'LP'
        ? '#627EEA'
        : '#00BFFF';
    ctx.moveTo(browserWidth / 7.8 + 5, headerY * 1.43);
    ctx.arc(browserWidth / 7.8, headerY * 1.43, 5, 0, Math.PI * 2);
    ctx.stroke();

    ctx.moveTo(browserWidth / 1.5 + 10, headerY * 1.49);
    ctx.arc(browserWidth / 1.5, headerY * 1.49, 10, 0, Math.PI * 2);

    ctx.moveTo(browserWidth / 1.18 + 10, headerY * 1.36);
    ctx.arc(browserWidth / 1.18, headerY * 1.36, 10, 0, Math.PI * 2);

    ctx.fill();

    ctx.stroke();
  };

  const getAllStakedPositions = () => {
    StakerSubgraph.getIncentivesWithPositionsByPoolId(
      envs.ethElfiPoolAddress,
      envs.daiElfiPoolAddress,
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
    const interval = setInterval(() => {
      setAmountData({
        beforeMintedByElStakingPool: amountData.mintedByElStakingPool,
        mintedByElStakingPool: calcMintedAmounts(
          parseFloat(utils.formatEther(ELFIPerDayOnELStakingPool)),
        ),
        beforeDaiRewardByElFiStakingPool: amountData.daiRewardByElFiStakingPool,
        daiRewardByElFiStakingPool: calcMintedAmounts(
          parseFloat(utils.formatEther(DAIPerDayOnELFIStakingPool)),
        ),
        beforeMintedByDaiMoneypool: amountData.mintedByDaiMoneypool,
        mintedByDaiMoneypool: calcMintedByDaiMoneypool(),
        beforeTetherRewardByElFiStakingPool:
          amountData.tetherRewardByElFiStakingPool,
        tetherRewardByElFiStakingPool: calcMintedAmounts(
          Number(utils.formatEther(TETHERPerDayOnELFIStakingPool)),
        ),
        beforeMintedByTetherMoneypool: amountData.mintedByTetherMoneypool,
        mintedByTetherMoneypool: calcMintedByTetherMoneypool(),
        beforeElfiRewardByLp: amountData.elfiRewardByLp,
        elfiRewardByLp: calcElfiRewardByLp(),
        beforeDaiRewardByLp: amountData.daiRewardByLp,
        daiRewardByLp: calcDaiRewardByLp(),
        beforeEthRewardByLp: amountData.ethRewardByLp,
        ethRewardByLp: calcEthRewardByLp(lpUnixTimestamp.length),
      });
    }, 2000);
    return () => {
      clearInterval(interval);
    };
  }, [amountData]);

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
                start: amountData.beforeElfiRewardByLp,
                end: amountData.elfiRewardByLp,
              }}
              token1={'ETH'}
              secondTokenValue={{
                total:
                  lpStakingRound.ethElfiRound === 1
                    ? ETH_REWARD_PER_POOL_2
                    : ETH_REWARD_PER_POOL,
                start: amountData.beforeEthRewardByLp,
                end: amountData.ethRewardByLp,
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
                start: amountData.beforeElfiRewardByLp,
                end: amountData.elfiRewardByLp,
              }}
              token1={'DAI'}
              secondTokenValue={{
                total: DAI_REWARD_PER_POOL,
                start: amountData.beforeDaiRewardByLp,
                end: amountData.daiRewardByLp,
              }}
              currentRound={currentPhase}
              selectedRound={lpStakingRound.daiElfiRound}
              lpStakingRound={lpStakingRound}
              setLpStakingRound={setLpStakingRound}
            />
          </>
        ) : stakingType === 'ELFI' ? (
          <section className="reward__elfi">
            <StakingBox
              nth={ordinalNumberConverter(state.currentElfiLevel + 1)}
              loading={elfiPoolLoading}
              poolApr={elfiPoolApr}
              poolPrincipal={elfiPoolPrincipal}
              staking={state.currentElfiLevel}
              unit={'DAI'}
              start={amountData.beforeDaiRewardByElFiStakingPool}
              end={amountData.daiRewardByElFiStakingPool}
              state={state}
              setState={setState}
              OrdinalNumberConverter={ordinalNumberConverter}
            />
          </section>
        ) : stakingType === 'EL' ? (
          <section className="reward__el">
            <StakingBox
              nth={ordinalNumberConverter(state.elStaking + 1)}
              loading={elPoolLoading}
              poolApr={elPoolApr}
              poolPrincipal={elPoolPrincipal}
              staking={state.elStaking}
              unit={'ELFI'}
              start={beforeTotalMintedByElStakingPool}
              end={totalMintedByElStakingPool}
              state={state}
              setState={setState}
              miningStart={amountData.beforeMintedByElStakingPool}
              miningEnd={amountData.mintedByElStakingPool}
              currentPhase={currentPhase}
              OrdinalNumberConverter={ordinalNumberConverter}
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
              {reserves.map((reserve, index) => {
                const token =
                  reserve.id === envs.daiAddress ? Token.DAI : Token.USDT;
                return (
                  <TokenDeposit
                    key={index}
                    reserve={reserve}
                    moneyPoolInfo={moneyPoolInfo}
                    beforeMintedMoneypool={
                      beforeMintedMoneypool[token].beforeMintedToken <= 0
                        ? 0
                        : beforeMintedMoneypool[token].beforeMintedToken
                    }
                    mintedMoneypool={mintedMoneypool[token].mintedToken}
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
