import { useWeb3React } from '@web3-react/core';
import { BigNumber, constants, ethers, utils } from 'ethers';
import { useEffect, useContext, useState, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Header from 'src/components/Header';
import PriceContext from 'src/contexts/PriceContext';
import wave from 'src/assets/images/wave_elyfi.png';
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
import Reward from 'src/components/LpStaking/Reward';
import StakingModal from 'src/components/LpStaking/StakingModal';
import RecentActivityType from 'src/enums/RecentActivityType';
import RewardTypes from 'src/core/types/RewardTypes';
import useUpdateExpectedReward from 'src/hooks/useUpdateExpectedReward';
import eth from 'src/assets/images/eth-color.png';
import dai from 'src/assets/images/dai.png';
import RewardPlanButton from 'src/components/RewardPlan/RewardPlanButton';
import usePricePerLiquidity from 'src/hooks/usePricePerLiquidity';
import toOrdinalNumber from 'src/utiles/toOrdinalNumber';
import Guide from 'src/components/Guide';
import moment from 'moment';
import { lpRoundDate, lpUnixTimestamp } from 'src/core/data/lpStakingTime';
import getIncentiveId from 'src/utiles/getIncentive';
import usePositions from 'src/hooks/usePositions';
import useMediaQueryType from 'src/hooks/useMediaQueryType';
import MediaQuery from 'src/enums/MediaQuery';
import ReactGA from 'react-ga';
import ModalViewType from 'src/enums/ModalViewType';
import DrawWave from 'src/utiles/drawWave';
import TokenColors from 'src/enums/TokenColors';

function LPStaking(): JSX.Element {
  const { account, library } = useWeb3React();
  const { t, i18n } = useTranslation();
  const { txType, txWaiting } = useContext(TxContext);
  const { elfiPrice } = useContext(PriceContext);
  const { ethPool, daiPool } = useContext(UniswapPoolContext);
  const { ethPrice, daiPrice } = useContext(PriceContext);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const { pricePerDaiLiquidity, pricePerEthLiquidity } = usePricePerLiquidity();
  const { setExpecteReward, expectedReward, updateExpectedReward, isError } =
    useUpdateExpectedReward();
  const [rewardVisibleModal, setRewardVisibleModal] = useState(false);
  const [stakingVisibleModal, setStakingVisibleModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [stakedPositions, setStakedPositions] = useState<Position[]>([]);
  const { positions, fetchPositions } = usePositions(account);
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
  const { calcEthElfiPoolApr, calcDaiElfiPoolApr } = useLpApr();
  const [rewardToReceive, setRewardToRecive] = useState<RewardTypes>({
    elfiReward: 0,
    ethReward: 0,
    daiReward: 0,
  });
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

  const { value: mediaQuery } = useMediaQueryType();

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
      console.error(`${error}`);
    }
  }, [setRewardToRecive, account]);

  const filterPosition = (position: Position) => {
    return position.incentivePotisions.some((incentivePotision) =>
      incentivePotision.incentive.rewardToken.toLowerCase() ===
      envs.daiAddress.toLowerCase()
        ? incentivePotision.incentive.id.toLowerCase() ===
          incentiveIds[round - 1].daiIncentiveId
        : incentivePotision.incentive.id.toLowerCase() ===
          incentiveIds[round - 1].ethIncentiveId,
    );
  };

  const getStakedPositions = useCallback(() => {
    if (!account) return;
    StakerSubgraph.getPositionsByOwner(account!)
      .then((res) => {
        setStakedPositions(res.data.data.positions);
      })
      .catch((error) => {
        console.error(`${error}`);
      });
  }, [stakedPositions, account, incentiveIds]);

  const getAllStakedPositions = useCallback(() => {
    setIsLoading(true);
    StakerSubgraph.getIncentivesWithPositionsByPoolId(
      envs.ethElfiPoolAddress,
      envs.daiElfiPoolAddress,
    ).then((res) => {
      setTotalStakedPositions(res.data);
    });
  }, [totalLiquidity, isLoading, stakedPositions]);

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

  const draw = () => {
    const dpr = window.devicePixelRatio;
    const canvas: HTMLCanvasElement | null = canvasRef.current;

    if (!headerRef.current) return;
    const headerY =
      headerRef.current.offsetTop +
      (document.body.clientWidth > 1190 ? 90 : 15);
    if (!canvas) return;
    canvas.width = document.body.clientWidth * dpr;
    canvas.height = document.body.clientHeight * dpr;
    const browserWidth = canvas.width / dpr + 40;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;
    ctx.scale(dpr, dpr);

    new DrawWave(ctx, browserWidth).drawOnPages(
      headerY,
      TokenColors.ELFI,
      'LP',
    );
  };

  useEffect(() => {
    if (
      (txType === RecentActivityType.Deposit && !txWaiting) ||
      stakedPositions.length === 0 ||
      account
    ) {
      getStakedPositions();
    }
  }, [account, txType, txWaiting, round]);

  useEffect(() => {
    if (txWaiting) return;
    fetchPositions();
    getRewardToRecive();
    getAllStakedPositions();
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
    setExpecteReward(stakedPositions, round, incentiveIds);
  }, [account, stakedPositions, round]);

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
  }, [expectedReward, account]);

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
        unstakedPositions={positions.filter((position) => {
          const token0 = envs.governanceAddress;
          const token1 =
            stakeToken === Token.ETH ? envs.wEthAddress : envs.daiAddress;

          return (
            position.token0.toLowerCase() === token0.toLowerCase() &&
            position.token1.toLowerCase() === token1.toLowerCase()
          );
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

      <section className="staking">
        <div ref={headerRef} className="staking__lp__header">
          <h2>{t('lpstaking.lp_token_staking')}</h2>
          <p>{t('lpstaking.lp_token_staking__content')}</p>
          <div>
            {Array(3)
              .fill(0)
              .map((_x, index) => {
                return (
                  <div
                    key={`round_button_${index}`}
                    className={index + 1 === round ? 'active' : ''}
                    onClick={() => setRound(index + 1)}>
                    <p>
                      {t(
                        mediaQuery === MediaQuery.PC
                          ? 'staking.staking__nth'
                          : 'staking.nth--short',
                        {
                          nth: toOrdinalNumber(i18n.language, index + 1),
                        },
                      )}
                    </p>
                  </div>
                );
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
            totalLiquidity={totalLiquidity.ethElfiPoolTotalLiquidity}
            totalStakedLiquidity={totalStakedLiquidity(envs.ethElfiPoolAddress)}
            apr={totalLiquidity.ethElfiliquidityForApr}
            isLoading={isLoading}
            setModalAndSetStakeToken={() => {
              setStakingVisibleModal(true);
              ReactGA.modalview(
                Token.ETH + ModalViewType.StakingOrUnstakingModal,
              );
              setStakeToken(Token.ETH);
            }}
            round={round}
          />
          <DetailBox
            tokens={{
              token0: Token.ELFI,
              token1: Token.DAI,
            }}
            totalLiquidity={totalLiquidity.daiElfiPoolTotalLiquidity}
            totalStakedLiquidity={totalStakedLiquidity(envs.daiElfiPoolAddress)}
            apr={totalLiquidity.daiElfiliquidityForApr}
            isLoading={isLoading}
            setModalAndSetStakeToken={() => {
              setStakingVisibleModal(true);
              ReactGA.modalview(
                Token.DAI + ModalViewType.StakingOrUnstakingModal,
              );
              setStakeToken(Token.DAI);
            }}
            round={round}
          />
        </section>
        <section className="staking__lp__staked">
          <StakedLp
            stakedPositions={stakedPositions
              .filter((position) => position.staked)
              .filter((stakedPosition) => filterPosition(stakedPosition))}
            setUnstakeTokenId={setUnstakeTokenId}
            ethElfiStakedLiquidity={totalStakedLiquidity(
              envs.ethElfiPoolAddress,
            )}
            daiElfiStakedLiquidity={totalStakedLiquidity(
              envs.daiElfiPoolAddress,
            )}
            expectedReward={expectedReward}
            totalExpectedReward={totalExpectedReward}
            isError={isError}
            round={round}
            isLoading={isLoading}
          />
        </section>

        <section className="staking__lp__reward">
          <Reward
            rewardToReceive={rewardToReceive}
            onHandler={() => {
              setRewardVisibleModal(true);
              ReactGA.modalview(ModalViewType.LPStakingIncentiveModal);
            }}
          />
        </section>
      </section>
    </>
  );
}

export default LPStaking;
