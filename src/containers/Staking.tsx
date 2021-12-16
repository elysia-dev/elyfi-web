import { Title } from 'src/components/Texts';
import Header from 'src/components/Header';

import { useContext, useEffect, useMemo, useState } from 'react';
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
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const current = moment();
  const { account } = useWeb3React();
  const { elPrice, elfiPrice } = useContext(PriceContext);

  const stakingPool = useStakingPool(stakedToken);
  const stakingPoolV2 = useStakingPool(Token.ELFI, true);

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

  const fetchRoundData = async (account: string) => {
    try {
      const data = await Promise.all(
        stakingRoundTimes.map(async (_item, round) => {
          let poolData;
          let userData;
          let accountReward;

          if (round >= v2Threshold && stakedToken === Token.ELFI) {
            const modifiedRound = (round + 1 - v2Threshold).toString();
            poolData = await stakingPoolV2.getPoolData(modifiedRound);
            userData = await stakingPoolV2.getUserData(modifiedRound, account);
            accountReward = await stakingPoolV2.getUserReward(
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
        }),
      );
      setroundData(data);
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(true);
      setError(true);
    }
  };

  useEffect(() => {
    if (account) {
      fetchRoundData(account);
    }
  }, [account]);

  useEffect(() => {
    if (error || loading) return;

    const interval = setInterval(() => {
      // FIXME
      // currentRound is not return 4 when there is no round
      // For temp usage, use round 4 data
      if (!roundData[2]) return;

      setExpectedReward({
        before: expectedReward.value.isZero()
          ? roundData[4].accountReward
          : expectedReward.value,
        value: calcExpectedReward(
          roundData[4],
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

  return (
    <>
      <Header
        title={t('staking.token_staking', { stakedToken }).toUpperCase()}
      />
      <TransactionConfirmModal
        visible={transactionModal}
        closeHandler={() => {
          setTransactionModal(false);
        }}
      />
      <section className="staking">
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
        <Title label={t('staking.token_staking', { stakedToken })} />
        <div>
          <p>
            {t('staking.token_staking--content.0', {
              stakedToken,
              rewardToken,
            })}
            <br />
            {t('staking.token_staking--content.1', {
              stakedToken,
              rewardToken,
            })}
            <br />
            {t('staking.token_staking--content.2', {
              stakedToken,
              rewardToken,
            })}
            <br />
            <br />
            {t('staking.token_staking--content.3')}
            <a
              href={`https://elyfi.world/${
                (window.localStorage.getItem('@language') as LanguageType) ||
                'en'
              }/rewards`}
              target="_blank"
              className="link">
              {t('staking.token_staking--content.4')}
            </a>
            {t('staking.token_staking--content.5')}
          </p>
        </div>

        {loading ? (
          <Skeleton width={'100%'} height={600} />
        ) : (
          <>
            <div className="staking__round">
              <div
                className="staking__round__border pc-only"
                style={{ height: 920 }}
              />
              <div className="staking__round__container">
                <div>
                  <div className="staking__round__current-data">
                    {current.diff(
                      stakingRoundTimes[currentPhase - 1].endedAt,
                    ) >= 0 ? (
                      <p>{t('staking.current_round_null')}</p>
                    ) : (
                      <>
                        <div>
                          <div>
                            <p className="spoqa">
                              {t('staking.current_round')} :
                            </p>
                            <p className="spoqa__bold">
                              {t('staking.nth', { nth: currentPhase })}
                            </p>
                          </div>
                          <p className="spoqa__bold">
                            {stakingRoundTimes[
                              currentPhase - 1
                            ].startedAt.format('YYYY.MM.DD HH:mm:ss')}
                            &nbsp;~&nbsp;
                            <br className="mobile-only" />
                            {stakingRoundTimes[currentPhase - 1].endedAt.format(
                              'YYYY.MM.DD HH:mm:ss',
                            )}{' '}
                            (KST)
                          </p>
                        </div>
                        <div>
                          <p className="spoqa">APR</p>
                          <p className="spoqa__bold">
                            <span className="spoqa__bold">
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
                            </span>
                            <span className="spoqa__bold staking__sign">
                              &nbsp;%
                            </span>
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="staking__round__previous__wrapper">
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
                                  <p className="spoqa__bold">
                                    {t('staking.nth', { nth: index + 1 })}
                                  </p>
                                  <p className="spoqa">
                                    {stakingRoundTimes[index].startedAt.format(
                                      'YYYY.MM.DD HH:mm:ss',
                                    )}
                                    <br />~{' '}
                                    {stakingRoundTimes[index].endedAt.format(
                                      'YYYY.MM.DD HH:mm:ss',
                                    )}{' '}
                                    (KST)
                                  </p>
                                </div>
                                <div className="staking__round__previous__body">
                                  <div>
                                    <p className="spoqa__bold">
                                      {t('staking.staking_amount')}
                                    </p>
                                    <p className="spoqa__bold">
                                      {`${
                                        formatCommaSmall(
                                          item.accountPrincipal,
                                        ) || '-'
                                      }`}
                                      <span className="spoqa__bold">
                                        &nbsp;{stakedToken}
                                      </span>
                                    </p>
                                  </div>
                                  <div>
                                    <p className="spoqa__bold">
                                      {t('staking.reward_amount')}
                                    </p>
                                    <p className="spoqa__bold">
                                      {item.accountReward.isZero() ? (
                                        '-'
                                      ) : (
                                        <CountUp
                                          className={`spoqa__bold colored ${
                                            rewardToken === Token.ELFI
                                              ? 'EL'
                                              : 'ELFI'
                                          }`}
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
                                      <span className="spoqa__bold">
                                        &nbsp;{rewardToken}
                                      </span>
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className="staking__round__previous__button">
                                <div
                                  className={
                                    item.accountPrincipal.isZero()
                                      ? 'button--disable'
                                      : ``
                                  }
                                  onClick={(e) => {
                                    if (item.accountPrincipal.isZero()) {
                                      return;
                                    }

                                    if (migratable(stakedToken, index)) {
                                      ReactGA.modalview(
                                        `${stakedToken}Migration`,
                                      );
                                      setRoundModal(index);
                                      setModalValue(item.accountPrincipal);
                                      return setMigrationModalVisible(true);
                                    }
                                    if (
                                      current.diff(
                                        stakingRoundTimes[index].startedAt,
                                      ) > 0
                                    ) {
                                      ReactGA.modalview(
                                        `${stakedToken}Staking`,
                                      );
                                      setRoundModal(index);
                                      setModalValue(item.accountPrincipal);
                                      setStakingModalVisible(true);
                                    }
                                  }}>
                                  <p>
                                    {migratable(stakedToken, index)
                                      ? t('staking.unstaking_migration')
                                      : t('staking.staking_btn')}
                                  </p>
                                </div>
                                <div
                                  className={
                                    item.accountReward.isZero()
                                      ? 'button--disable'
                                      : ''
                                  }
                                  onClick={(e) => {
                                    if (item.accountReward.isZero()) {
                                      return;
                                    }
                                    ReactGA.modalview(
                                      `${stakedToken}StakingReward`,
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
                  </div>

                  <div className="staking__round__remaining-data current">
                    <div className="staking__round__remaining-data__title">
                      <div>
                        <p className="spoqa__bold">
                          {t('staking.nth', { nth: 5 })}
                        </p>
                        <p>
                          {stakingRoundTimes[4].startedAt.format(
                            'YYYY.MM.DD HH:mm:ss',
                          )}
                          <br />
                          ~&nbsp;
                          {stakingRoundTimes[4].endedAt.format(
                            'YYYY.MM.DD HH:mm:ss',
                          )}{' '}
                          (KST)
                        </p>
                      </div>
                      <div>
                        <p className="spoqa">APR</p>
                        <p className="spoqa__bold">
                          {current.diff(stakingRoundTimes[4].startedAt) <= 0 ||
                          roundData[4]?.apr.eq(constants.MaxUint256) ||
                          current.diff(stakingRoundTimes[4].endedAt) >= 0
                            ? '-'
                            : toPercentWithoutSign(roundData[4].apr || 0)}
                          <span className="spoqa__bold staking__sign">
                            &nbsp;%
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="staking__round__remaining-data__body">
                      <div>
                        <p className="spoqa__bold">
                          {t('staking.staking_amount')}
                        </p>
                        <div>
                          <h2>
                            {`${
                              current.diff(stakingRoundTimes[4].startedAt) > 0
                                ? formatCommaSmall(
                                    roundData[4]?.accountPrincipal || '0',
                                  )
                                : '-'
                            }`}
                            <span className="spoqa__bold">{stakedToken}</span>
                          </h2>
                          <div
                            className={`staking__button ${
                              current.diff(stakingRoundTimes[4].startedAt) <= 0
                                ? 'disable'
                                : ''
                            }`}
                            onClick={(e) => {
                              if (
                                current.diff(stakingRoundTimes[4].startedAt) <
                                  0 ||
                                current.diff(stakingRoundTimes[4].endedAt) > 0
                              ) {
                                return;
                              }
                              ReactGA.modalview(`${stakedToken}Staking`);
                              setRoundModal(4);
                              setModalValue(currentRound.accountPrincipal);
                              setStakingModalVisible(true);
                            }}>
                            <p>{t('staking.staking_btn')}</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="spoqa__bold">
                          {t('staking.reward_amount')}
                        </p>
                        <div>
                          <h2>
                            {expectedReward.before.isZero() ? (
                              '-'
                            ) : (
                              <CountUp
                                className={`spoqa__bold colored ${
                                  rewardToken === Token.ELFI ? 'EL' : 'ELFI'
                                }`}
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
                            <span className="spoqa__bold">{rewardToken}</span>
                          </h2>
                          <div
                            className={
                              expectedReward.value.isZero()
                                ? 'button--disable'
                                : ''
                            }
                            onClick={(e) => {
                              if (expectedReward.value.isZero()) {
                                return;
                              }
                              ReactGA.modalview(`${stakedToken}StakingReward`);

                              current.diff(stakingRoundTimes[4].startedAt) >
                                0 && setRoundModal(4);
                              setModalValue(expectedReward.value);
                              setClaimStakingRewardModalVisible(true);
                            }}>
                            <p>{t('staking.claim_reward')}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </section>
    </>
  );
};

export const StakingEL = () => {
  return <Staking stakedToken={Token.EL} rewardToken={Token.ELFI} />;
};

export const StakingELFI = () => {
  return <Staking stakedToken={Token.ELFI} rewardToken={Token.DAI} />;
};

export default Staking;
