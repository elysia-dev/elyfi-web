import elfi from 'src/assets/images/ELFI.png';
import el from 'src/assets/images/el.png';
import envs from 'src/core/envs';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { constants } from 'ethers';
import Skeleton from 'react-loading-skeleton';
import {
  formatCommaSmall,
  formatSixFracionDigit,
  toPercentWithoutSign,
} from 'src/utiles/formatters';
import stakingRoundTimes from 'src/core/data/stakingRoundTimes';
import PriceContext from 'src/contexts/PriceContext';
import calcAPR from 'src/core/utils/calcAPR';
import {
  ELFIPerDayOnELStakingPool,
  DAIPerDayOnELFIStakingPool,
} from 'src/core/data/stakings';
import moment from 'moment';
import ClaimStakingRewardModal from 'src/components/ClaimStakingRewardModal';
import StakingModal from 'src/containers/StakingModal';
import Token from 'src/enums/Token';
import { useTranslation, Trans } from 'react-i18next';
import RoundData from 'src/core/types/RoundData';
import CountUp from 'react-countup';
import { formatEther } from 'ethers/lib/utils';
import MigrationModal from 'src/components/MigrationModal';
import StakingEnded from 'src/components/StakingEnded';
import MigrationEnded from 'src/components/MigrationEnded';
import useStakingPool from 'src/hooks/useStakingPool';
import ReactGA from 'react-ga';
import txStatus from 'src/enums/TxStatus';
import TransactionConfirmModal from 'src/components/TransactionConfirmModal';
import calcExpectedReward from 'src/core/utils/calcExpectedReward';
import LanguageType from 'src/enums/LanguageType';
import useStakingRoundData from 'src/hooks/useStakingRoundData';
import RewardPlanButton from 'src/components/RewardPlan/RewardPlanButton';
import GovernanceGuideBox from 'src/components/GovernanceGuideBox';
import Uniswap from 'src/assets/images/uniswap.png';
import toOrdinalNumber from 'src/utiles/toOrdinalNumber';
import useMediaQueryType from 'src/hooks/useMediaQueryType';
import MediaQuery from 'src/enums/MediaQuery';
import { useParams } from 'react-router-dom';
import ModalViewType from 'src/enums/ModalViewType';
import DrawWave from 'src/utiles/drawWave';
import TokenColors from 'src/enums/TokenColors';
import MainnetContext from 'src/contexts/MainnetContext';
import MainnetType from 'src/enums/MainnetType';
import ClaimDisableModal from 'src/components/ClaimDisableModal';
import MigrationDisableModal from 'src/components/MigrationDisableModal';

interface IProps {
  stakedToken: Token.EL | Token.ELFI;
  rewardToken: Token.ELFI | Token.DAI;
}

const v2Threshold = 2;

const migratable = (staked: Token, round: number): boolean => {
  if (round >= 5) return false;
  if (staked === Token.ELFI) {
    return (
      round >= 2 && moment().diff(stakingRoundTimes[round + 1].startedAt) > 0
    );
  } else {
    return moment().diff(stakingRoundTimes[round + 1].startedAt) > 0;
  }
};

