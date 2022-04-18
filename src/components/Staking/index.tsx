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
import Skeleton from 'react-loading-skeleton';
import CountUp from 'react-countup';
import { formatEther } from 'ethers/lib/utils';
import {
  formatCommaSmall,
  formatSixFracionDigit,
  toCompactForBignumber,
  toPercentWithoutSign,
} from 'src/utiles/formatters';

import Token from 'src/enums/Token';
import { useTranslation, Trans } from 'react-i18next';
import ReactGA from 'react-ga';
import RewardPlanButton from 'src/components/RewardPlan/RewardPlanButton';
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
import TitleButton from 'src/components/Staking/TitleButton';

import PancakeSwap from 'src/assets/images/staking/pancakeswapcake@2x.svg';
import Wormhole from 'src/assets/images/staking/wormhole@2x.svg';
import Uniswap from 'src/assets/images/staking/uniswap@2x.svg';
import elfi from 'src/assets/images/token/ELFI.svg';
import ModalViewType from 'src/enums/ModalViewType';
import LegacyStakingButton from '../LegacyStaking/LegacyStakingButton';
import useStakingFetchRoundDataV2 from './hooks/useStakingFetchRoundDataV2';
import useStakingRoundDataV2 from './hooks/useStakingRoundDataV2';

const ClaimStakingRewardModalV2 = lazy(
  () => import('src/components/Staking/modal/ClaimStakingRewardModalV2'),
);
const StakingModalV2 = lazy(
  () => import('src/components/Staking/modal/StakingModalV2'),
);
const TransactionConfirmModal = lazy(
  () => import('src/components/Modal/TransactionConfirmModal'),
);
const GovernanceGuideBox = lazy(
  () => import('src/components/Governance/GovernanceGuideBox'),
);

const LazyImage = lazy(() => import('src/utiles/lazyImage'));

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

  const stakedToken = Token.ELFI;

  const { apr: poolApr, totalPrincipal } = useStakingRoundDataV2(
    Token.ELFI,
    Token.ELFI,
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
              endedBalance={roundData[0]?.accountReward || constants.Zero}
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
        <div ref={headerRef} className="staking__title">
          <h2>
            {t('staking.staking__token', {
              token: Token.ELFI.toUpperCase(),
            })}
          </h2>
          <>
            <p>{t('staking.elfi.staking__content')}</p>
            {getMainnetType === MainnetType.Ethereum ? (
              <TitleButton
                buttonName={t('staking.elfi.staking__content--button.uniswap')}
                link={
                  'https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x4da34f8264cb33a5c9f17081b9ef5ff6091116f4'
                }
                linkName={Token.ELFI}
                linkImage={Uniswap}
              />
            ) : (
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
            )}
          </>
        </div>
        <section>
          <section className="governance__elyfi-graph">
            <Suspense fallback={<div style={{ height: 120 }} />}>
              <GovernanceGuideBox />
            </Suspense>
          </section>
          <div className="staking__title__content__wrapper">
            {mediaQuery === MediaQuery.PC ? (
              <>
                <div className="staking__title__content">
                  <div className="staking__title__content__token-wrapper">
                    <Suspense
                      fallback={<div style={{ width: 37, height: 37 }} />}>
                      <LazyImage src={elfi} name="token-images" />
                    </Suspense>
                    <h2>
                      {t('staking.staking__token', {
                        token: Token.ELFI.toUpperCase(),
                      })}
                    </h2>
                  </div>
                  <LegacyStakingButton
                    stakingType={Token.ELFI}
                    isStaking={true}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="staking__title__content__token-wrapper">
                  <div>
                    <Suspense
                      fallback={<div style={{ width: 21, height: 21 }} />}>
                      <LazyImage src={elfi} name="token-images" />
                    </Suspense>
                    <h2>
                      {t('staking.staking__token', {
                        token: Token.ELFI.toUpperCase(),
                      })}
                    </h2>
                  </div>
                  <LegacyStakingButton
                    stakingType={Token.ELFI}
                    isStaking={true}
                  />
                </div>
              </>
            )}
          </div>
          {loading ? (
            <Skeleton width={'100%'} height={300} />
          ) : (
            <>
              <section className="staking__round__header">
                <div>
                  <p>{t('staking.elfi.apr')}</p>
                  <h2 className="percent">
                    {roundData[0]?.apr.eq(constants.MaxUint256)
                      ? '-'
                      : toPercentWithoutSign(roundData[0]?.apr || 0)}
                  </h2>
                </div>
                <div>
                  <p>{t('staking.elfi.total_amount')}</p>
                  <h2>
                    {toCompactForBignumber(totalPrincipal)} {rewardToken}
                  </h2>
                </div>
              </section>
              <section className="staking__round__remaining-data current">
                <div className="staking__round__remaining-data__body">
                  <>
                    <div>
                      <h2>{t('staking.staking_amount')}</h2>
                      <div>
                        <h2>
                          {`${formatCommaSmall(
                            roundData[0]?.accountPrincipal || '0',
                          )}`}
                          <span className="token-amount bold">
                            {stakedToken}
                          </span>
                        </h2>
                        <div
                          className={`staking__round__button ${
                            !account || isWrongMainnet ? ' disable' : ''
                          }`}
                          onClick={(e) => {
                            if (!account || isWrongMainnet) {
                              return;
                            }
                            ReactGA.modalview(
                              stakedToken +
                                ModalViewType.StakingOrUnstakingModal,
                            );
                            setModalValue(roundData[0].accountPrincipal);
                            setModalType(StakingModalType.Staking);
                          }}>
                          <p>{t('staking.staking_btn')}</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h2>{t('staking.reward_amount')}</h2>
                      <div>
                        <h2>
                          {expectedReward.before.isZero() || !account ? (
                            '-'
                          ) : (
                            <CountUp
                              start={parseFloat(
                                formatEther(expectedReward.before),
                              )}
                              end={parseFloat(
                                formatEther(
                                  expectedReward.before.isZero()
                                    ? roundData[0].accountReward
                                    : expectedReward.value,
                                ),
                              )}
                              formattingFn={(number) => {
                                return formatSixFracionDigit(number);
                              }}
                              decimals={6}
                              duration={1}
                            />
                          )}
                          <span className="token-amount bold">
                            {rewardToken}
                          </span>
                        </h2>
                        <div
                          className={`staking__round__button ${
                            expectedReward.value.isZero() || !account
                              ? ' disable'
                              : ''
                          }`}
                          onClick={(e) => {
                            if (expectedReward.value.isZero() || !account) {
                              return;
                            }

                            ReactGA.modalview(
                              stakedToken + ModalViewType.StakingIncentiveModal,
                            );
                            setModalValue(expectedReward.value);
                            setModalType(StakingModalType.Claim);
                          }}>
                          <p>{t('staking.claim_reward')}</p>
                        </div>
                      </div>
                    </div>
                  </>
                </div>
              </section>
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
