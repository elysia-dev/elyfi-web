import {
  lazy,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useWeb3React } from '@web3-react/core';
import { constants, providers } from 'ethers';
import Skeleton from 'react-loading-skeleton';
import CountUp from 'react-countup';
import { formatEther } from 'ethers/lib/utils';
import {
  formatCommaSmall,
  formatSixFracionDigit,
  toCompactForBignumber,
  toPercentWithoutSign,
} from 'src/utiles/formatters';
import { StakingPoolV2factory } from '@elysia-dev/elyfi-v1-sdk';
import Token from 'src/enums/Token';
import { useTranslation } from 'react-i18next';
import ReactGA from 'react-ga';
import useMediaQueryType from 'src/hooks/useMediaQueryType';
import MediaQuery from 'src/enums/MediaQuery';
import DrawWave from 'src/utiles/drawWave';
import TokenColors from 'src/enums/TokenColors';
import MainnetContext from 'src/contexts/MainnetContext';
import MainnetType from 'src/enums/MainnetType';
import useCurrentChain from 'src/hooks/useCurrentChain';
import { isWrongNetwork } from 'src/utiles/isWrongNetwork';
import StakingModalType from 'src/enums/StakingModalType';
import { rewardPerDayByToken } from 'src/utiles/stakingReward';
import calcExpectedReward from 'src/core/utils/calcExpectedReward';

import elfi from 'src/assets/images/token/ELFI.svg';
import ModalViewType from 'src/enums/ModalViewType';
import envs from 'src/core/envs';
import useStakingFetchRoundDataV2 from './hooks/useStakingFetchRoundDataV2';
import useStakingRoundDataV2 from './hooks/useStakingRoundDataV2';
import CurrentStakingInfo from './CurrentStakingInfo';

const ElfiTitle = lazy(() => import('src/components/Staking/ElfiTitle'));

const ClaimStakingRewardModalV2 = lazy(
  () => import('src/components/Staking/modal/ClaimStakingRewardModalV2'),
);
const StakingModalV2 = lazy(
  () => import('src/components/Staking/modal/StakingModalV2'),
);
const TransactionConfirmModal = lazy(
  () => import('src/components/Modal/TransactionConfirmModal'),
);

const StakingHeader = lazy(
  () => import('src/components/Staking/StakingHeader'),
);
const CurrentStakingHandler = lazy(
  () => import('src/components/Staking/CurrentStakingHandler'),
);

interface IProps {
  rewardToken: Token.ELFI;
}

