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
import { constants } from 'ethers';
import Skeleton from 'react-loading-skeleton';
import moment from 'moment';

import { roundTimes } from 'src/core/data/stakingRoundTimes';
import Token from 'src/enums/Token';
import { useTranslation, Trans } from 'react-i18next';
import txStatus from 'src/enums/TxStatus';
import LanguageType from 'src/enums/LanguageType';
import useStakingRoundData from 'src/hooks/useStakingRoundData';
import RewardPlanButton from 'src/components/RewardPlan/RewardPlanButton';
import useMediaQueryType from 'src/hooks/useMediaQueryType';
import MediaQuery from 'src/enums/MediaQuery';
import { useParams } from 'react-router-dom';
import DrawWave from 'src/utiles/drawWave';
import TokenColors from 'src/enums/TokenColors';
import MainnetContext from 'src/contexts/MainnetContext';
import MainnetType from 'src/enums/MainnetType';
import useCurrentChain from 'src/hooks/useCurrentChain';
import { isWrongNetwork } from 'src/utiles/isWrongNetwork';
import StakingModalType from 'src/enums/StakingModalType';
import useStakingFetchRoundData from 'src/hooks/useStakingFetchRoundData';
import NextStaking from 'src/components/Staking/NextStaking';
import { rewardPerDayByToken } from 'src/utiles/stakingReward';
import calcExpectedReward from 'src/core/utils/calcExpectedReward';
import TitleButton from 'src/components/Staking/TitleButton';

import PancakeSwap from 'src/assets/images/staking/pancakeswapcake@2x.svg';
import Wormhole from 'src/assets/images/staking/wormhole@2x.svg';
import Uniswap from 'src/assets/images/staking/uniswap@2x.svg';
import elfi from 'src/assets/images/token/ELFI.svg';
import el from 'src/assets/images/token/el.svg';

const ClaimDisableModal = lazy(() => import('src/components/Modal/ClaimDisableModal'));
const MigrationDisableModal = lazy(() => import('src/components/Modal/MigrationDisableModal'));
const MigrationModal = lazy(() => import('src/components/Modal/MigrationModal'));
const StakingEnded = lazy(() => import('src/components/Modal/StakingEnded'));
const MigrationEnded = lazy(() => import('src/components/Modal/MigrationEnded'));
const ClaimStakingRewardModal = lazy(() => import('src/components/Modal/ClaimStakingRewardModal'));
const StakingModal = lazy(() => import('src/components/Modal/StakingModal'));
const TransactionConfirmModal = lazy(() => import('src/components/Modal/TransactionConfirmModal'));
const GovernanceGuideBox = lazy(() => import('src/components/Governance/GovernanceGuideBox'));

const CurrentRoundBox = lazy(() => import('./CurrentRoundBox'));
const PreviousRoundBox = lazy(() => import('./PreviousRoundBox'));
const CurrentStakingSelectBox = lazy(() => import('./CurrentStakingSelectBox'));

const LazyImage = lazy(() => import('src/utiles/lazyImage'))

interface IProps {
  stakedToken: Token.EL | Token.ELFI;
  rewardToken: Token.ELFI | Token.DAI | Token.BUSD;
}

