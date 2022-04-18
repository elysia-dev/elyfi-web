import { useWeb3React } from '@web3-react/core';
import { constants } from 'ethers';
import {
  useEffect,
  useContext,
  useState,
  useCallback,
  useRef,
  lazy,
  Suspense,
} from 'react';
import CountUp from 'react-countup';
import { useTranslation } from 'react-i18next';
import Token from 'src/enums/Token';
import eth from 'src/assets/images/eth-color.png';
import dai from 'src/assets/images/dai.png';
import elfi from 'src/assets/images/ELFI.png';
import useMediaQueryType from 'src/hooks/useMediaQueryType';
import MediaQuery from 'src/enums/MediaQuery';
import ReactGA from 'react-ga';
import DrawWave from 'src/utiles/drawWave';
import TokenColors from 'src/enums/TokenColors';
import MainnetContext from 'src/contexts/MainnetContext';
import MainnetType from 'src/enums/MainnetType';
import { isWrongNetwork } from 'src/utiles/isWrongNetwork';
import useCurrentChain from 'src/hooks/useCurrentChain';
import { formatEther } from 'ethers/lib/utils';
import calcExpectedReward from 'src/core/utils/calcExpectedReward';
import { rewardPerDayByToken } from 'src/utiles/stakingReward';
import {
  formatCommaSmall,
  formatSixFracionDigit,
  toPercentWithoutSign,
} from 'src/utiles/formatters';
import StakingModalType from 'src/enums/StakingModalType';
import Skeleton from 'react-loading-skeleton';
import LegacyStakingButton from '../LegacyStaking/LegacyStakingButton';
import useStakingRoundDataV2 from '../Staking/hooks/useStakingRoundDataV2';
import useStakingFetchRoundDataV2 from '../Staking/hooks/useStakingFetchRoundDataV2';

const ClaimStakingRewardModalV2 = lazy(
  () => import('src/components/Staking/modal/ClaimStakingRewardModalV2'),
);
const StakingModalV2 = lazy(
  () => import('src/components/Staking/modal/StakingModalV2'),
);
const TransactionConfirmModal = lazy(
  () => import('src/components/Modal/TransactionConfirmModal'),
);

