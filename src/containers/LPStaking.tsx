import { useWeb3React } from '@web3-react/core';
import { BigNumber, constants, ethers, utils } from 'ethers';
import { useEffect, useContext, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Header from 'src/components/Header';
import PriceContext from 'src/contexts/PriceContext';
import envs from 'src/core/envs';
import StakedLp from 'src/components/LpStaking/StakedLp';
import StakerSubgraph from 'src/clients/StakerSubgraph';
import Position, { TokenInfo } from 'src/core/types/Position';
import LpTokenPoolSubgraph from 'src/clients/LpTokenPoolSubgraph';
import Token from 'src/enums/Token';
import TxContext from 'src/contexts/TxContext';
import stakerABI from 'src/core/abi/StakerABI.json';
import { useDaiPositionLpApr, useEthPositionLpApr } from 'src/hooks/useLpApy';
import UniswapPoolContext from 'src/contexts/UniswapPoolContext';
import RewardModal from 'src/components/LpStaking/RewardModal';
import DetailBox from 'src/components/LpStaking/DetailBox';
import StakingTitle from 'src/components/LpStaking/StakingTitle';
import Reward from 'src/components/LpStaking/Reward';
import StakingModal from 'src/components/LpStaking/StakingModal';
import RecentActivityType from 'src/enums/RecentActivityType';
import RewardTypes from 'src/core/types/RewardTypes';
import useUpdateExpectedReward from 'src/hooks/useUpdateExpectedReward';
import eth from 'src/assets/images/eth-color.png';
import dai from 'src/assets/images/dai.png';
import RewardPlanButton from 'src/components/RewardPlan/RewardPlanButton';
import { formatDecimalFracionDigit, toCompact } from 'src/utiles/formatters';
import Skeleton from 'react-loading-skeleton';
import CountUp from 'react-countup';
import usePricePerLiquidity from 'src/hooks/usePricePerLiquidity';

function LPStaking(): JSX.Element {
  const { account, library } = useWeb3React();
  const { t } = useTranslation();
  const { txType, txWaiting } = useContext(TxContext);
  const { elfiPrice } = useContext(PriceContext);
  const { ethPool, daiPool } = useContext(UniswapPoolContext);
  const { ethPrice, daiPrice } = useContext(PriceContext);
  const { setExpecteReward, expectedReward, updateExpectedReward } =
    useUpdateExpectedReward();
  const [rewardVisibleModal, setRewardVisibleModal] = useState(false);
  const [stakingVisibleModal, setStakingVisibleModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [stakedPositions, setStakedPositions] = useState<Position[]>([]);
  const [unstakedPositions, setUnstakedPositions] = useState<TokenInfo[]>([]);
  const [stakeToken, setStakeToken] = useState<Token.DAI | Token.ETH>();
  const [totalExpectedReward, setTotalExpectedReward] = useState<{
    beforeTotalElfi: number;
    totalElfi: number;
    beforeTotalEth: number;
    totalEth: number;
    beforeTotalDai: number;
    totalDai: number;
  }>({
    beforeTotalElfi: 0,
    totalElfi: 0,
    beforeTotalEth: 0,
    totalEth: 0,
    beforeTotalDai: 0,
    totalDai: 0,
  });
  const ethPoolTotalLiquidity =
    ethPool.stakedToken0 * elfiPrice + ethPool.stakedToken1 * ethPrice;
  const daiPoolTotalLiquidity =
    daiPool.stakedToken0 * elfiPrice + daiPool.stakedToken1 * daiPrice;
  const [unstakeTokenId, setUnstakeTokenId] = useState(0);
  const [rewardToReceive, setRewardToRecive] = useState<RewardTypes>({
    elfiReward: 0,
    ethReward: 0,
    daiReward: 0,
  });
  const ethPoolApr = useEthPositionLpApr();
  const daiPoolApr = useDaiPositionLpApr();
  const [totalLiquidity, setTotalLiquidity] = useState<{
    daiElfiPoolTotalLiquidity: number;
    ethElfiPoolTotalLiquidity: number;
    ethElfiliquidityForApr: BigNumber;
    daiElfiliquidityForApr: BigNumber;
  }>({
    daiElfiPoolTotalLiquidity: 0,
    ethElfiPoolTotalLiquidity: 0,
    ethElfiliquidityForApr: constants.Zero,
    daiElfiliquidityForApr: constants.Zero,
  });
  const { pricePerDaiLiquidity, pricePerEthLiquidity } = usePricePerLiquidity();
  const [selectStaking, setSelectStaking] = useState(0) // 추후 current staking 값 계산해서 연결 필요!!
  
  const getRewardToRecive = useCallback(async () => {
    try {
      if (!account) {
        setRewardToRecive({
          ...rewardToReceive,
          daiReward: 0,
          ethReward: 0,
          elfiReward: 0,
        });
        return;
      }
      const staker = new ethers.Contract(
        envs.stakerAddress,
        stakerABI,
        library.getSigner(),
      );

      setRewardToRecive({
        ...rewardToReceive,
        daiReward: parseFloat(
          utils.formatEther(await staker.rewards(envs.daiAddress, account)),
        ),
        ethReward: parseFloat(
          utils.formatEther(await staker.rewards(envs.wEthAddress, account)),
        ),
        elfiReward: parseFloat(
          utils.formatEther(
            await staker.rewards(envs.governanceAddress, account),
          ),
        ),
      });
    } catch (error) {
      console.log(error);
    }
  }, [setRewardToRecive, account]);

  const getStakedPositions = useCallback(() => {
    if (!account) return;
    StakerSubgraph.getPositionsByOwner(account!).then((res) => {
      // console.log(res)
      setStakedPositions(res.data.data.positions);
    });
  }, [stakedPositions, account]);
  
  const getWithoutStakePositions = useCallback(() => {
    if (!account) return;
    LpTokenPoolSubgraph.getPositionsByOwner(account!).then((res) => {
      setUnstakedPositions(res.data.data.positions);
    });
  }, [unstakedPositions, account]);

  const getTotalLiquidity = useCallback(() => {
    setIsLoading(true);
    StakerSubgraph.getStakedPositionsByPoolId(
      envs.ethElfiPoolAddress,
      envs.daiElfiPoolAddress,
    ).then((res) => {
      const daiElfiPoolTotalLiquidity =
        res.data.data.daiIncentive[0]?.incentivePotisions.reduce(
          (sum, current) => sum.add(current.position.liquidity),
          constants.Zero,
        ) || constants.Zero;

      const ethElfiPoolTotalLiquidity =
        res.data.data.wethIncentive[0]?.incentivePotisions.reduce(
          (sum, current) => sum.add(current.position.liquidity),
          constants.Zero,
        ) || constants.Zero;
      setTotalLiquidity({
        ...totalLiquidity,
        daiElfiPoolTotalLiquidity: parseFloat(
          utils.formatEther(daiElfiPoolTotalLiquidity),
        ),
        ethElfiPoolTotalLiquidity: parseFloat(
          utils.formatEther(ethElfiPoolTotalLiquidity),
        ),
        daiElfiliquidityForApr: daiElfiPoolTotalLiquidity,
        ethElfiliquidityForApr: ethElfiPoolTotalLiquidity,
      });
      setIsLoading(false);
    });
  }, [totalLiquidity, isLoading]);

  const totalStakedLiquidity = (poolAddress: string) => {
    return stakedPositions
      .filter(
        (position) =>
          position.staked &&
          position.incentivePotisions.some(
            (incentivePosition) =>
              incentivePosition.incentive.pool.toLowerCase() ===
              poolAddress.toLowerCase(),
          ),
      )
      .reduce((sum, current) => sum.add(current.liquidity), constants.Zero);
  };

  useEffect(() => {
    if (
      (txType === RecentActivityType.Deposit && !txWaiting) ||
      stakedPositions.length === 0 ||
      account
    ) {
      getStakedPositions();
    }
  }, [account, txType, txWaiting]);

  useEffect(() => {
    if (txWaiting) return;
    getWithoutStakePositions();
    getRewardToRecive();
    getTotalLiquidity();
  }, [txWaiting, account]);

  useEffect(() => {
    if (txType === RecentActivityType.Withdraw && !txWaiting) {
      setStakedPositions(
        stakedPositions.filter(
          (position) => position.tokenId !== unstakeTokenId,
        ),
      );
      setUnstakeTokenId(0);
    }
  }, [txType, txWaiting, account]);

  useEffect(() => {
    setExpecteReward(stakedPositions);
  }, [stakedPositions, account]);

  useEffect(() => {
    setTotalExpectedReward({
      ...totalExpectedReward,
      beforeTotalElfi: totalExpectedReward.totalElfi,
      totalElfi: expectedReward.reduce(
        (current, reward) => current + reward.elfiReward,
        0,
      ),
      beforeTotalEth: totalExpectedReward.totalEth,
      totalEth: expectedReward.reduce(
        (current, reward) => current + reward.ethReward,
        0,
      ),
      beforeTotalDai: totalExpectedReward.totalDai,
      totalDai: expectedReward.reduce(
        (current, reward) => current + reward.daiReward,
        0,
      ),
    });
    if (expectedReward.length === 0) return;
    const inter = setInterval(() => {
      updateExpectedReward(
        stakedPositions,
        ethPoolTotalLiquidity,
        daiPoolTotalLiquidity,
      );
    }, 1000);
    return () => clearInterval(inter);
  }, [expectedReward, account]);

  return (
    <>
      <RewardModal
        visible={rewardVisibleModal}
        closeHandler={() => setRewardVisibleModal(false)}
        rewardToReceive={rewardToReceive}
      />
      <StakingModal
        visible={stakingVisibleModal}
        closeHandler={() => setStakingVisibleModal(false)}
        token0={Token.ELFI}
        token1={stakeToken}
        unstakedPositions={unstakedPositions.filter((lpToken) => {
          const poolAddress =
            stakeToken === Token.ETH
              ? envs.ethElfiPoolAddress.toLowerCase()
              : envs.daiElfiPoolAddress.toLowerCase();
          return lpToken.pool.id.toLowerCase() === poolAddress;
        })}
        tokenImg={stakeToken === Token.ETH ? eth : dai}
        stakingPoolAddress={
          stakeToken === Token.ETH
            ? envs.ethElfiPoolAddress
            : envs.daiElfiPoolAddress
        }
        rewardTokenAddress={
          stakeToken === Token.ETH ? envs.wEthAddress : envs.daiAddress
        }
      />
      <section className="staking">
        <div className="staking__lp__header">
          <h2>
            {t('lpstaking.lp_token_staking')}
          </h2>
          <p>
            ELFI-ETH, ELFI-DAI 풀에 유동성을 공급하고 보상 토큰을 받아가세요!
          </p>
          <div>
            {["차 스테이킹", "차 스테이킹", "차 스테이킹"].map((data, index) => {
              return (
                <div
                  className={index === selectStaking ? "active" : ""}
                  onClick={() => setSelectStaking(index)}
                >
                  <p>
                    {(index + 1) + data}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
        <RewardPlanButton stakingType={'LP'} />
        <section className="staking__lp__detail-box">
          <DetailBox
            tokens={{
              token0: Token.ELFI,
              token1: Token.ETH,
            }}
            totalLiquidity={ethPoolTotalLiquidity}
            totalStakedLiquidity={totalStakedLiquidity(
              envs.ethElfiPoolAddress,
            )}
            apr={ethPoolApr}
            isLoading={isLoading}
            setModalAndSetStakeToken={() => {
              setStakingVisibleModal(true);
              setStakeToken(Token.ETH);
            }}
          />
          <DetailBox
            tokens={{
              token0: Token.ELFI,
              token1: Token.DAI,
            }}
            totalLiquidity={daiPoolTotalLiquidity}
            totalStakedLiquidity={totalStakedLiquidity(
              envs.daiElfiPoolAddress,
            )}
            apr={daiPoolApr}
            isLoading={isLoading}
            setModalAndSetStakeToken={() => {
              setStakingVisibleModal(true);
              setStakeToken(Token.DAI);
            }}
          />
        </section>
        <section className="staking__lp__staked">
          <StakedLp
            stakedPositions={stakedPositions.filter(
              (position) => position.staked,
            )}
            setUnstakeTokenId={setUnstakeTokenId}
            ethElfiStakedLiquidity={totalStakedLiquidity(envs.ethElfiPoolAddress)}
            daiElfiStakedLiquidity={totalStakedLiquidity(envs.daiElfiPoolAddress)}
            expectedReward={expectedReward}
            totalExpectedReward={totalExpectedReward}
          />
        </section>
        {stakedPositions.length > 0 || !account ? (
          <section className="staking__lp__staked__reward">
            <div className="staking__lp__staked__reward__total-liquidity">
              <h2>
                {t('lpstaking.staked_total_liquidity')}
              </h2>
              <h2 className="amount">
                {toCompact(
                  parseFloat(utils.formatEther(totalStakedLiquidity(envs.ethElfiPoolAddress))) *
                    pricePerEthLiquidity +
                    parseFloat(utils.formatEther(totalStakedLiquidity(envs.daiElfiPoolAddress))) *
                      pricePerDaiLiquidity,
                )}
              </h2>
            </div>
            <div className="staking__lp__staked__reward__amount">
              <h2>{t('lpstaking.staked_total_expected_reward')}</h2>
              <div>
                <CountUp
                  className="bold"
                  start={totalExpectedReward.beforeTotalElfi}
                  end={totalExpectedReward.totalElfi}
                  formattingFn={(number) => {
                    return formatDecimalFracionDigit(number, 2);
                  }}
                  duration={1}
                  decimals={4}
                />
                <h2 className="staking__lp__staked__reward__amount__unit">
                  {Token.ELFI}
                </h2>
              </div>
              <div>
                <CountUp
                  className="bold"
                  start={totalExpectedReward.beforeTotalEth}
                  end={totalExpectedReward.totalEth}
                  formattingFn={(number) => {
                    return formatDecimalFracionDigit(number, 2);
                  }}
                  duration={1}
                  decimals={4}
                />
                <h2 className="staking__lp__staked__reward__amount__unit">
                  {Token.ETH}
                </h2>
              </div>
              <div>
                <CountUp
                  className="bold"
                  start={totalExpectedReward.beforeTotalDai}
                  end={totalExpectedReward.totalDai}
                  formattingFn={(number) => {
                    return formatDecimalFracionDigit(number, 2);
                  }}
                  duration={1}
                  decimals={4}
                />
                <h2 className="staking__lp__staked__reward__amount__unit">
                  {Token.DAI}
                </h2>
              </div>
            </div>
          </section>
        ) : (
          <section className="staking__lp__staked__reward">
            <div className="staking__lp__staked__reward__total-liquidity">
              <h2>
                {t('lpstaking.staked_total_liquidity')}
              </h2>
              <h2 className="amount">
                -
              </h2>
            </div>
            <div className="staking__lp__staked__reward__amount">
              <h2>{t('lpstaking.staked_total_expected_reward')}</h2>
              <div>
                <span>-</span>
                <h2 className="staking__lp__staked__reward__amount__unit">
                  {Token.ELFI}
                </h2>
              </div>
              <div>
                <span>-</span>
                <h2 className="staking__lp__staked__reward__amount__unit">
                  {Token.ETH}
                </h2>
              </div>
              <div>
                <span>-</span>
                <h2 className="staking__lp__staked__reward__amount__unit">
                  {Token.DAI}
                </h2>
              </div>
            </div>
          </section>
        )}

        <section className="staking__lp__reward">
          <Reward
            rewardToReceive={rewardToReceive}
            onHandler={() => setRewardVisibleModal(true)}
          />
        </section>
      </section>
    </>
  );
}

export default LPStaking;
