import {
  useContext,
  useEffect,
  useRef,
  Suspense,
  useState,
  lazy,
  useCallback,
} from 'react';
import MediaQuery from 'src/enums/MediaQuery';
import TokenColors from 'src/enums/TokenColors';
import useMediaQueryType from 'src/hooks/useMediaQueryType';
import DrawWave from 'src/utiles/drawWave';
import { useTranslation, Trans } from 'react-i18next';
import { useWeb3React } from '@web3-react/core';
import moment from 'moment';
import MainnetContext from 'src/contexts/MainnetContext';
import MainnetType from 'src/enums/MainnetType';
import Token from 'src/enums/Token';
import { constants, ethers, utils } from 'ethers';

import DetailBox from 'src/components/LpStaking/DetailBox';
import StakedLp from 'src/components/LpStaking/StakedLp';
import Reward from 'src/components/LpStaking/Reward';
import Position from 'src/core/types/Position';
import envs from 'src/core/envs';
import getIncentiveId from 'src/utiles/getIncentive';
import useUpdateExpectedReward from 'src/hooks/useUpdateExpectedReward';
import useSWR from 'swr';
import {
  positionsByOwnerFetcher,
  positionsByOwnerQuery,
  positionsByPoolIdFetcher,
  positionsByPoolIdQuery,
} from 'src/clients/StakerSubgraph';
import RewardTypes from 'src/core/types/RewardTypes';
import RewardModal from 'src/components/LpStaking/RewardModal';
import ReactGA from 'react-ga';
import ModalViewType from 'src/enums/ModalViewType';
import { lpRoundDate, lpUnixTimestamp } from 'src/core/data/lpStakingTime';
import TxContext from 'src/contexts/TxContext';
import RecentActivityType from 'src/enums/RecentActivityType';
import toOrdinalNumber from 'src/utiles/toOrdinalNumber';
import usePricePerLiquidity from 'src/hooks/usePricePerLiquidity';
import stakerABI from 'src/core/abi/StakerABI.json';

