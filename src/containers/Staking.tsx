import { Title } from 'src/components/Texts';
import Header from 'src/components/Header';
import elfi from 'src/assets/images/ELFI.png';
import el from 'src/assets/images/el.png';
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
import useStakingRoundData from 'src/hooks/useStakingRoundData';
import RewardPlanButton from 'src/components/RewardPlan/RewardPlanButton';
import GovernanceGuideBox from 'src/components/GovernanceGuideBox';
import Uniswap from "src/assets/images/uniswap.png";

interface IProps {
  stakedToken: Token.EL | Token.ELFI;
  rewardToken: Token.ELFI | Token.DAI;
}

const v2Threshold = 2;

const migratable = (staked: Token, round: number): boolean => {
  if (round >= 3) return false;
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

  const { apr: elPoolApr } = useStakingRoundData(
    state.selectPhase,
    Token.EL,
    Token.ELFI,
  );
  const { apr: elfiPoolApr } = useStakingRoundData(
    state.selectPhase,
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

  const roundDataLength = useMemo(()=> {
    return ((roundData.filter(
      (data) => current.diff(data.endedAt) > 0
    ).length * 135) // previous length
    + 90 // margin
    + 55 // current container height / 2
    + 90 // remaining container height / 2
    )
  }, [roundData])

  const fetchRoundData = async (account: string | null | undefined) => {
    try {
      const data = await Promise.all(
        stakingRoundTimes.map(async (_item, round) => {
          let poolData;
          let userData;
          let accountReward;
          if (stakingPoolV2 && stakingPool && account) {
            if (round >= v2Threshold && stakedToken === Token.ELFI) {
              const modifiedRound = (round + 1 - v2Threshold).toString();
              poolData = await stakingPoolV2.getPoolData(modifiedRound);
              userData = await stakingPoolV2.getUserData(
                modifiedRound,
                account,
              );
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
    } catch (e) {
      console.log(e);
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
          ? roundData[3].accountReward
          : expectedReward.value,
        value: calcExpectedReward(
          roundData[3],
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
            selectModalRound === 2
              ? roundData[selectModalRound]?.accountReward || constants.Zero
              : roundData[selectModalRound]?.accountReward || constants.Zero
          }
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
      <section className="staking">
        <section>
          <div className="staking__title">
            <h2>
              {stakedToken.toUpperCase()} 토큰 스테이킹
            </h2>
            <p>
              {stakedToken === Token.EL ? 
                "EL 토큰을 스테이킹하고 보상 토큰 ELFI를 받아가세요!" :
                "ELFI 토큰을 스테이킹하고 보상 토큰과 투표권을 받아가세요!\nELFI 홀더들은 보유한 ELFI를 스테이킹함으로써 탈중앙 거버넌스에 참여할 수 있으며,\n스테이킹시 프로토콜 순이익을 분배 받을 수 있습니다"  
              }
            </p>
            <div className="staking__title__button">
              {stakedToken === Token.ELFI && (
                <img src={Uniswap} alt="Uniswap" />
              )}
              <p>
                {
                  stakedToken === Token.EL ? 
                    "EL 토큰 구매하러 가기" :
                    "유니스왑에서 ELFI 토큰 구매하기"
                }
              </p>
            </div>
          </div>
          {
            stakedToken === Token.ELFI && (
              <section className="governance__elyfi-graph" style={{ marginBottom: 50 }}>
                <div>
                  <div>
                    <p>
                      ELYFI
                    </p>
                  </div>
                </div>
                <div className="governance__elyfi-graph__arrow-container">
                  <div>
                    <p>
                      프로토콜 순 이익
                    </p>
                  </div>
                  <div className="arrow-wrapper">
                    <div className="line" />
                    <div className="right-arrow" />
                  </div>
                  <div className="arrow-wrapper">
                    <div className="left-arrow" />
                    <div className="line"/>
                  </div>
                  <div>
                    <p>
                      거버넌스 참여
                    </p>
                  </div>
                </div>
                <div>
                  <div>
                    <p>
                      ELYFI Holder
                    </p>
                  </div>
                </div>
              </section>
            )
          }
          <div className="staking__title__content__wrapper">
            <div className="staking__title__content__token-wrapper">
              <img src={stakedToken === Token.EL ? el : elfi} />
              <h2>
                Staked {stakedToken.toUpperCase()}
              </h2>
            </div>
            <div className="staking__title__content">
              <p>
              {
                `${stakedToken} 스테이킹은 ${rewardToken} 채굴 플랜에 따라 4차례로 나눠서 진행됩니다.\n${stakedToken} 토큰을 스테이킹하면 ${rewardToken} 토큰을 리워드로 받게 되며, 스테이킹한 ${stakedToken} 토큰은 언제든지 언스테이킹이 가능합니다.\n\n* 이전 회차에 스테이킹한 ${stakedToken} 토큰과 보상 받은 ${rewardToken} 토큰은 다음 회차의 스테이킹 풀에 자동으로 전송되지 않습니다.`
              }
              </p>
              <RewardPlanButton stakingType={stakedToken} />
            </div>
          </div>
        </section>
        {loading ? (
          <Skeleton width={'100%'} height={600} />
        ) : (
          <>
            <section className="staking__round">
              <div className="staking__round__border" style={{
                height: roundDataLength
              }} />
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
                          <h2>
                            {t('staking.nth', { nth: currentPhase })}
                          </h2>
                          <p>
                            스테이킹 진행중
                          </p>
                        </div>
                        <h2>
                          {stakingRoundTimes[
                            currentPhase - 1
                          ].startedAt.format('YYYY.MM.DD HH:mm:ss')}
                          &nbsp;~&nbsp;
                          {stakingRoundTimes[currentPhase - 1].endedAt.format(
                            'YYYY.MM.DD HH:mm:ss',
                          )}&nbsp;(KST)
                        </h2>
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
                                  {t('staking.nth', { nth: index + 1 })}
                                </h2>
                                <p className="spoqa">
                                  {stakingRoundTimes[index].startedAt.format(
                                    'YYYY.MM.DD HH:mm:ss',
                                  )}
                                  <br />~&nbsp;
                                  {stakingRoundTimes[index].endedAt.format(
                                    'YYYY.MM.DD HH:mm:ss',
                                  )}&nbsp;(KST)
                                </p>
                              </div>
                              <div className="staking__round__previous__body">
                                <div>
                                  <p>
                                    {t('staking.staking_amount')}
                                  </p>
                                  <h2>
                                    {`${
                                      formatCommaSmall(
                                        item.accountPrincipal,
                                      ) || '-'
                                    }`}
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
                                className={`staking__round__button ${item.accountPrincipal.isZero() ? " disable" : ""}`}
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
                                className={`staking__round__button ${item.accountReward.isZero() ? " disable" : ""}`}
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
                </section>

                <section className="staking__round__remaining-data current">
                  <div className="staking__round__remaining-data__title">
                    <div>
                      <h2>
                        {t('staking.nth', { nth: 4 })}
                      </h2>
                      <p>
                        {stakingRoundTimes[3].startedAt.format(
                          'YYYY.MM.DD HH:mm:ss',
                        )}
                        <br />
                        ~&nbsp;
                        {stakingRoundTimes[3].endedAt.format(
                          'YYYY.MM.DD HH:mm:ss',
                        )}{' '}
                        (KST)
                      </p>
                    </div>
                    <div>
                      <p>APR</p>
                      <h2 className="percent">
                        {current.diff(stakingRoundTimes[3].startedAt) <= 0 ||
                        roundData[3]?.apr.eq(constants.MaxUint256) ||
                        current.diff(stakingRoundTimes[3].endedAt) >= 0
                          ? '-'
                          : toPercentWithoutSign(roundData[3].apr || 0)}
                      </h2>
                    </div>
                  </div>
                  <div className="staking__round__remaining-data__body">
                    <div>
                      <h2>{t('staking.staking_amount')}</h2>
                      <div>
                        <h2>
                          {`${
                            current.diff(stakingRoundTimes[3].startedAt) > 0
                              ? formatCommaSmall(
                                  roundData[3]?.accountPrincipal || '0',
                                )
                              : '-'
                          }`}
                          <span className="token-amount bold">{stakedToken}</span>
                        </h2>
                        <div
                          className={`staking__round__button ${
                            current.diff(stakingRoundTimes[3].startedAt) <=
                              0 || !account
                              ? ' disable'
                              : ''
                          }`}
                          onClick={(e) => {
                            if (
                              current.diff(stakingRoundTimes[3].startedAt) <
                                0 ||
                              current.diff(stakingRoundTimes[3].endedAt) >
                                0 ||
                              !account
                            ) {
                              return;
                            }
                            ReactGA.modalview(`${stakedToken}Staking`);
                            setRoundModal(3);
                            setModalValue(currentRound.accountPrincipal);
                            setStakingModalVisible(true);
                          }}>
                          <p>{t('staking.staking_btn')}</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h2>
                        {t('staking.reward_amount')}
                      </h2>
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
                          <span className="token-amount bold">{rewardToken}</span>
                        </h2>
                        <div
                          className={`staking__round__button ${expectedReward.value.isZero() ? " disable" : ""}`}
                          onClick={(e) => {
                            if (expectedReward.value.isZero()) {
                              return;
                            }
                            ReactGA.modalview(`${stakedToken}StakingReward`);

                            current.diff(stakingRoundTimes[3].startedAt) >
                              0 && setRoundModal(3);
                            setModalValue(expectedReward.value);
                            setClaimStakingRewardModalVisible(true);
                          }}>
                          <p>{t('staking.claim_reward')}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
                
              </div>
            </section>
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
  return <Staking stakedToken={Token.ELFI} rewardToken={Token.DAI} />;
};

export default Staking;
