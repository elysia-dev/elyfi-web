import { useWeb3React } from '@web3-react/core';
import { BigNumber, constants, ethers, utils } from 'ethers';
import { useEffect, useContext, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import Header from 'src/components/Header';
import PriceContext from 'src/contexts/PriceContext';
import envs from 'src/core/envs';
import StakedLp from 'src/components/LpStaking/StakedLp';
import StakerSubgraph, { IPoolPosition } from 'src/clients/StakerSubgraph';
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
import { lpRoundDate, lpUnixTimestamp } from 'src/core/data/lpStakingTime';
import getIncentiveId from 'src/utiles/getIncentiveId';
import positionManagerABI from 'src/core/abi/NonfungiblePositionManager.json';

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
  const [totalStakedPositions, setTotalStakedPositions] = useState<
    IPoolPosition | undefined
  >();
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

  const incentiveIds = getIncentiveId();

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

  const filterPosition = (position: Position) =>
    position.incentivePotisions.some((incentivePotision) =>
      incentivePotision.incentive.rewardToken.toLowerCase() ===
      envs.daiAddress.toLowerCase()
        ? incentivePotision.incentive.id.toLowerCase() ===
          incentiveIds[round - 1].daiIncentiveId
        : incentivePotision.incentive.id.toLowerCase() ===
          incentiveIds[round - 1].ethIncentiveId,
    );

  const getStakedPositions = useCallback(() => {
    StakerSubgraph.getPositionsByOwner(account!).then((res) => {
      setStakedPositions(res.data.data.positions);
    });
  }, [incentiveIds]);

  const getWithoutStakePositions = useCallback(() => {
    LpTokenPoolSubgraph.getPositionsByOwner(account!).then((res) => {
      setUnstakedPositions(res.data.data.positions);
    });
  }, [unstakedPositions]);

  const getAllStakedPositions = useCallback(() => {
    setIsLoading(true);
    StakerSubgraph.getIncentivesWithPositionsByPoolId(
      envs.ethElfiPoolAddress,
      envs.daiElfiPoolAddress,
    ).then((res) => {
      setTotalStakedPositions(res.data);
    });
  }, [isLoading, stakedPositions]);

  // total value of the steak in the pool.
  const calcTotalStakedLpToken = useCallback(() => {
    const daiElfiPoolTotalLiquidity =
      totalStakedPositions?.data.daiIncentive
        .filter(
          (incentive) =>
            incentive.id === incentiveIds[round - 1].daiIncentiveId,
        )[0]
        ?.incentivePotisions.reduce(
          (sum, current) => sum.add(current.position.liquidity),
          constants.Zero,
        ) || constants.Zero;

    const ethElfiPoolTotalLiquidity =
      totalStakedPositions?.data.wethIncentive
        .filter(
          (incentive) =>
            incentive.id === incentiveIds[round - 1].ethIncentiveId,
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
    setIsLoading(false);
  }, [totalLiquidity, round, totalStakedPositions]);

  // total value of stake by the account user
  const totalStakedLiquidity = (poolAddress: string) => {
    const positionsByIncentiveId = stakedPositions.filter(
      (position) => position.staked && filterPosition(position),
    );
    const totalLiquidity = positionsByIncentiveId
      .filter((position) =>
        position.incentivePotisions.some(
          (incentivePosition) =>
            incentivePosition.incentive.pool.toLowerCase() ===
            poolAddress.toLowerCase(),
        ),
      )
      .reduce((sum, current) => sum.add(current.liquidity), constants.Zero);

    return totalLiquidity;
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
    getWithoutStakePositions();
    getRewardToRecive();
    getAllStakedPositions();
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

  useEffect(() => {
    setExpecteReward(stakedPositions, round, incentiveIds);
  }, [stakedPositions, round]);

  useEffect(() => {
    calcTotalStakedLpToken();
  }, [totalStakedPositions, round]);

  useEffect(() => {
    try {
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
      if (
        !moment().isBetween(
          lpRoundDate[round - 1].startedAt,
          lpRoundDate[round - 1].endedAt,
        )
      )
        return;

      const interval = setInterval(() => {
        updateExpectedReward(
          stakedPositions,
          ethPoolTotalLiquidity,
          daiPoolTotalLiquidity,
          incentiveIds[round - 1],
        );
      }, 1000);
      return () => clearInterval(interval);
    } catch (error) {
      console.error(error);
    }
  }, [expectedReward]);

  // useEffect(() => {
  //   (async () => {
  //     const positionContract = new ethers.Contract(
  //       envs.nonFungiblePositionAddress,
  //       positionManagerABI,
  //       library.getSigner(),
  //     );

  //     const getBalance = positionContract.interface.getFunction('balanceOf');

  //     const encode = positionContract.interface.encodeFunctionData(getBalance, [
  //       account,
  //     ]);

  //     const balance = await positionContract.balanceOf(account);

  //     console.log('sasasas', utils.formatUnits(balance, 0));

  //     for (let j = 0; j < balance; j++) {
  //       const i = await positionContract.tokenOfOwnerByIndex(account, j);
  //       console.log('i', utils.formatUnits(i, 0));
  //       const position = await positionContract.positions(
  //         utils.formatUnits(i, 0),
  //       );
  //       console.log('position', position);
  //     }

  //     const testOwner = '0x405bEF2743379b356F2176c68eBe83DE90811d01';
  //     const startBlock = 9600000;

  //     // get token Ids from nft manager
  //     const res = await positionContract.queryFilter(
  //       positionContract.filters.Transfer(testOwner, staker.address),
  //       startBlock,
  //     );
  //     // console.log('11111111111', res);

  //     // get stake & unstake event from stakers
  //     const promises = res.map(async (item) => {
  //       // console.log(item.args?.tokenId);

  //       const res2 = await staker.queryFilter(
  //         staker.filters.TokenStaked(item.args?.tokenId),
  //         startBlock,
  //       );

  //       // console.log('2222222222', res2);

  //       const res3 = await staker.queryFilter(
  //         staker.filters.TokenUnstaked(item.args?.tokenId),
  //         startBlock,
  //       );
  //       // console.log('333333', res3);

  //     });
  //     const a = await Promise.all(promises);
  //     console.log(a);
  //   })();
  // }, []);

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
        round={round}
      />
      <Header
        title={t('lpstaking.lp_token_staking')}
        round={round}
        setRound={setRound}
        stakingType={'LP'}
      />
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
              round={round}
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
              round={round}
            />
          </div>
        </div>
        <StakedLp
          stakedPositions={stakedPositions
            .filter((position) => position.staked)
            .filter((stakedPosition) => filterPosition(stakedPosition))}
          setUnstakeTokenId={setUnstakeTokenId}
          ethElfiStakedLiquidity={totalStakedLiquidity(envs.ethElfiPoolAddress)}
          daiElfiStakedLiquidity={totalStakedLiquidity(envs.daiElfiPoolAddress)}
          expectedReward={expectedReward}
          totalExpectedReward={totalExpectedReward}
          round={round}
          isLoading={isLoading}
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