const LegacyStaking: React.FC = () => {
  const { account, library } = useWeb3React();
  const { t, i18n } = useTranslation();
  const { type: getMainnetType } = useContext(MainnetContext);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const { value: mediaQuery } = useMediaQueryType();
  const { txType, txWaiting } = useContext(TxContext);

  const [transactionWait, setTransactionWait] = useState<boolean>(false);

  const [round, setRound] = useState(4);
  const incentiveIds = getIncentiveId();
  const [stakedPositions, setStakedPositions] = useState<Position[]>([]);
  const [unstakeTokenId, setUnstakeTokenId] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [rewardVisibleModal, setRewardVisibleModal] = useState(false);

  const [rewardToReceive, setRewardToRecive] = useState<RewardTypes>({
    elfiReward: 0,
    ethReward: 0,
    daiReward: 0,
  });

  const [totalExpectedReward, setTotalExpectedReward] = useState<{
    totalElfi: number;
    totalEth: number;
    totalDai: number;
  }>({
    totalElfi: 0,
    totalEth: 0,
    totalDai: 0,
  });

  const { data: positionsByPoolId } = useSWR(
    positionsByPoolIdQuery,
    positionsByPoolIdFetcher,
  );

  const { pricePerDaiLiquidity, pricePerEthLiquidity } = usePricePerLiquidity();

  const { setExpecteReward, expectedReward, isError } =
    useUpdateExpectedReward();

  const { data: positionsByOwner } = useSWR(
    positionsByOwnerQuery(account || ''),
    positionsByOwnerFetcher,
  );
  const getStakedPositions = useCallback(() => {
    if (!account || !positionsByOwner) return;
    setStakedPositions(positionsByOwner.positions);
    setIsLoading(false);
  }, [stakedPositions, account, incentiveIds, positionsByOwner]);

  const accountNull: boolean =
    rewardToReceive.elfiReward !== 0 && stakedPositions.length !== 0;

  const filterPosition = (position: Position) => {
    return position.incentivePotisions.some((incentivePotision) =>
      incentivePotision.incentive.rewardToken.toLowerCase() ===
      envs.token.daiAddress.toLowerCase()
        ? incentivePotision.incentive.id.toLowerCase() ===
          incentiveIds[round - 1].daiIncentiveId
        : incentivePotision.incentive.id.toLowerCase() ===
          incentiveIds[round - 1].ethIncentiveId,
    );
  };

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
        envs.lpStaking.stakerAddress,
        stakerABI,
        library.getSigner(),
      );
      setRewardToRecive({
        ...rewardToReceive,
        daiReward: parseFloat(
          utils.formatEther(
            await staker.rewards(envs.token.daiAddress, account),
          ),
        ),
        ethReward: parseFloat(
          utils.formatEther(
            await staker.rewards(envs.token.wEthAddress, account),
          ),
        ),
        elfiReward: parseFloat(
          utils.formatEther(
            await staker.rewards(envs.token.governanceAddress, account),
          ),
        ),
      });
    } catch (error) {
      console.error(`${error}`);
    }
  }, [setRewardToRecive, account]);

  useEffect(() => {
    try {
      setTotalExpectedReward({
        totalElfi: expectedReward.reduce(
          (current, reward) => current + reward.elfiReward,
          0,
        ),
        totalEth: expectedReward.reduce(
          (current, reward) => current + reward.ethReward,
          0,
        ),
        totalDai: expectedReward.reduce(
          (current, reward) => current + reward.daiReward,
          0,
        ),
      });
    } catch (error) {
      console.error(error);
    }
  }, [expectedReward, account]);

  useEffect(() => {
    setExpecteReward(stakedPositions, round, incentiveIds);
  }, [account, stakedPositions, round]);

  useEffect(() => {
    if (
      (txType === RecentActivityType.Deposit && !txWaiting) ||
      stakedPositions.length === 0 ||
      account
    ) {
      getStakedPositions();
    }
  }, [account, txType, txWaiting, round, positionsByOwner]);

  useEffect(() => {
    if (txWaiting) return;
    getRewardToRecive();
  }, [txWaiting, account, positionsByPoolId]);

  const draw = () => {
    const dpr = window.devicePixelRatio;
    const canvas: HTMLCanvasElement | null = canvasRef.current;

    if (!headerRef.current) return;
    if (!canvas) return;
    canvas.width = document.body.clientWidth * dpr;
    canvas.height = document.body.clientHeight * dpr;
    const headerY =
      headerRef.current.offsetTop + document.body.clientWidth > 1190
        ? canvas.height / 3 / dpr
        : 90;
    const browserWidth = canvas.width / dpr + 40;
    const browserHeight = canvas.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    if (mediaQuery === MediaQuery.Mobile) return;

    new DrawWave(ctx, browserWidth).drawOnPages(
      headerY,
      TokenColors.EL,
      browserHeight,
      true,
    );
  };

  useEffect(() => {
    draw();
    window.addEventListener('scroll', () => draw());
    window.addEventListener('resize', () => draw());

    return () => {
      window.removeEventListener('scroll', () => draw());
      window.removeEventListener('resize', () => draw());
    };
  }, [document.body.clientHeight]);

  return (
    <div className="legacy">
      <section className="lp">
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
        <Suspense fallback={null}>
          <RewardModal
            visible={rewardVisibleModal}
            closeHandler={() => {
              setTransactionWait(false);
              setRewardVisibleModal(false);
            }}
            rewardToReceive={rewardToReceive}
            transactionWait={transactionWait}
            setTransactionWait={() => setTransactionWait(true)}
          />
        </Suspense>
        <section className="lp__header legacy__header">
          <h2>이전 LP 스테이킹 프로그램</h2>
          <p>
            이전 ELFI 스테이킹 프로그램은 2021.07.27 ~ 2022.04.17 KST 까지 7회차
            동안 진행했습니다.
            <br />이 기간동안 스테이킹한 물량이 남아있는 사용자만 확인할 수
            있습니다. 언스테이킹 및 보상 수령을 원하는 사용자는 지갑 연결을
            해주세요.
          </p>
          {getMainnetType === MainnetType.Ethereum && accountNull && (
            <div className="lp__header__button">
              {Array(4)
                .fill(0)
                .map((_x, index) => {
                  return (
                    <div
                      key={index}
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
          )}
          <div ref={headerRef} />
        </section>
        <section className="legacy__lp">
          {accountNull ? (
            <>
              <section className="staking__lp__detail-box">
                <DetailBox
                  tokens={{
                    token0: Token.ELFI,
                    token1: Token.ETH,
                  }}
                  totalStakedLiquidity={totalStakedLiquidity(
                    envs.lpStaking.ethElfiPoolAddress,
                  )}
                  isLoading={
                    !!positionsByPoolId &&
                    !!pricePerDaiLiquidity &&
                    !!pricePerEthLiquidity
                  }
                  round={round}
                />
                <DetailBox
                  tokens={{
                    token0: Token.ELFI,
                    token1: Token.DAI,
                  }}
                  totalStakedLiquidity={totalStakedLiquidity(
                    envs.lpStaking.daiElfiPoolAddress,
                  )}
                  isLoading={
                    !!positionsByPoolId &&
                    !!pricePerDaiLiquidity &&
                    !!pricePerEthLiquidity
                  }
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
                    envs.lpStaking.ethElfiPoolAddress,
                  )}
                  daiElfiStakedLiquidity={totalStakedLiquidity(
                    envs.lpStaking.daiElfiPoolAddress,
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
            </>
          ) : (
            <>
              <div className="legacy__body--right">
                {!account ? (
                  <div className="legacy__body__undefined-data">
                    <h2>지갑 연결이 필요합니다</h2>
                  </div>
                ) : (
                  !accountNull && (
                    <div className="legacy__body__undefined-data">
                      <h2>스테이킹한 ELFI 토큰이 없습니다</h2>
                    </div>
                  )
                )}
              </div>
            </>
          )}
        </section>
      </section>
    </div>
  );
};

export default LegacyStaking;