const Staking: React.FunctionComponent<IProps> = ({
  stakedToken,
  rewardToken,
}) => {
  const { t, i18n } = useTranslation();
  const current = moment();
  const { account, library } = useWeb3React();
  const { elPrice, elfiPrice } = useContext(PriceContext);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const { contract: stakingPool } = useStakingPool(stakedToken);
  const { contract: stakingPoolV2, rewardContractForV2 } = useStakingPool(
    Token.ELFI,
    true,
  );
  const { type: getMainnetType } = useContext(MainnetContext);

  const currentPhase = useMemo(() => {
    return stakingRoundTimes.filter(
      (round) => current.diff(round.startedAt) >= 0,
    ).length;
  }, [current]);

  const [state, setState] = useState({
    selectPhase: currentPhase,
    txWaiting: false,
    txStatus: txStatus.IDLE,
  });

  const { apr: elPoolApr } = useStakingRoundData(
    state.selectPhase - 1,
    Token.EL,
    Token.ELFI,
  );
  const { apr: elfiPoolApr } = useStakingRoundData(
    state.selectPhase - 1,
    Token.ELFI,
    Token.DAI,
  );

  const [stakingModalVisible, setStakingModalVisible] =
    useState<boolean>(false);
  const [claimStakingRewardModalVisible, setClaimStakingRewardModalVisible] =
    useState<boolean>(false);
  const [migrationModalVisible, setMigrationModalVisible] =
    useState<boolean>(false);
  const [stakingEndedVisible, setStakingEndedVisible] =
    useState<boolean>(false);
  const [migrationEndedVisible, setMigrationEndedVisible] =
    useState<boolean>(false);
  const [claimDisableModalVisible, setClaimDisableModalVisible] =
    useState<boolean>(false);
  const [migrationDisableModalVisible, setMigrationDisableModalVisible] =
    useState<boolean>(false);
  const [transactionModal, setTransactionModal] = useState(false);

  const [selectModalRound, setRoundModal] = useState(0);
  const [modalValue, setModalValue] = useState(constants.Zero);

  const [roundData, setroundData] = useState<RoundData[]>([]);
  const currentRound = useMemo(() => {
    return roundData[currentPhase - 1];
  }, [currentPhase, roundData]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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

    if (mediaQuery === MediaQuery.Mobile) {
      new DrawWave(ctx, browserWidth).drawMobileOnPages(
        headerY,
        TokenColors.ELFI,
        browserHeight,
        true,
      );
      return;
    }

    new DrawWave(ctx, browserWidth).drawOnPages(
      headerY,
      stakedToken === Token.EL ? TokenColors.EL : TokenColors.ELFI,
      browserHeight,
      true,
    );
  };

  const fetchRoundData = async (account: string | null | undefined) => {
    try {
      const data = await Promise.all(
        stakingRoundTimes.map(async (_item, round) => {
          let poolData;
          let userData;
          let accountReward;
          if (stakingPoolV2 && stakingPool && account) {
            if (
              round >= v2Threshold &&
              stakedToken === Token.ELFI &&
              rewardContractForV2
            ) {
              const modifiedRound = (round + 1 - v2Threshold).toString();
              poolData = await stakingPoolV2.getPoolData(modifiedRound);
              userData = await stakingPoolV2.getUserData(
                modifiedRound,
                account,
              );
              accountReward = await rewardContractForV2.getUserReward(
                account,
                modifiedRound,
              );
            } else {
              const modifiedRound = (round + 1).toString();
              poolData = await stakingPool.getPoolData(modifiedRound);
              userData = await stakingPool.getUserData(modifiedRound, account);
              accountReward = await stakingPool.getUserReward(
                account,
                modifiedRound,
              );
            }

            return {
              accountReward,
              totalPrincipal: poolData.totalPrincipal,
              accountPrincipal: userData.userPrincipal,
              apr: calcAPR(
                poolData.totalPrincipal,
                stakedToken === Token.EL ? elPrice : elfiPrice,
                rewardToken === Token.ELFI
                  ? ELFIPerDayOnELStakingPool
                  : DAIPerDayOnELFIStakingPool,
                rewardToken === Token.ELFI ? elfiPrice : 1,
              ),
              loadedAt: moment(),
              startedAt: stakingRoundTimes[round].startedAt,
              endedAt: stakingRoundTimes[round].endedAt,
            } as RoundData;
          } else {
            return {
              accountReward: constants.Zero,
              totalPrincipal: constants.Zero,
              accountPrincipal: constants.Zero,
              apr: stakedToken === Token.ELFI ? elfiPoolApr : elPoolApr,
              loadedAt: moment(),
              startedAt: stakingRoundTimes[round].startedAt,
              endedAt: stakingRoundTimes[round].endedAt,
            } as RoundData;
          }
        }),
      );

      setroundData(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      const data = await Promise.all(
        stakingRoundTimes.map(async (_item, round) => {
          return {
            accountReward: constants.Zero,
            totalPrincipal: constants.Zero,
            accountPrincipal: constants.Zero,
            apr: stakedToken === Token.ELFI ? elfiPoolApr : elPoolApr,
            loadedAt: moment(),
            startedAt: stakingRoundTimes[round].startedAt,
            endedAt: stakingRoundTimes[round].endedAt,
          } as RoundData;
        }),
      );
      setroundData(data);
      setLoading(false);
      setError(true);
    }
  };

  useEffect(() => {
    fetchRoundData(account);
  }, [account, elfiPoolApr, elPoolApr]);

  useEffect(() => {
    if (error || loading) return;

    const interval = setInterval(() => {
      // FIXME
      // currentRound is not return 4 when there is no round
      // For temp usage, use round 4 data
      if (!roundData[2]) return;
      setExpectedReward({
        before: expectedReward.value.isZero()
          ? roundData[5].accountReward
          : expectedReward.value,
        value: calcExpectedReward(
          roundData[5],
          rewardToken === Token.ELFI
            ? ELFIPerDayOnELStakingPool
            : DAIPerDayOnELFIStakingPool,
        ),
      });
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  });

  const getStatus = (status: txStatus) => {
    setState({ ...state, txStatus: status });
  };
  const getWaiting = (isWaiting: boolean) => {
    setState({ ...state, txWaiting: isWaiting });
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
      <TransactionConfirmModal
        visible={transactionModal}
        closeHandler={() => {
          setTransactionModal(false);
        }}
      />
      <ClaimStakingRewardModal
        visible={claimStakingRewardModalVisible}
        stakedToken={stakedToken}
        token={rewardToken}
        balance={
          moment().isBetween(
            stakingRoundTimes[selectModalRound].startedAt,
            stakingRoundTimes[selectModalRound].endedAt,
          )
            ? expectedReward
            : undefined
        }
        endedBalance={
          (!moment().isBetween(
            stakingRoundTimes[selectModalRound].startedAt,
            stakingRoundTimes[selectModalRound].endedAt,
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
        closeHandler={() => setClaimStakingRewardModalVisible(false)}
        afterTx={() => {
          account && fetchRoundData(account);
        }}
        transactionModal={() => setTransactionModal(true)}
      />
      <StakingModal
        visible={stakingModalVisible}
        closeHandler={() => setStakingModalVisible(false)}
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
          setStakingEndedVisible(true);
        }}
        setTxStatus={getStatus}
        setTxWaiting={getWaiting}
        transactionModal={() => setTransactionModal(true)}
      />
      <MigrationModal
        visible={migrationModalVisible}
        closeHandler={() => setMigrationModalVisible(false)}
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
      />
      <StakingEnded
        visible={stakingEndedVisible}
        onClose={() => {
          setStakingEndedVisible(false);
          setState({ ...state, selectPhase: currentPhase });
        }}
        round={selectModalRound + 1}
      />
      <MigrationEnded
        visible={migrationEndedVisible}
        onClose={() => {
          setMigrationEndedVisible(false);
          setState({ ...state, selectPhase: currentPhase });
        }}
        round={selectModalRound + 1}
      />
      <ClaimDisableModal
        visible={claimDisableModalVisible}
        onClose={() => {
          setClaimDisableModalVisible(false);
        }}
      />
      <MigrationDisableModal
        visible={migrationDisableModalVisible}
        onClose={() => {
          setMigrationDisableModalVisible(false)
          setStakingModalVisible(true)
        }}
      />
      {/* <img
        style={{
          position: 'absolute',
          left: 0,
          top: tokenRef.current?.offsetTop,
          width: '100%',
          zIndex: -1,
        }}
        src={wave}
        alt={wave}
      /> */}
      <section className="staking">
        <section>
          <div ref={headerRef} className="staking__title">
            <h2>
              {t('staking.staking__token', {
                token: stakedToken.toUpperCase(),
              })}
            </h2>
            {getMainnetType === MainnetType.Ethereum && (
              <>
                <p>
                  {stakedToken === Token.EL
                    ? t('staking.el.staking__content')
                    : t('staking.elfi.staking__content')}
                </p>
                <div className="staking__title__button">
                  <a
                    href={
                      stakedToken === Token.ELFI
                        ? 'https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x4da34f8264cb33a5c9f17081b9ef5ff6091116f4'
                        : lng === LanguageType.KO
                          ? 'https://coinmarketcap.com/ko/currencies/elysia/markets/'
                          : 'https://coinmarketcap.com/currencies/elysia/markets/'
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    {stakedToken === Token.ELFI && (
                      <img src={Uniswap} alt="Uniswap" />
                    )}
                    <p>
                      {stakedToken === Token.EL
                        ? t('staking.el.staking__content--button')
                        : t('staking.elfi.staking__content--button')}
                    </p>
                  </a>
                </div>
              </>
            )}
          </div>
          {getMainnetType === MainnetType.Ethereum ? (
            <section>
              {stakedToken === Token.ELFI && <GovernanceGuideBox />}
              <div className="staking__title__content__wrapper">
                {mediaQuery === MediaQuery.PC ? (
                  <>
                    <div className="staking__title__content__token-wrapper">
                      <img src={stakedToken === Token.EL ? el : elfi} />
                      <h2>
                        {t('staking.staking__token', {
                          token: stakedToken.toUpperCase(),
                        })}
                      </h2>
                    </div>
                    <div className="staking__title__content">
                      <p>
                        {t('staking.staking__notice', {
                          stakedToken,
                          rewardToken,
                        })}
                      </p>
                      <RewardPlanButton stakingType={stakedToken} />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="staking__title__content__token-wrapper">
                      <div>
                        <img src={stakedToken === Token.EL ? el : elfi} />
                        <h2>
                          {t('staking.staking__token', {
                            token: stakedToken.toUpperCase(),
                          })}
                        </h2>
                      </div>
                      <RewardPlanButton stakingType={stakedToken} />
                    </div>
                    <div className="staking__title__content">
                      <p>
                        {t('staking.staking__notice', {
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
                    <div
                      className="staking__round__border"
                      style={{
                        height: roundDataLength,
                      }}
                    />
                    <div className="staking__round__container">
                      <section className="staking__round__current-data">
                        {current.diff(
                          stakingRoundTimes[currentPhase - 1].endedAt,
                        ) >= 0 ? (
                          <p>{t('staking.current_round_null')}</p>
                        ) : (
                          <>
                            <div>
                              <div>
                                <p>
                                  <Trans
                                    i18nKey="staking.staking__in_progress"
                                    values={{
                                      nth: toOrdinalNumber(
                                        i18n.language,
                                        currentPhase,
                                      ),
                                    }}
                                  />
                                </p>
                              </div>
                              {mediaQuery === MediaQuery.PC ? (
                                <h2>
                                  {stakingRoundTimes[
                                    currentPhase - 1
                                  ].startedAt.format('YYYY.MM.DD HH:mm:ss')}
                                  &nbsp;~&nbsp;
                                  {stakingRoundTimes[
                                    currentPhase - 1
                                  ].endedAt.format('YYYY.MM.DD HH:mm:ss')}
                                  &nbsp;(KST)
                                </h2>
                              ) : (
                                <div>
                                  <h2>
                                    {stakingRoundTimes[
                                      currentPhase - 1
                                    ].startedAt.format('YYYY.MM.DD HH:mm:ss')}
                                  </h2>
                                  <h2>&nbsp;~&nbsp;</h2>
                                  <h2>
                                    {stakingRoundTimes[
                                      currentPhase - 1
                                    ].endedAt.format('YYYY.MM.DD HH:mm:ss')}
                                    &nbsp;(KST)
                                  </h2>
                                </div>
                              )}
                            </div>
                            <div>
                              <p>APR</p>
                              <h2 className="percent">
                                {current.diff(
                                  stakingRoundTimes[currentPhase - 1].startedAt,
                                ) <= 0 ||
                                  currentRound?.apr.eq(constants.MaxUint256) ||
                                  current.diff(
                                    stakingRoundTimes[currentPhase - 1].endedAt,
                                  ) >= 0
                                  ? '-'
                                  : toPercentWithoutSign(
                                    currentRound?.apr || '0',
                                  )}
                              </h2>
                            </div>
                          </>
                        )}
                      </section>

                      <section className="staking__round__previous__wrapper">
                        {
                          // eslint-disable-next-line array-callback-return
                          roundData.map((item, index) => {
                            if (current.diff(item.endedAt) > 0) {
                              return (
                                <div
                                  className="staking__round__previous"
                                  key={index}>
                                  <div>
                                    <div className="staking__round__previous__title">
                                      <h2>
                                        {t('staking.nth', {
                                          nth: toOrdinalNumber(
                                            i18n.language,
                                            index + 1,
                                          ),
                                        })}
                                      </h2>
                                      {mediaQuery === MediaQuery.PC ? (
                                        <p>
                                          {stakingRoundTimes[
                                            index
                                          ].startedAt.format(
                                            'YYYY.MM.DD HH:mm:ss',
                                          )}
                                          <br />
                                          ~&nbsp;
                                          {stakingRoundTimes[
                                            index
                                          ].endedAt.format(
                                            'YYYY.MM.DD HH:mm:ss',
                                          )}
                                          &nbsp;(KST)
                                        </p>
                                      ) : (
                                        <div>
                                          <p>
                                            {stakingRoundTimes[
                                              index
                                            ].startedAt.format(
                                              'YYYY.MM.DD HH:mm:ss',
                                            )}
                                          </p>
                                          <p>
                                            <br />
                                            ~&nbsp;
                                          </p>
                                          <p>
                                            {stakingRoundTimes[
                                              index
                                            ].endedAt.format(
                                              'YYYY.MM.DD HH:mm:ss',
                                            )}
                                            &nbsp;(KST)
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                    <div className="staking__round__previous__body">
                                      <div>
                                        <p>{t('staking.staking_amount')}</p>
                                        <h2>
                                          {`${formatCommaSmall(
                                            item.accountPrincipal,
                                          ) || '-'
                                            }`}
                                          <span className="token-amount bold">
                                            {stakedToken}
                                          </span>
                                        </h2>
                                      </div>
                                      <div>
                                        <p>{t('staking.reward_amount')}</p>
                                        <h2>
                                          {item.accountReward.isZero() ? (
                                            '-'
                                          ) : (
                                            <CountUp
                                              start={parseFloat(
                                                formatEther(item.accountReward),
                                              )}
                                              end={parseFloat(
                                                formatEther(item.accountReward),
                                              )}
                                              formattingFn={(number) => {
                                                return formatSixFracionDigit(
                                                  number,
                                                );
                                              }}
                                              decimals={6}
                                              duration={1}
                                            />
                                          )}
                                          <span className="token-amount bold">
                                            {rewardToken}
                                          </span>
                                        </h2>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="staking__round__button__wrapper">
                                    <div
                                      className={`staking__round__button ${item.accountPrincipal.isZero()
                                          ? ' disable'
                                          : ''
                                        }`}
                                      onClick={(e) => {
                                        if (item.accountPrincipal.isZero()) {
                                          return;
                                        }

                                        if (migratable(stakedToken, index)) {
                                          if (stakedToken === Token.ELFI) {
                                           setMigrationDisableModalVisible(true)
                                          } else {
                                            ReactGA.modalview(
                                              stakedToken +
                                                ModalViewType.MigrationOrUnstakingModal,
                                            );
                                            setRoundModal(index);
                                            setModalValue(item.accountPrincipal);
                                            return setMigrationModalVisible(true);
                                          }
                                        }
                                        if (
                                          current.diff(
                                            stakingRoundTimes[index].startedAt,
                                          ) > 0
                                        ) {
                                          ReactGA.modalview(
                                            stakedToken +
                                            ModalViewType.StakingOrUnstakingModal,
                                          );
                                          setRoundModal(index);
                                          setModalValue(item.accountPrincipal);
                                          if (stakedToken === Token.EL) {
                                            setStakingModalVisible(true);
                                          } 
                                        }
                                      }}>
                                      <p>
                                        {
                                          stakedToken === Token.ELFI 
                                            ? t("staking.unstaking")
                                            : migratable(stakedToken, index)
                                              ? t('staking.unstaking_migration')
                                              : t('staking.staking_btn')}
                                      </p>
                                    </div>
                                    <div
                                      className={`staking__round__button ${item.accountReward.isZero()
                                          ? ' disable'
                                          : ''
                                        }`}
                                      onClick={(e) => {
                                        if (item.accountReward.isZero()) {
                                          return;
                                        }
                                        ReactGA.modalview(
                                          stakedToken +
                                            ModalViewType.StakingIncentiveModal,
                                        );
                                        current.diff(
                                          stakingRoundTimes[index].startedAt,
                                        ) > 0 && setRoundModal(index);
                                        setModalValue(item.accountReward);
                                        setClaimStakingRewardModalVisible(true);
                                      }}>
                                      <p>{t('staking.claim_reward')}</p>
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                          })
                        }
                      </section>

                      <section className="staking__round__remaining-data current">
                        <div className="staking__round__remaining-data__title">
                          <div>
                            <h2>
                              {t('staking.nth', {
                                nth: toOrdinalNumber(i18n.language, 6),
                              })}
                            </h2>
                            <p>
                              {stakingRoundTimes[5].startedAt.format(
                                'YYYY.MM.DD HH:mm:ss',
                              )}
                              <br />
                              ~&nbsp;
                              {stakingRoundTimes[5].endedAt.format(
                                'YYYY.MM.DD HH:mm:ss',
                              )}{' '}
                              (KST)
                            </p>
                          </div>
                          {mediaQuery === MediaQuery.PC && (
                            <div>
                              <p>APR</p>
                              <h2 className="percent">
                                {current.diff(stakingRoundTimes[5].startedAt) <=
                                  0 ||
                                  roundData[5]?.apr.eq(constants.MaxUint256) ||
                                  current.diff(stakingRoundTimes[5].endedAt) >= 0
                                  ? '-'
                                  : toPercentWithoutSign(roundData[5].apr || 0)}
                              </h2>
                            </div>
                          )}
                        </div>
                        <div className="staking__round__remaining-data__body">
                          {mediaQuery === MediaQuery.PC ? (
                            <>
                              <div>
                                <h2>{t('staking.staking_amount')}</h2>
                                <div>
                                  <h2>
                                    {`${current.diff(
                                      stakingRoundTimes[5].startedAt,
                                    ) > 0
                                        ? formatCommaSmall(
                                          roundData[5]?.accountPrincipal ||
                                          '0',
                                        )
                                        : '-'
                                      }`}
                                    <span className="token-amount bold">
                                      {stakedToken}
                                    </span>
                                  </h2>
                                  <div
                                    className={`staking__round__button ${current.diff(
                                      stakingRoundTimes[5].startedAt,
                                    ) <= 0 || !account
                                        ? ' disable'
                                        : ''
                                      }`}
                                    onClick={(e) => {
                                      if (
                                        current.diff(
                                          stakingRoundTimes[5].startedAt,
                                        ) < 0 ||
                                        current.diff(
                                          stakingRoundTimes[5].endedAt,
                                        ) > 0 ||
                                        !account
                                      ) {
                                        return;
                                      }
                                      ReactGA.modalview(
                                        stakedToken +
                                        ModalViewType.StakingOrUnstakingModal,
                                      );
                                      setRoundModal(5);
                                      setModalValue(
                                        currentRound.accountPrincipal,
                                      );
                                      setStakingModalVisible(true);
                                    }}>
                                    <p>{t('staking.staking_btn')}</p>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <h2>{t('staking.reward_amount')}</h2>
                                <div>
                                  <h2>
                                    {expectedReward.before.isZero() ? (
                                      '-'
                                    ) : (
                                      <CountUp
                                        start={parseFloat(
                                          formatEther(expectedReward.before),
                                        )}
                                        end={parseFloat(
                                          formatEther(
                                            expectedReward.before.isZero()
                                              ? currentRound.accountReward
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
                                      expectedReward.value.isZero()
                                        ? ' disable'
                                        : ''
                                    }`}
                                    onClick={(e) => {
                                      if (expectedReward.value.isZero()) {
                                        return;
                                      }

                                      ReactGA.modalview(
                                         stakedToken +
                                          ModalViewType.StakingIncentiveModal,
                                      );
                                      current.diff(
                                        stakingRoundTimes[5].startedAt,
                                      ) > 0 && setRoundModal(5);
                                      setModalValue(expectedReward.value);
                                      setClaimStakingRewardModalVisible(true);
                                    }}>
                                    <p>{t('staking.claim_reward')}</p>
                                  </div>
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              <div>
                                <div>
                                  <p>APR</p>
                                  <h2 className="percent">
                                    {current.diff(
                                      stakingRoundTimes[5].startedAt,
                                    ) <= 0 ||
                                      roundData[5]?.apr.eq(
                                        constants.MaxUint256,
                                      ) ||
                                      current.diff(
                                        stakingRoundTimes[5].endedAt,
                                      ) >= 0
                                      ? '-'
                                      : toPercentWithoutSign(
                                        roundData[5].apr || 0,
                                      )}
                                  </h2>
                                </div>
                                <div>
                                  <p>{t('staking.staking_amount')}</p>
                                  <h2>
                                    {`${current.diff(
                                      stakingRoundTimes[5].startedAt,
                                    ) > 0
                                        ? formatCommaSmall(
                                          roundData[5]?.accountPrincipal ||
                                          '0',
                                        )
                                        : '-'
                                      }`}
                                    <span className="token-amount bold">
                                      {stakedToken}
                                    </span>
                                  </h2>
                                </div>
                                <div>
                                  <p>{t('staking.reward_amount')}</p>
                                  <h2>
                                    {expectedReward.before.isZero() ? (
                                      '-'
                                    ) : (
                                      <CountUp
                                        start={parseFloat(
                                          formatEther(expectedReward.before),
                                        )}
                                        end={parseFloat(
                                          formatEther(
                                            expectedReward.before.isZero()
                                              ? currentRound.accountReward
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
                                </div>
                              </div>
                              <div>
                                <div
                                  className={`staking__round__button ${current.diff(
                                    stakingRoundTimes[5].startedAt,
                                  ) <= 0 || !account
                                      ? ' disable'
                                      : ''
                                    }`}
                                  onClick={(e) => {
                                    if (
                                      current.diff(
                                        stakingRoundTimes[5].startedAt,
                                      ) < 0 ||
                                      current.diff(
                                        stakingRoundTimes[5].endedAt,
                                      ) > 0 ||
                                      !account
                                    ) {
                                      return;
                                    }
                                    ReactGA.modalview(
                                      stakedToken +
                                      ModalViewType.StakingOrUnstakingModal,
                                    );
                                    setRoundModal(5);
                                    setModalValue(
                                      currentRound.accountPrincipal,
                                    );
                                    setStakingModalVisible(true);
                                  }}>
                                  <p>{t('staking.staking_btn')}</p>
                                </div>
                                <div
                                  className={`staking__round__button ${
                                    expectedReward.value.isZero()
                                      ? ' disable'
                                      : ''
                                  }`}
                                  onClick={(e) => {
                                    if (expectedReward.value.isZero()) {
                                      return;
                                    }
                                    ReactGA.modalview(
                                      stakedToken +
                                      ModalViewType.StakingIncentiveModal,
                                    );
                                    current.diff(
                                      stakingRoundTimes[5].startedAt,
                                    ) > 0 && setRoundModal(5);
                                    setModalValue(expectedReward.value);
                                    setClaimStakingRewardModalVisible(true);
                                  }}>
                                  <p>{t('staking.claim_reward')}</p>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </section>

                      {/* <section>
                        <section className="staking__round__remaining-data waiting">
                          {
                            // eslint-disable-next-line array-callback-return
                            roundData.map((item, index) => {
                              if (current.diff(item.startedAt) < 0) {
                                return (
                                  <>
                                    <div className="staking__round__remaining-data__title">
                                      <div>
                                        <h2>
                                          {t('staking.nth', {
                                            nth: toOrdinalNumber(
                                              i18n.language,
                                              index + 1,
                                            ),
                                          })}
                                        </h2>
                                        <p>
                                          {stakingRoundTimes[
                                            index
                                          ].startedAt.format(
                                            'YYYY.MM.DD HH:mm:ss',
                                          )}
                                          <br />
                                          ~&nbsp;
                                          {stakingRoundTimes[
                                            index
                                          ].endedAt.format(
                                            'YYYY.MM.DD HH:mm:ss',
                                          )}{' '}
                                          (KST)
                                        </p>
                                      </div>
                                      {mediaQuery === MediaQuery.PC && (
                                        <div>
                                          <h2 className="percent">-</h2>
                                        </div>
                                      )}
                                    </div>
                                    <div className="staking__round__remaining-data__body">
                                      {mediaQuery === MediaQuery.PC ? (
                                        <>
                                          <div>
                                            <h2>
                                              {t('staking.staking_amount')}
                                            </h2>
                                            <div>
                                              <h2>
                                                -
                                                <span className="token-amount bold">
                                                  {stakedToken}
                                                </span>
                                              </h2>
                                              <div
                                                className={`staking__round__button disable`}>
                                                <p>
                                                  {t('staking.staking_btn')}
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                          <div>
                                            <h2>
                                              {t('staking.reward_amount')}
                                            </h2>
                                            <div>
                                              <h2>
                                                -
                                                <span className="token-amount bold">
                                                  {rewardToken}
                                                </span>
                                              </h2>
                                              <div
                                                className={`staking__round__button disable`}>
                                                <p>
                                                  {t('staking.claim_reward')}
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                        </>
                                      ) : (
                                        <>
                                          <div>
                                            <div>
                                              <p>APR</p>
                                              <h2 className="percent">-</h2>
                                            </div>
                                            <div>
                                              <p>
                                                {t('staking.staking_amount')}
                                              </p>
                                              <h2>
                                                -
                                                <span className="token-amount bold">
                                                  {stakedToken}
                                                </span>
                                              </h2>
                                            </div>
                                            <div>
                                              <p>
                                                {t('staking.reward_amount')}
                                              </p>
                                              <h2>
                                                -
                                                <span className="token-amount bold">
                                                  {rewardToken}
                                                </span>
                                              </h2>
                                            </div>
                                          </div>
                                          <div>
                                            <div
                                              className={`staking__round__button disable`}>
                                              <p>{t('staking.staking_btn')}</p>
                                            </div>
                                            <div
                                              className={`staking__round__button disable`}>
                                              <p>{t('staking.claim_reward')}</p>
                                            </div>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </>
                                );
                              }
                            })
                          }
                        </section>
                      </section> */}
                    </div>
                  </section>
                </>
              )}
            </section>
          ) : (
            <>
              <div style={{ marginTop: 300 }} />
              <div
                className={`staking__coming-soon ${stakedToken === Token.EL ? 'el' : 'elfi'
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
      </section>
    </>
  );
};

export const StakingEL = (): JSX.Element => {
  return <Staking stakedToken={Token.EL} rewardToken={Token.ELFI} />;
};

export const StakingELFI = (): JSX.Element => {
  return <Staking stakedToken={Token.ELFI} rewardToken={Token.DAI} />;
};

export default Staking;
