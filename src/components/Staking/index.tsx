import {
  lazy,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useWeb3React } from '@web3-react/core';
import { constants } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import { formatCommaSmall } from 'src/utiles/formatters';
import Token from 'src/enums/Token';
import { useTranslation } from 'react-i18next';
import ReactGA from 'react-ga';
import useMediaQueryType from 'src/hooks/useMediaQueryType';
import MediaQuery from 'src/enums/MediaQuery';
import DrawWave from 'src/utiles/drawWave';
import TokenColors from 'src/enums/TokenColors';
import MainnetContext from 'src/contexts/MainnetContext';
import useCurrentChain from 'src/hooks/useCurrentChain';
import { isWrongNetwork } from 'src/utiles/isWrongNetwork';
import StakingModalType from 'src/enums/StakingModalType';
import { rewardPerDayByToken } from 'src/utiles/stakingReward';
import calcExpectedReward from 'src/core/utils/calcExpectedReward';

import elfi from 'src/assets/images/token/ELFI.svg';
import ModalViewType from 'src/enums/ModalViewType';
import useStakingFetchRoundDataV2 from 'src/components/Staking/hooks/useStakingFetchRoundDataV2';
import useStakingRoundDataV2 from 'src/components/Staking/hooks/useStakingRoundDataV2';

const CurrentStakingInfo = lazy(
  () => import('src/components/Staking/CurrentStakingInfo'),
);
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
const CurrentStakingContainer = lazy(
  () => import('src/components/Staking/CurrentStakingContainer'),
);

const Staking: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const { account } = useWeb3React();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const { type: getMainnetType } = useContext(MainnetContext);
  const currentChain = useCurrentChain();

  const stakedToken = Token.ELFI;
  const rewardToken = Token.ELFI;

  const {
    apr: poolApr,
    totalPrincipal,
    loading: poolLoading,
  } = useStakingRoundDataV2(Token.ELFI, Token.ELFI);

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
        <Suspense fallback={<div style={{ height: 200 }} />}>
          <CurrentStakingInfo
            poolApr={poolApr}
            totalPrincipal={totalPrincipal}
            rewardToken={rewardToken}
            isLoading={poolLoading}
          />
          <CurrentStakingContainer
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
                  ? roundData[0]?.accountReward || constants.Zero
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
            isLoading={loading}
            roundData={roundData[0]}
            expectedReward={expectedReward}
            currentToken={Token.ELFI}
          />
        </Suspense>
      </section>
    </>
  );
};

export default Staking;
