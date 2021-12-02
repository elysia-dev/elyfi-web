import { utils } from 'ethers';
import moment from 'moment';
import {
  FunctionComponent,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
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
} from 'src/core/utils/calcLpReward';
import calcMintedAmounts from 'src/core/utils/calcMintedAmounts';
import {
  calcMintedByDaiMoneypool,
  calcMintedByTetherMoneypool,
} from 'src/core/utils/calcMintedByDaiMoneypool';
import Token from 'src/enums/Token';
import { useDaiPositionLpApr, useEthPositionLpApr } from 'src/hooks/useLpApy';
import useStakingRoundData from 'src/hooks/useStakingRoundData';
import { ordinalNumberConverter } from 'src/utiles/ordinalNumberConverter';
import ELFI from 'src/assets/images/ELFI.png';

const RewardPlan: FunctionComponent = () => {
  const { t } = useTranslation();
  const { stakingType } = useParams<{ stakingType: string }>();
  const history = useHistory();
  const { latestPrice, ethPool, daiPool } = useContext(UniswapPoolContext);
  const { ethPrice } = useContext(PriceContext);
  const { reserves } = useContext(ReservesContext);
  const daiPoolApr = useDaiPositionLpApr();
  const ethPoolApr = useEthPositionLpApr();
  const current = moment();
  const currentPhase = useMemo(() => {
    return stakingRoundTimes.filter(
      (round) => current.diff(round.startedAt) >= 0,
    ).length;
  }, [current]);

  const onClickHandler = () => {
    history.goBack();
  };

  const [state, setState] = useState({
    elStaking: currentPhase - 1,
    currentElfiLevel: currentPhase - 1,
  });
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
    beforeMintedByElStakingPool: [0, 0, 0, 0],
    mintedByElStakingPool: calcMintedAmounts(
      parseFloat(utils.formatEther(ELFIPerDayOnELStakingPool)),
    ),
    beforeDaiRewardByElFiStakingPool: [0, 0, 0, 0],
    daiRewardByElFiStakingPool: calcMintedAmounts(
      parseFloat(utils.formatEther(DAIPerDayOnELFIStakingPool)),
    ),
    beforeMintedByDaiMoneypool: 0,
    mintedByDaiMoneypool: calcMintedByDaiMoneypool(),
    beforeTetherRewardByElFiStakingPool: [0, 0, 0, 0],
    tetherRewardByElFiStakingPool: calcMintedAmounts(
      Number(utils.formatEther(TETHERPerDayOnELFIStakingPool)),
    ),
    beforeMintedByTetherMoneypool: 0,
    mintedByTetherMoneypool: calcMintedByTetherMoneypool(),
    beforeTotalElfiRewardByLp: 0,
    totalElfiRewardByLp: calcElfiRewardByLp(),
    beforeElfiRewardByLp: 0,
    elfiRewardByLp: calcElfiRewardByLp(),
    beforeDaiRewardByLp: 0,
    daiRewardByLp: calcDaiRewardByLp(),
    beforeEthRewardByLp: 0,
    ethRewardByLp: calcEthRewardByLp(),
  });
  const totalMiningValue = [3000000, 1583333];
  const startMoneyPool = [
    moneyPoolStartedAt.format('yyyy.MM.DD'),
    '2021.10.08',
  ];
  const beforeMintedMoneypool = [
    amountData.beforeMintedByDaiMoneypool,
    amountData.beforeMintedByTetherMoneypool,
  ];
  const mintedMoneypool = [
    amountData.mintedByDaiMoneypool,
    amountData.mintedByTetherMoneypool,
  ];

  const beforeTotalMintedByElStakingPool = useMemo(() => {
    return amountData.beforeMintedByElStakingPool.reduce(
      (res, cur) => res + cur,
      0,
    );
  }, [amountData.beforeMintedByElStakingPool]);

  const totalMintedByElStakingPool = useMemo(() => {
    return amountData.mintedByElStakingPool.reduce((res, cur) => res + cur, 0);
  }, [amountData.mintedByElStakingPool]);

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
        beforeTotalElfiRewardByLp: amountData.elfiRewardByLp * 2,
        totalElfiRewardByLp: calcElfiRewardByLp() * 2,
        beforeElfiRewardByLp: amountData.elfiRewardByLp,
        elfiRewardByLp: calcElfiRewardByLp(),
        beforeDaiRewardByLp: amountData.daiRewardByLp,
        daiRewardByLp: calcDaiRewardByLp(),
        beforeEthRewardByLp: amountData.ethRewardByLp,
        ethRewardByLp: calcEthRewardByLp(),
      });
    }, 2000);
    return () => {
      clearInterval(interval);
    };
  }, [amountData]);

  return (
    <>
      <div
        className="reward"
      >
        {stakingType === 'deposit' ? (
          <div className="component__text-navigation">
            <p onClick={() => onClickHandler()} className="pointer">
              {t('dashboard.deposit')}
            </p>
            &nbsp;&gt;&nbsp;
            <p>
              {t('reward.reward_plan')}
            </p>
          </div>
        ) : (
          <div className="component__text-navigation">
            {`${t('staking.location_staking')} > `}
            <p onClick={() => onClickHandler()}>
              {t('staking.token_staking', { stakedToken: stakingType })}
            </p>
            {` > ${t('reward.reward_plan')}`}
          </div>
        )}
        <div className="reward__token">
          <img src={ELFI} />
          <h2>
            예치 보상 플랜
          </h2>
          <div className="reward__token__elfi">
            <p>
              ELFI Price : $ 0.1
            </p>
          </div>
        </div>
        {/* {stakingType === 'LP' ? (
          <>
            {' '}
            <LpStakingBox
              index={1}
              tvl={
                ethPool.stakedToken0 * latestPrice +
                ethPool.stakedToken1 * ethPrice
              }
              apr={ethPoolApr}
              token0={'ELFI'}
              firstTokenValue={{
                total: ELFI_REWARD_PER_POOL,
                start: amountData.beforeElfiRewardByLp,
                end: amountData.elfiRewardByLp,
              }}
              token1={'ETH'}
              secondTokenValue={{
                total: ETH_REWARD_PER_POOL,
                start: amountData.beforeEthRewardByLp,
                end: amountData.ethRewardByLp,
              }}
            />
            <LpStakingBox
              index={1}
              tvl={daiPool.stakedToken0 * latestPrice + daiPool.stakedToken1}
              apr={daiPoolApr}
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
            />
          </>
        ) : stakingType === 'ELFI' ? (
          <section className="jreward__dai">
            <div className="jreward__elfi-staking jcontainer">
              <StakingBox
                nth={ordinalNumberConverter(state.currentElfiLevel + 1)}
                loading={elfiPoolLoading}
                poolApr={elfiPoolApr}
                poolPrincipal={elfiPoolPrincipal}
                staking={state.currentElfiLevel}
                unit={'DAI'}
                start={
                  amountData.beforeDaiRewardByElFiStakingPool[
                    state.currentElfiLevel
                  ]
                }
                end={
                  amountData.daiRewardByElFiStakingPool[state.currentElfiLevel]
                }
                state={state}
                setState={setState}
              />
            </div>
          </section>
        ) : stakingType === 'EL' ? (
          <section className="jreward__elfi">
            <div className="jreward__el-staking container">
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
                miningStart={
                  amountData.beforeMintedByElStakingPool[state.elStaking]
                }
                miningEnd={amountData.mintedByElStakingPool[state.elStaking]}
                currentPhase={currentPhase}
                OrdinalNumberConverter={ordinalNumberConverter}
              />
            </div>
          </section>
        ) : ( */}
          <section className="reward__container">
            {reserves.map((reserve, index) => {
              return (
                <TokenDeposit
                  index={index}
                  reserve={reserve}
                  startMoneyPool={startMoneyPool}
                  totalMiningValue={totalMiningValue}
                  beforeMintedMoneypool={beforeMintedMoneypool}
                  mintedMoneypool={mintedMoneypool}
                />
              );
            })}
          </section>
        {/* )} */}
      </div>
    </>
  );
};

export default RewardPlan;
