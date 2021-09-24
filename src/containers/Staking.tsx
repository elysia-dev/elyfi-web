import { Title } from 'src/components/Texts';
import Header from 'src/components/Header';

import { useContext, useEffect, useMemo, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { constants } from 'ethers';
import Skeleton from 'react-loading-skeleton';
import { formatCommaSmall, formatSixFracionDigit, toPercentWithoutSign } from 'src/utiles/formatters';
import stakingRoundTimes from 'src/core/data/stakingRoundTimes';
import PriceContext from 'src/contexts/PriceContext';
import calcAPR from 'src/core/utils/calcAPR';
import { ELFIPerDayOnELStakingPool, DAIPerDayOnELFIStakingPool } from 'src/core/data/stakings';
import moment from 'moment';
import ClaimStakingRewardModal from 'src/components/ClaimStakingRewardModal';
import StakingModal from 'src/containers/StakingModal';
import Token from 'src/enums/Token';
import { useTranslation } from 'react-i18next';
import calcExpectedReward from 'src/core/utils/calcExpectedReward';
import RoundData from 'src/core/types/RoundData';
import CountUp from 'react-countup';
import { formatEther } from 'ethers/lib/utils';
import MigrationModal from 'src/components/MigrationModal';
import StakingEnded from 'src/components/StakingEnded';
import MigrationEnded from 'src/components/MigrationEnded';
import useStakingPool from 'src/hooks/useStakingPool';
import ReactGA from "react-ga";
import txStatus from 'src/enums/txStatus';
import TransactionConfirmModal from 'src/components/TransactionConfirmModal';

interface IProps {
  stakedToken: Token.EL | Token.ELFI,
  rewardToken: Token.ELFI | Token.DAI,
}

const Staking: React.FunctionComponent<IProps> = ({
  stakedToken,
  rewardToken,
}) => {
  const { t } = useTranslation();
  const current = moment();
  const { account } = useWeb3React();
  const { elPrice, elfiPrice } = useContext(PriceContext);

  const V2ChangeRound = 2;

  const stakingPool = useStakingPool(stakedToken, 0);

  const V2StakingPool = useStakingPool(Token.ELFI, V2ChangeRound + 1)

  const currentPhase = useMemo(() => {
    return stakingRoundTimes.filter((round) =>
      current.diff(round.startedAt) >= 0
    ).length
  }, [current]);

  const [state, setState] = useState({
    selectPhase: currentPhase,
    txWaiting: false,
    txStatus: txStatus.IDLE
  })

  const [stakingModalVisible, setStakingModalVisible] = useState<boolean>(false);
  const [claimStakingRewardModalVisible, setClaimStakingRewardModalVisible] = useState<boolean>(false);
  const [migrationModalVisible, setMigrationModalVisible] = useState<boolean>(false);
  const [stakingEndedVisible, setStakingEndedVisible] = useState<boolean>(false);
  const [migrationEndedVisible, setMigrationEndedVisible] = useState<boolean>(false);
  const [transactionModal, setTransactionModal] = useState(false);

  const [selectModalRound, setRoundModal] = useState(0);
  const [modalValue, setModalValue] = useState(constants.Zero);
  const [migrationRewardValue, setMigrationRewardValue] = useState(constants.Zero);

  const initialRound: RoundData = {
    loading: true,
    error: '',
    accountReward: constants.Zero,
    accountPrincipal: constants.Zero,
    totalPrincipal: constants.Zero,
    apr: constants.Zero,
    loadedAt: moment(),
    startedAt: stakingRoundTimes[0].startedAt,
    endedAt: stakingRoundTimes[0].endedAt,
  }

  const [roundDatas, setRoundDatas] = useState<RoundData[]>([
    {
      id: 1,
      ...initialRound
    }, {
      id: 2,
      ...initialRound
    }, {
      id: 3,
      ...initialRound
    }, {
      id: 4,
      ...initialRound
    },
  ])

  const [loading, setLoading] = useState(true);
  const [getError, setError] = useState(false)


  const [expectedReward, setExpectedReward] = useState({ before: constants.Zero, value: constants.Zero });

  const getRoundDataPromise = (round: number, poolData: any, userData: any, accountReward: any) => {
    return new Promise<RoundData>((resolve, reject) => {
      setTimeout(() => {
        resolve(
          {
            ...roundDatas[round],
            loading: false,
            accountReward: accountReward,
            totalPrincipal: poolData.totalPrincipal,
            accountPrincipal: userData.userPrincipal,
            apr: calcAPR(
              poolData.totalPrincipal,
              stakedToken === Token.EL ? elPrice : elfiPrice,
              rewardToken === Token.ELFI ? ELFIPerDayOnELStakingPool : DAIPerDayOnELFIStakingPool,
              rewardToken === Token.ELFI ? elfiPrice : 1
            ),
            loadedAt: moment(),
            startedAt: stakingRoundTimes[round].startedAt,
            endedAt: stakingRoundTimes[round].endedAt,
          }
        );
      }, 1000);
    });
  };

  const fetchRoundDatas = async (account: string, round: number) => {
    try {
      let poolData, userData, accountReward;

      if (round >= V2ChangeRound && stakedToken === Token.ELFI) {
        poolData = await V2StakingPool.getPoolData((round + 1 - V2ChangeRound).toString());
        userData = await V2StakingPool.getUserData((round + 1 - V2ChangeRound).toString(), account);
        accountReward = await V2StakingPool.getUserReward(account, (round + 1).toString());
      } else {
        poolData = await stakingPool.getPoolData((round + 1).toString());
        userData = await stakingPool.getUserData((round + 1).toString(), account);
        accountReward = await stakingPool.getUserReward(account, (round + 1).toString());
      }

      const datas = await getRoundDataPromise(round, poolData, userData, accountReward)

      let items = roundDatas;
      let item = { ...roundDatas[round] };
      item = { id: round + 1, ...datas };
      items[round] = item;

      setRoundDatas(items);

      round + 1 === stakingRoundTimes.length && (setLoading(false))

    } catch (e) {
      console.log(e)
      setLoading(true)
      setError(true)
    }
  }

  useEffect(() => {
    if (account) {
      Array(stakingRoundTimes.length).fill(0).map((_x, index) => {
        fetchRoundDatas(account, index);
      })
    }
  }, [account, stakingPool, V2StakingPool])

  useEffect(() => {
    if (getError || loading) return;

    const interval = setInterval(
      () => {
        setExpectedReward({
          before: expectedReward.value.isZero() ? roundDatas[currentPhase - 1].accountReward : expectedReward.value,
          value: calcExpectedReward(
            roundDatas[currentPhase - 1],
            rewardToken === Token.ELFI ?
              ELFIPerDayOnELStakingPool :
              DAIPerDayOnELFIStakingPool,
          )
        })
      }, 2000
    )

    return () => {
      clearInterval(interval);
    }
  });

  const getStatus = (status: txStatus) => {
    setState({ ...state, txStatus: status })
  }
  const getWaiting = (isWaiting: boolean) => {
    setState({ ...state, txWaiting: isWaiting })
  }

  return (
    <>
      <Header title={t("staking.token_staking", { stakedToken: stakedToken }).toUpperCase()} />

      <TransactionConfirmModal
        visible={transactionModal}
        closeHandler={() => {
          setTransactionModal(false)
        }}
      />
      <section className="staking" >
        <ClaimStakingRewardModal
          visible={claimStakingRewardModalVisible}
          stakedToken={stakedToken}
          token={rewardToken}
          balance={currentPhase === selectModalRound + 1 ? expectedReward.value : modalValue}
          round={selectModalRound + 1}
          closeHandler={() => setClaimStakingRewardModalVisible(false)}
          afterTx={() => { account && fetchRoundDatas(account, selectModalRound) }}
          transactionModal={() => setTransactionModal(true)}
        />
        <StakingModal
          visible={
            stakingModalVisible
          }
          closeHandler={() => setStakingModalVisible(false)}
          stakedToken={stakedToken}
          stakedBalance={loading ? constants.Zero : modalValue}
          round={selectModalRound + 1}
          afterTx={() => { account && fetchRoundDatas(account, selectModalRound) }}
          endedModal={() => {
            setStakingEndedVisible(true)
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
          rewardBalance={migrationRewardValue}
          round={selectModalRound + 1}
          afterTx={() => { account && fetchRoundDatas(account, selectModalRound) }}
          transactionModal={() => setTransactionModal(true)}
        />
        <StakingEnded
          visible={
            stakingEndedVisible
          }
          onClose={() => {
            setStakingEndedVisible(false)
            setState({ ...state, selectPhase: currentPhase })
          }}
          round={selectModalRound + 1}
        />
        <MigrationEnded
          visible={
            migrationEndedVisible
          }
          onClose={() => {
            setMigrationEndedVisible(false)
            setState({ ...state, selectPhase: currentPhase })
          }}
          round={selectModalRound + 1}
        />
        <Title label={t("staking.token_staking", { stakedToken: stakedToken })} />
        <div>
          <p>
            {t("staking.token_staking--content.0", { stakedToken: stakedToken, rewardToken: rewardToken })}<br />
            {t("staking.token_staking--content.1", { stakedToken: stakedToken, rewardToken: rewardToken })}<br />
            {t("staking.token_staking--content.2", { stakedToken: stakedToken, rewardToken: rewardToken })}<br /><br />
            {t("staking.token_staking--content.3")}
            <a
              href="https://defi.elysia.land/reward"
              target="_blank"
              className="link"
            >
              {t("staking.token_staking--content.4")}
            </a>
            {t("staking.token_staking--content.5")}
          </p>
        </div>

        {loading ? <Skeleton width={1190} height={600} /> : <>
          <div className="staking__round">
            <div className="staking__round__border pc-only" style={{ height: 610 }} />
            <div className="staking__round__container">
              <div>
                <div className="staking__round__current-data">
                  {
                    current.diff(stakingRoundTimes[currentPhase - 1].endedAt) >= 0 ? (
                      <p>
                        {t("staking.current_round_null")}
                      </p>
                    ) : (
                      <>
                        <div>
                          <div>
                            <p className="spoqa">
                              {t("staking.current_round")} :
                            </p>
                            <p className="spoqa__bold">
                              {t("staking.nth", { nth: currentPhase })}
                            </p>
                          </div>
                          <p className="spoqa__bold">
                            {stakingRoundTimes[currentPhase - 1].startedAt.format('YYYY.MM.DD HH:mm:ss')}
                            &nbsp;~&nbsp;<br className="mobile-only" />
                            {stakingRoundTimes[currentPhase - 1].endedAt.format('YYYY.MM.DD HH:mm:ss')} (KST)
                          </p>
                        </div>
                        <div>
                          <p className="spoqa">
                            APR
                          </p>
                          <p className="spoqa__bold">
                            {
                              loading ?
                                <Skeleton width={100} height={40} /> :
                                <span className="spoqa__bold">
                                  {
                                    current.diff(stakingRoundTimes[currentPhase - 1].startedAt) <= 0
                                      || roundDatas[currentPhase - 1].apr.eq(constants.MaxUint256)
                                      || current.diff(stakingRoundTimes[currentPhase - 1].endedAt) >= 0 ? '-' : toPercentWithoutSign(roundDatas[currentPhase - 1].apr)
                                  }
                                </span>
                            }
                            <span className="spoqa__bold staking__sign">&nbsp;%</span>
                          </p>
                        </div>
                      </>
                    )
                  }
                </div>

                <div className="staking__round__previous__wrapper">
                  {
                    roundDatas.map((data, index) => {
                      if (current.diff(data.endedAt) > 0) {
                        return (
                          <div className="staking__round__previous">
                            <div>
                              <div className="staking__round__previous__title">
                                <p className="spoqa__bold">
                                  {t("staking.nth", { nth: index + 1 })}
                                </p>
                                <p className="spoqa">
                                  {stakingRoundTimes[index].startedAt.format('YYYY.MM.DD HH:mm:ss')}
                                  <br />~ {stakingRoundTimes[index].endedAt.format('YYYY.MM.DD HH:mm:ss')} (KST)
                                </p>
                              </div>
                              <div className="staking__round__previous__body">
                                <div>
                                  <p className="spoqa__bold">
                                    {t("staking.staking_amount")}
                                  </p>
                                  {
                                    loading ?
                                      <Skeleton width={100} height={40} /> :
                                      <p className="spoqa__bold">
                                        {`${formatCommaSmall(roundDatas[index].accountPrincipal) || '-'}`}
                                        <span className="spoqa__bold">&nbsp;{stakedToken}</span>
                                      </p>
                                  }
                                </div>
                                <div>
                                  <p className="spoqa__bold">
                                    {t("staking.reward_amount")}
                                  </p>
                                  {
                                    loading ? <Skeleton width={100} height={40} /> :
                                      <p className="spoqa__bold">
                                        {expectedReward.before.isZero() ? "-" :
                                          !(current.diff(stakingRoundTimes[currentPhase - 1].startedAt) < 0 && current.diff(stakingRoundTimes[currentPhase - 1].endedAt) > 0) ? "-" :
                                            <span className="spoqa__bold">
                                              {roundDatas[index].accountReward}
                                            </span>
                                        }
                                        <span className="spoqa__bold">
                                          &nbsp;{rewardToken}
                                        </span>
                                      </p>
                                  }
                                </div>
                              </div>
                            </div>

                            <div className="staking__round__previous__button">
                              {
                                loading ? <Skeleton width={100} height={40} /> :
                                  <div
                                    className={roundDatas[index].accountPrincipal.isZero() ? "button--disable" : ``}
                                    onClick={(e) => {
                                      if (roundDatas[index].accountPrincipal.isZero()) {
                                        return;
                                      }
                                      if (stakedToken !== Token.ELFI && !roundDatas[index].accountPrincipal.isZero() && current.diff(stakingRoundTimes[currentPhase - 1].startedAt) > 0) {
                                        ReactGA.modalview(`${stakedToken}Migration`)
                                        setRoundModal(currentPhase - 1);
                                        setModalValue(roundDatas[index].accountPrincipal)
                                        setMigrationRewardValue(expectedReward.value)
                                        return setMigrationModalVisible(true)
                                      }
                                      if (current.diff(stakingRoundTimes[index].startedAt) > 0) {
                                        ReactGA.modalview(`${stakedToken}Staking`)
                                        setRoundModal(index);
                                        setModalValue(roundDatas[index].accountPrincipal)
                                        setStakingModalVisible(true)
                                      }
                                    }}
                                  >
                                    <p>
                                      {
                                        stakedToken !== Token.ELFI && !roundDatas[index].accountPrincipal.isZero() && current.diff(stakingRoundTimes[currentPhase - 1].startedAt) > 0 ?
                                          t("staking.unstaking_migration")
                                          :
                                          t("staking.staking_btn")
                                      }
                                    </p>
                                  </div>
                              }
                              <div
                                className={roundDatas[index].accountReward.isZero() ? "button--disable" : ""}
                                onClick={(e) => {
                                  if (roundDatas[index].accountReward.isZero()) {
                                    return;
                                  }
                                  ReactGA.modalview(`${stakedToken}StakingReward`)

                                  current.diff(stakingRoundTimes[index].startedAt) > 0
                                    &&
                                    setRoundModal(index);
                                  setModalValue(roundDatas[index].accountReward)
                                  setClaimStakingRewardModalVisible(true)
                                }}
                              >
                                <p>
                                  {t("staking.claim_reward")}
                                </p>
                              </div>
                            </div>
                          </div>
                        )
                      }
                    })
                  }
                </div>

                <div className="staking__round__remaining-data current">
                  <div className="staking__round__remaining-data__title">
                    <div>
                      <p className="spoqa__bold">
                        {t("staking.nth", { nth: 3 })}
                      </p>
                      <p>
                        {stakingRoundTimes[2].startedAt.format('YYYY.MM.DD HH:mm:ss')}
                        <br />~&nbsp;
                        {stakingRoundTimes[2].endedAt.format('YYYY.MM.DD HH:mm:ss')} (KST)
                      </p>
                    </div>
                    <div>
                      <p className="spoqa">
                        APR
                      </p>
                      <p className="spoqa__bold">
                        {
                          current.diff(stakingRoundTimes[currentPhase - 1].startedAt) <= 0
                            || roundDatas[currentPhase - 1].apr.eq(constants.MaxUint256)
                            || current.diff(stakingRoundTimes[currentPhase - 1].endedAt) >= 0 ? '-' : toPercentWithoutSign(roundDatas[currentPhase - 1].apr)
                        }<span className="spoqa__bold staking__sign">&nbsp;%</span>
                      </p>
                    </div>
                  </div>
                  <div className="staking__round__remaining-data__body">
                    <div>
                      <p className="spoqa__bold">
                        {t("staking.staking_amount")}
                      </p>
                      <div>
                        <h2>
                          {`${current.diff(stakingRoundTimes[currentPhase - 1].startedAt) > 0 ? formatCommaSmall(roundDatas[currentPhase - 1].accountPrincipal) : '-'}`}
                          <span className="spoqa__bold">
                            {stakedToken}
                          </span>
                        </h2>
                        <div
                          className={`staking__button ${current.diff(stakingRoundTimes[currentPhase - 1].endedAt) > 0 ? "disable" : ""}`}
                          onClick={(e) => {
                            if (current.diff(stakingRoundTimes[currentPhase - 1].startedAt) < 0 || current.diff(stakingRoundTimes[currentPhase - 1].endedAt) > 0) {
                              return;
                            }
                            if (stakedToken !== Token.ELFI && current.diff(stakingRoundTimes[currentPhase > 3 ? 3 : currentPhase].startedAt) > 0) {
                              ReactGA.modalview(`${stakedToken}Migration`)
                              setRoundModal(currentPhase - 1);
                              setModalValue(roundDatas[currentPhase - 1].accountPrincipal)
                              setMigrationRewardValue(expectedReward.value)
                              return setMigrationModalVisible(true)
                            } else {
                              ReactGA.modalview(`${stakedToken}Staking`)
                              setRoundModal(currentPhase - 1);
                              setModalValue(roundDatas[currentPhase - 1].accountPrincipal)
                              setStakingModalVisible(true)
                            }
                          }}
                        >
                          <p>
                            {
                              stakedToken !== Token.ELFI && current.diff(stakingRoundTimes[currentPhase > 3 ? 3 : currentPhase].startedAt) > 0 ?
                                t("staking.unstaking_migration")
                                :
                                t("staking.staking_btn")
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="spoqa__bold">
                        {t("staking.reward_amount")}
                      </p>
                      <div>
                        <h2>
                          {expectedReward.before.isZero() ? "-" :
                            <CountUp
                              className={`spoqa__bold colored ${rewardToken === Token.ELFI ? "EL" : "ELFI"}`}
                              start={
                                parseFloat(formatEther(
                                  expectedReward.before
                                ))
                              }
                              end={
                                parseFloat(formatEther(
                                  expectedReward.before.isZero() ?
                                    roundDatas[currentPhase - 1].accountReward :
                                    expectedReward.value
                                ))
                              }
                              formattingFn={(number) => {
                                return formatSixFracionDigit(number)
                              }}
                              decimals={6}
                              duration={1}
                            />
                          }
                          <span className="spoqa__bold">
                            {rewardToken}
                          </span>
                        </h2>
                        <div
                          className={expectedReward.value.isZero() ? "button--disable" : ""}
                          onClick={(e) => {
                            if (expectedReward.value.isZero()) {
                              return;
                            }
                            ReactGA.modalview(`${stakedToken}StakingReward`)

                            current.diff(stakingRoundTimes[currentPhase - 1].startedAt) > 0
                              &&
                              setRoundModal(currentPhase - 1);
                            setModalValue(expectedReward.value)
                            setClaimStakingRewardModalVisible(true)
                          }}
                        >
                          <p>
                            {t("staking.claim_reward")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>


                <div className="staking__round__remaining-data waiting">
                  <div className="staking__round__remaining-data__title">
                    <div>
                      <p className="spoqa__bold">
                        {t("staking.nth", { nth: 4 })}
                      </p>
                      <p>
                        {stakingRoundTimes[3].startedAt.format('YYYY.MM.DD HH:mm:ss')}
                        <br />~&nbsp;
                        {stakingRoundTimes[3].endedAt.format('YYYY.MM.DD HH:mm:ss')} (KST)
                      </p>
                    </div>
                    <div>
                      <p />
                      <p className="spoqa__bold">
                        -<span className="spoqa__bold staking__sign">&nbsp;%</span>
                      </p>
                    </div>
                  </div>
                  <div className="staking__round__remaining-data__body">
                    <div>
                      <p className="spoqa__bold">
                        {t("staking.staking_amount")}
                      </p>
                      <div>
                        <h2>
                          -
                          <span>
                            {stakedToken}
                          </span>
                        </h2>
                        <div className="disable">
                          <p>
                            {t("staking.staking_btn")}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="spoqa__bold">
                        {t("staking.reward_amount")}
                      </p>
                      <div>
                        <h2>
                          -
                          <span>
                            {rewardToken}
                          </span>
                        </h2>
                        <div className="disable">
                          <p>
                            {t("staking.claim_reward")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
        }
      </section>
    </>
  )
}

export const StakingEL = () => {
  return (
    <Staking
      stakedToken={Token.EL}
      rewardToken={Token.ELFI}
    />
  )
}

export const StakingELFI = () => {
  return (
    <Staking
      stakedToken={Token.ELFI}
      rewardToken={Token.DAI}
    />
  )
}


export default Staking;