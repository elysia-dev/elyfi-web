import { useWeb3React } from '@web3-react/core';
import { BigNumber, constants, ethers, utils } from 'ethers';
import { useEffect, useContext, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
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
import useLpApr from 'src/hooks/useLpApy';
import UniswapPoolContext from 'src/contexts/UniswapPoolContext';
import RewardModal from 'src/components/LpStaking/RewardModal';
import DetailBox from 'src/components/LpStaking/DetailBox';
import StakingTitle from 'src/components/LpStaking/StakingTitle';
import Reward from 'src/components/LpStaking/Reward';
import StakingModal from 'src/components/LpStaking/StakingModal';
import RecentActivityType from 'src/enums/RecentActivityType';
import RewardTypes from 'src/core/types/RewardTypes';
import useUpdateExpectedReward from 'src/hooks/useUpdateExpectedReward';
import usePricePerLiquidity from 'src/hooks/usePricePerLiquidity';
import eth from 'src/assets/images/eth-color.png';
import dai from 'src/assets/images/dai.png';
import SelectRoundButton from 'src/components/LpStaking/SelectRoundButton';
import { lpUnixTimestamp } from 'src/core/data/lpStakingTime';
import getIncentiveId from 'src/utiles/getIncentiveId';

function LPStaking(): JSX.Element {
  const { account, library } = useWeb3React();
  const { t } = useTranslation();
  const { txType, txWaiting } = useContext(TxContext);
  const { elfiPrice } = useContext(PriceContext);
  const { ethPool, daiPool } = useContext(UniswapPoolContext);
  const { ethPrice, daiPrice } = useContext(PriceContext);
  const { pricePerDaiLiquidity, pricePerEthLiquidity } = usePricePerLiquidity();
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
  const currentRound =
    lpUnixTimestamp.findIndex((staking) => {
      const startedAt = moment
        .unix(staking.startedAt)
        .format('YYYY.MM.DD HH:mm:ss Z');
      const endedAt = moment
        .unix(staking.endedAt)
        .format('YYYY.MM.DD HH:mm:ss Z');
      return moment().isBetween(startedAt, endedAt);
    }) + 1 || 1;
  const [round, setRound] = useState(currentRound);

  const [incentiveIds, setIncentiveIds] = useState(getIncentiveId(round));

  const [unstakeTokenId, setUnstakeTokenId] = useState(0);
  const [rewardToReceive, setRewardToRecive] = useState<RewardTypes>({
    elfiReward: 0,
    ethReward: 0,
    daiReward: 0,
  });
  const { calcEthElfiPoolApr, calcDaiElfiPoolApr } = useLpApr();
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
  const staker = new ethers.Contract(
    envs.stakerAddress,
    stakerABI,
    library.getSigner(),
  );

  const getRewardToRecive = useCallback(async () => {
    try {
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
  }, [setRewardToRecive]);

  const getStakedPositions = useCallback(() => {
    StakerSubgraph.getPositionsByOwner(account!).then((res) => {
      setStakedPositions(
        res.data.data.positions.filter((position) => {
          return (
            position.incentivePotisions[0].incentive.id ===
            incentiveIds[round - 1]
          );
        }),
      );
    });
  }, [stakedPositions, round]);

  const getWithoutStakePositions = useCallback(() => {
    LpTokenPoolSubgraph.getPositionsByOwner(account!).then((res) => {
      setUnstakedPositions(res.data.data.positions);
    });
  }, [unstakedPositions]);

  const getTotalLiquidity = useCallback(() => {
    setIsLoading(true);
    StakerSubgraph.getStakedPositionsByPoolId(
      envs.ethElfiPoolAddress,
      envs.daiElfiPoolAddress,
    ).then((res) => {
      const daiElfiPoolTotalLiquidity =
        res.data.data.daiIncentive
          .filter((incentive) => incentive.id === incentiveIds[round - 1])[0]
          ?.incentivePotisions.reduce(
            (sum, current) => sum.add(current.position.liquidity),
            constants.Zero,
          ) || constants.Zero;

      const ethElfiPoolTotalLiquidity =
        res.data.data.wethIncentive
          .filter((incentive) => incentive.id === incentiveIds[round - 1])[0]
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
      setIsLoading(false);
    });
  }, [totalLiquidity, isLoading, round]);

  const totalStakedLiquidity = (poolAddress: string) => {
    return stakedPositions
      .filter(
        (position) =>
          position.staked &&
          position.incentivePotisions.some(
            (incentivePosition) =>
              incentivePosition.incentive.pool.toLowerCase() ===
                poolAddress.toLowerCase() &&
              incentivePosition.incentive.id === incentiveIds[round - 1],
          ),
      )
      .reduce((sum, current) => sum.add(current.liquidity), constants.Zero);
  };

  useEffect(() => {
    if (
      (txType === RecentActivityType.Deposit && !txWaiting) ||
      stakedPositions.length === 0
    ) {
      getStakedPositions();
    }
  }, [account, txType, txWaiting, round]);

  useEffect(() => {
    if (txWaiting) return;
    getStakedPositions();
    getWithoutStakePositions();
    getRewardToRecive();
    getTotalLiquidity();
  }, [txWaiting, round]);

  useEffect(() => {
    if (txType === RecentActivityType.Withdraw && !txWaiting) {
      setStakedPositions(
        stakedPositions.filter(
          (position) => position.tokenId !== unstakeTokenId,
        ),
      );
      setUnstakeTokenId(0);
    }
  }, [txType, txWaiting]);

  useEffect(() => {
    setExpecteReward(stakedPositions);
  }, [stakedPositions]);

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
    const interval = setInterval(() => {
      updateExpectedReward(
        stakedPositions,
        ethPoolTotalLiquidity,
        daiPoolTotalLiquidity,
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [expectedReward]);

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
          {lpUnixTimestamp.map((date, idx) => {
            return (
              <SelectRoundButton
                key={idx}
                round={idx + 1}
                setRound={() => setRound(idx + 1)}
              />
            );
          })}
        </div>
        <div className="staking_detail_box">
          <div>
            <StakingTitle token0={Token.ELFI} token1={Token.ETH} />
            <DetailBox
              tokens={{
                token0: Token.ELFI,
                token1: Token.ETH,
              }}
              totalLiquidity={totalLiquidity.ethElfiPoolTotalLiquidity}
              totalStakedLiquidity={totalStakedLiquidity(
                envs.ethElfiPoolAddress,
              )}
              apr={totalLiquidity.ethElfiliquidityForApr}
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
              totalLiquidity={totalLiquidity.daiElfiPoolTotalLiquidity}
              totalStakedLiquidity={totalStakedLiquidity(
                envs.daiElfiPoolAddress,
              )}
              apr={totalLiquidity.daiElfiliquidityForApr}
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
