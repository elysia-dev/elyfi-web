import { useWeb3React } from '@web3-react/core';
import { BigNumber, constants, ethers, utils } from 'ethers';
import {
  useEffect,
  useContext,
  useState,
  useCallback,
  FunctionComponent,
} from 'react';
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

const LPStaking: FunctionComponent = () => {
  const { account, library } = useWeb3React();
  const { t } = useTranslation();
  const { txType, txWaiting } = useContext(TxContext);
  const { elfiPrice } = useContext(PriceContext);
  const { ethPool, daiPool } = useContext(UniswapPoolContext);
  const { ethPrice, daiPrice } = useContext(PriceContext);
  const [rewardVisibleModal, setRewardVisibleModal] = useState(false);
  const [stakingVisibleModal, setStakingVisibleModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [stakedPositions, setStakedPositions] = useState<Position[]>([]);
  const [nonStakePositions, setNonStakePositions] = useState<TokenInfo[]>([]);
  const [stakeToken, setStakeToken] = useState<Token.DAI | Token.ETH>();
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
      setStakedPositions(res.data.data.positions);
    });
  }, [stakedPositions]);

  const getWithoutStakePositions = useCallback(() => {
    LpTokenPoolSubgraph.getPositionsByOwner(account!).then((res) => {
      setNonStakePositions(res.data.data.positions);
    });
  }, [nonStakePositions]);

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
      stakedPositions.length === 0
    ) {
      getStakedPositions();
    }
  }, [account, txType, txWaiting]);

  useEffect(() => {
    if (txWaiting) return;
    getWithoutStakePositions();
    getRewardToRecive();
    getTotalLiquidity();
  }, [txWaiting]);

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
        nonStakePositions={nonStakePositions.filter((lpToken) => {
          const poolAddress =
            stakeToken === Token.ETH
              ? envs.ethElfiPoolAddress.toLowerCase()
              : envs.daiElfiPoolAddress.toLowerCase();
          return lpToken.pool.id.toLowerCase() === poolAddress;
        })}
      />
      <Header title={t('lpstaking.lp_token_staking')} />
      <section
        className="staking"
        style={{
          overflowX: 'hidden',
          padding: 3,
        }}>
        <div className="staking_detail_box">
          <div>
            <StakingTitle token0={Token.ELFI} token1={Token.ETH} />
            <DetailBox
              token0={Token.ELFI}
              token1={Token.ETH}
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
              token0={Token.ELFI}
              token1={Token.DAI}
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
          unstakeTokenId={unstakeTokenId}
          ethElfiStakedLiquidity={totalStakedLiquidity(envs.ethElfiPoolAddress)}
          daiElfiStakedLiquidity={totalStakedLiquidity(envs.daiElfiPoolAddress)}
          ethPoolTotalLiquidity={ethPoolTotalLiquidity}
          daiPoolTotalLiquidity={daiPoolTotalLiquidity}
        />
        <Reward
          rewardToReceive={rewardToReceive}
          onHandler={() => setRewardVisibleModal(true)}
        />
      </section>
    </>
  );
};

export default LPStaking;