const Staking: React.FunctionComponent<IProps> = ({ rewardToken }) => {
  const { t } = useTranslation();
  const { account } = useWeb3React();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const { type: getMainnetType } = useContext(MainnetContext);
  const currentChain = useCurrentChain();

  const stakingPool = useMemo(() => {
    return StakingPoolV2factory.connect(
      getMainnetType === MainnetType.BSC
        ? envs.stakingV2MoneyPool.elfiBscStaking
        : envs.stakingV2MoneyPool.elfiStaking,
      new providers.JsonRpcProvider(
        getMainnetType === MainnetType.BSC
          ? envs.jsonRpcUrl.bsc
          : process.env.REACT_APP_JSON_RPC,
      ) as any,
    );
  }, [getMainnetType]);

  const stakedToken = Token.ELFI;

  const { apr: poolApr, totalPrincipal } = useStakingRoundDataV2(
    Token.ELFI,
    Token.ELFI,
    stakingPool,
  );

  const [modalType, setModalType] = useState('');
  const modalVisible = useCallback(
    (type: StakingModalType) => {
      return modalType === type;
    },
    [modalType],
  );

  const [transactionModal, setTransactionModal] = useState(false);
  const [transactionWait, setTransactionWait] = useState<boolean>(false);
  const [modalValue, setModalValue] = useState(constants.Zero);

  const { roundData, loading, error, fetchRoundData } =
    useStakingFetchRoundDataV2(Token.ELFI, rewardToken, poolApr);

  const [expectedReward, setExpectedReward] = useState({
    before: constants.Zero,
    value: constants.Zero,
  });

  const { value: mediaQuery } = useMediaQueryType();

  const isWrongMainnet = isWrongNetwork(getMainnetType, currentChain?.name);

  const draw = () => {
    const dpr = window.devicePixelRatio;
    const canvas: HTMLCanvasElement | null = canvasRef.current;

    if (!headerRef.current) return;
    const headerY =
      headerRef.current.offsetTop +
      (document.body.clientWidth > 1190 ? 164 : 150);
    if (!canvas) return;
    canvas.width = document.body.clientWidth * dpr;
    canvas.height = document.body.clientHeight * dpr;
    const browserWidth = canvas.width / dpr + 40;
    const browserHeight = canvas.height / dpr;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    if (mediaQuery === MediaQuery.Mobile) return;

    new DrawWave(ctx, browserWidth).drawOnPages(
      headerY,
      TokenColors.ELFI,
      browserHeight,
      true,
    );
  };

  useEffect(() => {
    if (error || loading) return;

    const interval = setInterval(() => {
      if (!account) return;

      setExpectedReward({
        before: expectedReward.value.isZero()
          ? roundData[0].accountReward
          : expectedReward.value,
        value: calcExpectedReward(
          roundData[0],
          rewardPerDayByToken(Token.ELFI, getMainnetType),
        ),
      });
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  });

  useEffect(() => {
    draw();
    window.addEventListener('scroll', () => draw());
    window.addEventListener('resize', () => draw());

    return () => {
      window.removeEventListener('scroll', () => draw());
      window.removeEventListener('resize', () => draw());
    };
  }, [document.body.clientHeight]);

  useEffect(() => {
    setExpectedReward({
      before: constants.Zero,
      value: constants.Zero,
    });
  }, [getMainnetType]);

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
      <Suspense fallback={null}>
        {roundData.length !== 0 && (
          <>
            <TransactionConfirmModal
              visible={transactionModal}
              closeHandler={() => {
                setTransactionModal(false);
              }}
            />
            <ClaimStakingRewardModalV2
              visible={modalVisible(StakingModalType.Claim)}
              stakedToken={Token.ELFI}
              token={Token.ELFI}
              balance={expectedReward}
              stakingBalance={
                loading ? constants.Zero : roundData[0]?.accountPrincipal
              }
              currentRound={roundData[0]}
              closeHandler={() => {
                setModalType('');
                setTransactionWait(false);
              }}
              afterTx={() => {
                account && fetchRoundData(account);
              }}
              transactionModal={() => setTransactionModal(true)}
              transactionWait={transactionWait}
              setTransactionWait={() => setTransactionWait(true)}
            />
            <StakingModalV2
              visible={modalVisible(StakingModalType.Staking)}
              closeHandler={() => {
                setModalType('');
                setTransactionWait(false);
              }}
              stakedToken={Token.ELFI}
              stakedBalance={
                loading ? constants.Zero : roundData[0].accountPrincipal
              }
              afterTx={() => {
                account && fetchRoundData(account);
              }}
              endedModal={() => {
                setModalType(StakingModalType.StakingEnded);
              }}
              transactionModal={() => setTransactionModal(true)}
              transactionWait={transactionWait}
              setTransactionWait={() => setTransactionWait(true)}
              disableTransactionWait={() => setTransactionWait(false)}
              title={Token.ELFI}
            />
          </>
        )}
      </Suspense>
      <section className="staking">
        <Suspense fallback={<div style={{ height: 400 }} />}>
          <ElfiTitle headerRef={headerRef} getMainnetType={getMainnetType} />
        </Suspense>
        <Suspense fallback={<div style={{ height: 40 }} />}>
          <StakingHeader
            mediaQuery={mediaQuery}
            image={elfi}
            subImage={undefined}
            title={t('staking.staking__token', {
              token: Token.ELFI,
            })}
            stakingType={Token.ELFI}
          />
        </Suspense>
        <section>
          {loading ? (
            <Skeleton width={'100%'} height={350} />
          ) : (
            <>
              <CurrentStakingInfo
                poolApr={poolApr}
                totalPrincipal={totalPrincipal}
                rewardToken={rewardToken}
              />
              <CurrentStakingHandler
                stakingAmount={`${formatCommaSmall(
                  roundData[0]?.accountPrincipal || constants.Zero,
                )}`}
                stakedToken={stakedToken}
                isStaking={!account || isWrongMainnet}
                stakingOnClick={() => {
                  if (!account || isWrongMainnet) {
                    return;
                  }
                  ReactGA.modalview(
                    stakedToken + ModalViewType.StakingOrUnstakingModal,
                  );
                  setModalValue(roundData[0].accountPrincipal);
                  setModalType(StakingModalType.Staking);
                }}
                claimStart={parseFloat(formatEther(expectedReward.before))}
                claimEnd={parseFloat(
                  formatEther(
                    expectedReward.before.isZero()
                      ? roundData[0].accountReward
                      : expectedReward.value,
                  ),
                )}
                claimOnClick={() => {
                  if (expectedReward.value.isZero() || !account) {
                    return;
                  }

                  ReactGA.modalview(
                    stakedToken + ModalViewType.StakingIncentiveModal,
                  );
                  setModalValue(expectedReward.value);
                  setModalType(StakingModalType.Claim);
                }}
                isClaim={expectedReward.before.isZero() || !account}
                rewardToken={rewardToken}
              />
            </>
          )}
        </section>
      </section>
    </>
  );
};

export const StakingELFI = (): JSX.Element => {
  const { type: mainnet } = useContext(MainnetContext);

  return <Staking rewardToken={Token.ELFI} />;
};

export default Staking;