const Staking: React.FunctionComponent<IProps> = ({
  stakedToken,
  rewardToken,
}) => {
  const { t } = useTranslation();
  const current = moment();
  const { account } = useWeb3React();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const { type: getMainnetType } = useContext(MainnetContext);
  const currentChain = useCurrentChain();

  const stakingRoundDate = roundTimes(stakedToken, getMainnetType);

  const roundInProgress = stakingRoundDate.findIndex((date) => {
    return moment().isBetween(date.startedAt, date.endedAt);
  });

  const currentPhase = useMemo(() => {
    const pastRoundCount = stakingRoundDate.filter(
      (round) => current.diff(round.startedAt) >= 0,
    ).length;
    return pastRoundCount === 0 ? 1 : pastRoundCount;
  }, [current]);

  const [state, setState] = useState({
    selectPhase: currentPhase,
    txWaiting: false,
    txStatus: txStatus.IDLE,
  });

  const { apr: poolApr } = useStakingRoundData(
    state.selectPhase - 1,
    stakedToken,
    rewardToken,
  );

  const [modalType, setModalType] = useState('');
  const [isUnstaking, setIsUnstaking] = useState(true);
  const modalVisible = useCallback(
    (type: StakingModalType) => {
      return modalType === type;
    },
    [modalType],
  );

  const [transactionModal, setTransactionModal] = useState(false);

  const [transactionWait, setTransactionWait] = useState<boolean>(false);

  const [selectModalRound, setRoundModal] = useState(0);
  const [modalValue, setModalValue] = useState(constants.Zero);

  const { roundData, loading, error, fetchRoundData } =
    useStakingFetchRoundData(stakedToken, rewardToken, poolApr, currentPhase);

  const currentRound = useMemo(() => {
    return roundData[roundInProgress];
  }, [currentPhase, roundData]);

  const [expectedReward, setExpectedReward] = useState({
    before: constants.Zero,
    value: constants.Zero,
  });

  const roundDataLength = useMemo(() => {
    return (
      roundData.filter((data) => current.diff(data.endedAt) > 0).length * 135 + // previous length
      90 + // margin
      55 + // current container height / 2
      90 // remaining container height / 2
    );
  }, [roundData]);

  const { value: mediaQuery } = useMediaQueryType();
  const { lng } = useParams<{ lng: string }>();

  const isWrongMainnet = isWrongNetwork(getMainnetType, currentChain?.name);

  const draw = () => {
    const dpr = window.devicePixelRatio;
    const canvas: HTMLCanvasElement | null = canvasRef.current;

    if (!headerRef.current) return;
    const headerY =
      headerRef.current.offsetTop +
      (stakedToken === Token.EL
        ? document.body.clientWidth > 1190
          ? 125
          : 90
        : document.body.clientWidth > 1190
        ? 164
        : 150);
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
      stakedToken === Token.EL ? TokenColors.EL : TokenColors.ELFI,
      browserHeight,
      true,
    );
  };

  useEffect(() => {
    if (error || loading) return;

    const interval = setInterval(() => {
      // FIXME
      // currentRound is not return 4 when there is no round
      // For temp usage, use round 4 data
      // if (!roundData[2]) return;
      if (!account || roundInProgress === -1) return;
      setExpectedReward({
        before: expectedReward.value.isZero()
          ? roundData[roundInProgress].accountReward
          : expectedReward.value,
        value: calcExpectedReward(
          roundData[roundInProgress],
          rewardPerDayByToken(stakedToken, getMainnetType),
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
    setRoundModal(0);
    setExpectedReward({
      before: constants.Zero,
      value: constants.Zero,
    });
    setState({
      selectPhase: currentPhase,
      txWaiting: false,
      txStatus: txStatus.IDLE,
    });
  }, [getMainnetType, currentPhase]);

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
        {stakingRoundDate.length === roundData.length && (
          <>
            <TransactionConfirmModal
              visible={transactionModal}
              closeHandler={() => {
                setTransactionModal(false);
              }}
            />
            <ClaimStakingRewardModal
              visible={modalVisible(StakingModalType.Claim)}
              stakedToken={stakedToken}
              token={rewardToken}
              balance={
                moment().isBetween(
                  stakingRoundDate[selectModalRound].startedAt,
                  stakingRoundDate[selectModalRound].endedAt,
                )
                  ? expectedReward
                  : undefined
              }
              endedBalance={
                (!moment().isBetween(
                  stakingRoundDate[selectModalRound].startedAt,
                  stakingRoundDate[selectModalRound].endedAt,
                ) &&
                  roundData[selectModalRound]?.accountReward) ||
                constants.Zero
              }
              stakingBalance={
                loading
                  ? constants.Zero
                  : roundData[selectModalRound].accountPrincipal
              }
              currentRound={currentRound}
              round={selectModalRound + 1}
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
            <StakingModal
              visible={modalVisible(StakingModalType.Staking)}
              closeHandler={() => {
                setModalType('');
                setTransactionWait(false);
              }}
              stakedToken={stakedToken}
              stakedBalance={
                loading
                  ? constants.Zero
                  : roundData[selectModalRound].accountPrincipal
              }
              round={selectModalRound + 1}
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
              isUnstaking={isUnstaking}
            />
            <MigrationModal
              visible={modalVisible(StakingModalType.Migration)}
              closeHandler={() => {
                setModalType('');
                setTransactionWait(false);
              }}
              stakedToken={stakedToken}
              rewardToken={rewardToken}
              stakedBalance={loading ? constants.Zero : modalValue}
              rewardBalance={
                roundData[selectModalRound]?.accountReward || constants.Zero
              }
              round={selectModalRound + 1}
              afterTx={() => {
                account && fetchRoundData(account);
              }}
              transactionModal={() => setTransactionModal(true)}
              transactionWait={transactionWait}
              setTransactionWait={() => setTransactionWait(true)}
              stakingRoundDate={stakingRoundDate}
            />
            <StakingEnded
              visible={modalVisible(StakingModalType.StakingEnded)}
              onClose={() => {
                setModalType('');
                setState({ ...state, selectPhase: currentPhase });
              }}
              round={selectModalRound + 1}
              stakingRoundDate={stakingRoundDate}
            />
            <MigrationEnded
              visible={modalVisible(StakingModalType.MigrationEnded)}
              onClose={() => {
                setModalType('');
                setState({ ...state, selectPhase: currentPhase });
              }}
              round={selectModalRound + 1}
              stakingRoundDate={stakingRoundDate}
            />
            <ClaimDisableModal
              visible={modalVisible(StakingModalType.ClaimDisable)}
              onClose={() => {
                setModalType('');
              }}
            />
            <MigrationDisableModal
              visible={modalVisible(StakingModalType.MigrationDisable)}
              onClose={() => {
                setModalType(StakingModalType.Staking);
              }}
            />
          </>
        )}
      </Suspense>
      <section className="staking">
        <div ref={headerRef} className="staking__title">
          <h2>
            {t('staking.staking__token', {
              token: stakedToken.toUpperCase(),
            })}
          </h2>
          <>
            <p>
              {stakedToken === Token.EL
                ? ''
                : t('staking.elfi.staking__content')}
            </p>
            {getMainnetType === MainnetType.Ethereum ? (
              <TitleButton
                buttonName={
                  stakedToken === Token.EL
                    ? t('staking.el.staking__content--button')
                    : t('staking.elfi.staking__content--button.uniswap')
                }
                link={
                  stakedToken === Token.ELFI
                    ? 'https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x4da34f8264cb33a5c9f17081b9ef5ff6091116f4'
                    : lng === LanguageType.KO
                    ? 'https://coinmarketcap.com/ko/currencies/elysia/markets/'
                    : 'https://coinmarketcap.com/currencies/elysia/markets/'
                }
                linkName={stakedToken === Token.ELFI ? Token.ELFI : Token.EL}
                linkImage={stakedToken === Token.ELFI ? Uniswap : undefined}
              />
            ) : stakedToken === Token.ELFI ? (
              <div className="staking__title__token">
                {[
                  {
                    linkName: 'pancakeswap',
                    link: 'https://pancakeswap.finance/swap?inputCurrency=0xe9e7cea3dedca5984780bafc599bd69add087d56&outputCurrency=0x6c619006043eab742355395690c7b42d3411e8c0',
                    linkImage: PancakeSwap,
                  },
                  {
                    linkName: 'wormhole',
                    link: 'https://portalbridge.com/#/transfer',
                    linkImage: Wormhole,
                  },
                ].map((value, index) => {
                  return (
                    <Suspense fallback={null}>
                      <TitleButton
                        key={`btn_${index}`}
                        buttonName={t(
                          `staking.elfi.staking__content--button.${value.linkName}`,
                        )}
                        link={value.link}
                        linkName={value.linkName}
                        linkImage={value.linkImage}
                      />
                    </Suspense>
                  );
                })}
              </div>
            ) : (
              <div style={{ height: 120 }} />
            )}
          </>
        </div>
        {getMainnetType === MainnetType.Ethereum ||
        stakedToken === Token.ELFI ? (
          <section>
            {stakedToken === Token.ELFI && (
              <section className="governance__elyfi-graph">
                <Suspense fallback={<div style={{ height: 120 }} />}>
                  <GovernanceGuideBox />
                </Suspense>
              </section>
            )}
            <div className="staking__title__content__wrapper">
              {mediaQuery === MediaQuery.PC ? (
                <>
                  <div className="staking__title__content__token-wrapper">
                    <Suspense fallback={<div style={{ width: 37, height: 37 }}/>}>
                      <LazyImage src={stakedToken === Token.EL ? el : elfi} name="token-images" />
                    </Suspense>
                    <h2>
                      {t('staking.staking__token', {
                        token: stakedToken.toUpperCase(),
                      })}
                    </h2>
                  </div>
                  <div className="staking__title__content">
                    <p>
                      {t(`staking.staking__notice.${rewardToken}`, {
                        stakedToken,
                        rewardToken,
                      })}
                    </p>
                    <RewardPlanButton
                      stakingType={stakedToken}
                      isStaking={true}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="staking__title__content__token-wrapper">
                    <div>
                      <Suspense fallback={<div style={{ width: 21, height: 21 }}/>}>
                        <LazyImage src={stakedToken === Token.EL ? el : elfi} name="token-images" />
                      </Suspense>
                      <h2>
                        {t('staking.staking__token', {
                          token: stakedToken.toUpperCase(),
                        })}
                      </h2>
                    </div>
                    <RewardPlanButton
                      stakingType={stakedToken}
                      isStaking={true}
                    />
                  </div>
                  <div className="staking__title__content">
                    <p>
                      {t(`staking.staking__notice.${rewardToken}`, {
                        stakedToken,
                        rewardToken,
                      })}
                    </p>
                  </div>
                </>
              )}
            </div>
            {loading ? (
              <Skeleton width={'100%'} height={600} />
            ) : (
              <>
                <section className="staking__round">
                  {roundInProgress !== -1 && (
                    <div
                      className="staking__round__border"
                      style={{
                        height: roundDataLength,
                      }}
                    />
                  )}
                  <div className="staking__round__container">
                    <section className="staking__round__current-data">
                      <Suspense fallback={<div style={{ width: "100%", height: 120, background: "#ffffff"  }}/>}>
                        <CurrentRoundBox
                          currentPhase={currentPhase}
                          mediaQuery={mediaQuery}
                          stakingRoundDate={stakingRoundDate}
                          currentRound={currentRound}
                        />
                      </Suspense>
                    </section>
                    <section className="staking__round__previous__wrapper">
                      <Suspense fallback={<div style={{ width: "100%", height: 200, background: "#ffffff" }}/>}>
                        <PreviousRoundBox 
                          roundData={roundData}
                          stakingRoundDate={stakingRoundDate}
                          stakedToken={stakedToken}
                          rewardToken={rewardToken}
                          roundInProgress={roundInProgress}
                          setModalType={setModalType}
                          setRoundModal={setRoundModal}
                          setModalValue={setModalValue}
                          setIsUnstaking={() => setIsUnstaking(false)}
                        />
                      </Suspense>
                    </section>
                    <section>
                      <Suspense fallback={<div style={{ width: "100%", height: 120, background: "#ffffff"  }}/>}>
                        <CurrentStakingSelectBox 
                          roundInProgress={roundInProgress}
                          stakingRoundDate={stakingRoundDate}
                          roundData={roundData}
                          stakedToken={stakedToken}
                          rewardToken={rewardToken}
                          setModalType={setModalType}
                          setModalValue={setModalValue}
                          setRoundModal={setRoundModal}
                          isWrongMainnet={isWrongMainnet}
                          currentRound={currentRound}
                          expectedReward={expectedReward}
                          setIsUnstaking={() => setIsUnstaking(true)}
                        />
                      </Suspense>
                    </section>

                    <section>
                      {
                        // eslint-disable-next-line array-callback-return
                        roundData.map((item, index) => {
                          if (stakingRoundDate.length !== roundData.length)
                            return;
                          if (current.diff(item.startedAt) < 0) {
                            return (
                              <NextStaking
                                key={`nextStaking_${index}`}
                                index={index}
                                stakedToken={stakedToken}
                                rewardToken={rewardToken}
                              />
                            );
                          }
                        })
                      }
                    </section>
                  </div>
                </section>
              </>
            )}
          </section>
        ) : (
          <>
            <div
              className={`staking__coming-soon ${
                stakedToken === Token.EL ? 'el' : 'elfi'
              }`}>
              <div>
                <h2>COMING SOON</h2>
              </div>
              <div />
              <div />
              <div />
            </div>
          </>
        )}
      </section>
    </>
  );
};

export const StakingEL = (): JSX.Element => {
  return <Staking stakedToken={Token.EL} rewardToken={Token.ELFI} />;
};

export const StakingELFI = (): JSX.Element => {
  const { type: mainnet } = useContext(MainnetContext);

  return (
    <Staking
      stakedToken={Token.ELFI}
      rewardToken={mainnet === 'BSC' ? Token.BUSD : Token.DAI}
    />
  );
};

export default Staking;