function LPStaking(): JSX.Element {
  const { account, library } = useWeb3React();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const currentChain = useCurrentChain();
  const { t } = useTranslation();
  const { value: mediaQuery } = useMediaQueryType();
  const { type: getMainnetType } = useContext(MainnetContext);
  const isWrongMainnet = isWrongNetwork(getMainnetType, currentChain?.name);

  const rewardToken = Token.ELFI;

  const { apr: EthPoolApr, totalPrincipal: EthTotalPrincipal } =
    useStakingRoundDataV2(Token.ELFI_ETH_LP, Token.ELFI);

  const { apr: DaiPoolApr, totalPrincipal: DaiTotalPrincipal } =
    useStakingRoundDataV2(Token.ELFI_DAI_LP, Token.ELFI);

  const [modalType, setModalType] = useState('');
  const [transactionModal, setTransactionModal] = useState(false);
  const [transactionWait, setTransactionWait] = useState<boolean>(false);
  const [modalValue, setModalValue] = useState(constants.Zero);

  const [ethExpectedReward, setEthExpectedReward] = useState({
    before: constants.Zero,
    value: constants.Zero,
  });
  const [daiExpectedReward, setDaiExpectedReward] = useState({
    before: constants.Zero,
    value: constants.Zero,
  });

  const modalVisible = useCallback(
    (type: StakingModalType) => {
      return modalType === type;
    },
    [modalType],
  );

  const { roundData, loading, error, fetchRoundData } =
    useStakingFetchRoundDataV2(Token.UNI, rewardToken, EthPoolApr);

  const draw = () => {
    const dpr = window.devicePixelRatio;
    const canvas: HTMLCanvasElement | null = canvasRef.current;

    if (!headerRef.current) return;
    const headerY =
      headerRef.current.offsetTop +
      (document.body.clientWidth > 1190 ? 90 : 45);
    if (!canvas) return;
    canvas.width = document.body.clientWidth * dpr;
    canvas.height = document.body.clientHeight * dpr;
    const browserWidth = canvas.width / dpr + 40;
    const browserHeight = canvas.height / dpr;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;
    ctx.scale(dpr, dpr);

    if (mediaQuery === MediaQuery.Mobile) {
      new DrawWave(ctx, browserWidth).drawMobileOnPages(
        headerY,
        TokenColors.ELFI,
        browserHeight,
        true,
        'LP',
      );
      return;
    }

    new DrawWave(ctx, browserWidth).drawOnPages(
      headerY,
      TokenColors.ELFI,
      browserHeight,
      true,
      'LP',
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

  useEffect(() => {
    if (error || loading) return;

    const interval = setInterval(() => {
      if (!account) return;

      setEthExpectedReward({
        before: ethExpectedReward.value.isZero()
          ? roundData[0].accountReward
          : ethExpectedReward.value,
        value: calcExpectedReward(
          roundData[0],
          rewardPerDayByToken(Token.UNI, getMainnetType),
        ),
      });
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  });

  useEffect(() => {
    setEthExpectedReward({
      before: constants.Zero,
      value: constants.Zero,
    });
    setDaiExpectedReward({
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
              stakedToken={Token.UNI}
              token={Token.ELFI}
              balance={ethExpectedReward}
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
              stakedToken={Token.UNI}
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
            />
          </>
        )}
      </Suspense>
      <section className="staking__v2">
        <div className="staking__v2__title">
          <h2>{t('staking.lp.title')}</h2>
          <p>{t('staking.lp.content')}</p>
        </div>
        <div ref={headerRef} />
        {getMainnetType === MainnetType.Ethereum ? (
          loading ? (
            <Skeleton width={'100%'} height={600} />
          ) : (
            <>
              {[
                ['ELFI-ETH LP', eth],
                ['ELFI-DAI LP', dai],
              ].map((data, index) => {
                return (
                  <section className="staking__v2__container">
                    <div className="staking__v2__header">
                      <div>
                        <div>
                          <img src={elfi} />
                          <img src={data[1]} />
                        </div>
                        <h2>{data[0]}</h2>
                      </div>
                      <LegacyStakingButton
                        stakingType={'LP'}
                        isStaking={true}
                      />
                    </div>
                    <div className="staking__v2__content">
                      <div>
                        <div>
                          <p>{t('staking.elfi.apr')}</p>
                          <h2 className="percent">
                            {roundData[0]?.apr.eq(constants.MaxUint256)
                              ? '-'
                              : toPercentWithoutSign(roundData[0].apr)}
                          </h2>
                        </div>
                        <div>
                          <p>{t('staking.elfi.total_amount')}</p>
                          <h2>
                            {/* {parseFloat(formatEther(totalPrincipal))}{' '} */}
                            {rewardToken}
                          </h2>
                        </div>
                      </div>

                      <div>
                        <p>
                          {t('staking.lp.receive_token', { pool: data[0] })}
                        </p>
                        <div>
                          <p>{t('staking.lp.receive_button')}</p>
                        </div>
                      </div>
                    </div>

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
                                  {' ' + Token.UNI}
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
                                  console.log(e);
                                  // ReactGA.modalview(
                                  //   stakedToken +
                                  //     ModalViewType.StakingOrUnstakingModal,
                                  // );
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
                                {ethExpectedReward.before.isZero() ||
                                !account ? (
                                  '-'
                                ) : (
                                  <CountUp
                                    start={parseFloat(
                                      formatEther(ethExpectedReward.before),
                                    )}
                                    end={parseFloat(
                                      formatEther(
                                        ethExpectedReward.before.isZero()
                                          ? roundData[0].accountReward
                                          : ethExpectedReward.value,
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
                                  {' ' + rewardToken}
                                </span>
                              </h2>
                              <div
                                className={`staking__round__button ${
                                  ethExpectedReward.value.isZero() || !account
                                    ? ' disable'
                                    : ''
                                }`}
                                onClick={(e) => {
                                  if (
                                    ethExpectedReward.value.isZero() ||
                                    !account
                                  ) {
                                    return;
                                  }
                                  console.log(e);

                                  // ReactGA.modalview(
                                  //   stakedToken + ModalViewType.StakingIncentiveModal,
                                  // );
                                  setModalValue(ethExpectedReward.value);
                                  setModalType(StakingModalType.Claim);
                                }}>
                                <p>{t('staking.claim_reward')}</p>
                              </div>
                            </div>
                          </div>
                        </>
                      </div>
                    </section>
                  </section>
                );
              })}
            </>
          )
        ) : (
          <>
            <div style={{ marginTop: 300 }} />
            <div className="staking__coming-soon lp">
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
}

export default LPStaking;
