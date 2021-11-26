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
import UniswapButton from 'src/components/LpStaking/UniswapButton';

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
      alert(error);
    }
  }, [setRewardToRecive, account]);

  const getStakedPositions = useCallback(() => {
    if (!account) return;
    StakerSubgraph.getPositionsByOwner(account!).then((res) => {
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
      <Header title={t('lpstaking.lp_token_staking')} />
      <section
        className="staking"
        style={{
          overflowX: 'hidden',
          padding: 3,
        }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <UniswapButton
            linkLocation={'left'}
            token0={Token.ELFI}
            token1={Token.ETH}
          />
          <div
            style={{
              width: 20,
            }}
          />
          <UniswapButton
            linkLocation={'right'}
            token0={Token.ELFI}
            token1={Token.DAI}
          />
        </div>
        <div>
          {`${t('staking.location_staking')} > `}
          {t('staking.token_staking', { stakedToken: 'LP' })}
        </div>
        <RewardPlanButton stakingType={'LP'} />
        <div className="staking_detail_box">
          <div>
            <StakingTitle token0={Token.ELFI} token1={Token.ETH} />
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
          </div>
          <div />
          <div>
            <StakingTitle token0={Token.ELFI} token1={Token.DAI} />
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
          </div>
        </div>
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
        <Reward
          rewardToReceive={rewardToReceive}
          onHandler={() => setRewardVisibleModal(true)}
        />
      </section>
    </>
  );
}

export default LPStaking;
