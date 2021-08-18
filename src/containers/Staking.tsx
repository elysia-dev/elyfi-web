import { Title } from 'src/components/Texts';
import Header from 'src/components/Header';
import ContainerArrow from 'src/assets/images/container-arrow@2x.png';

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
import AppColors from 'src/enums/AppColors';
import { useTranslation } from 'react-i18next';
import calcExpectedReward from 'src/core/utils/calcExpectedReward';
import RoundData from 'src/core/types/RoundData';
import CountUp from 'react-countup';
import { formatEther } from 'ethers/lib/utils';
import MigrationNavigationModal from './MigrationNavigationModal';
import MigrationModal from 'src/components/MigrationModal';
import MigrationWithElfiModal from 'src/components/MigrationWithElfiModal';
import StakingEnded from 'src/components/StakingEnded';
import MigrationEnded from 'src/components/MigrationEnded';
import useStakingPool from 'src/hooks/useStakingPool';
import toOrdinalNumber from 'src/utiles/toOrdinalNumber';

interface IProps {
  stakedToken: Token.EL | Token.ELFI,
  rewardToken: Token.ELFI | Token.DAI,
}

const Staking: React.FunctionComponent<IProps> = ({
  stakedToken,
  rewardToken,
}) => {
  const { t, i18n } = useTranslation();
  const current = moment();
  const domainColor = useMemo(() => {
    return rewardToken === Token.ELFI ? AppColors.elBlue : AppColors.daiYellow;
  }, [rewardToken])
  const { account, library } = useWeb3React();
  const { elPrice, elfiPrice } = useContext(PriceContext);

  const stakingPool = useStakingPool(stakedToken);
  const currentPhase = useMemo(() => {
    return stakingRoundTimes.filter((round) =>
      current.diff(round.startedAt) >= 0
    ).length
  }, [current]);

  const [state, setState] = useState({
    selectPhase: currentPhase,
  })
  const [stakingModalVisible, setStakingModalVisible] = useState<boolean>(false);
  const [claimStakingRewardModalVisible, setClaimStakingRewardModalVisible] = useState<boolean>(false);
  const [migrationNavigationModalVisible, setMigrationNavigationModalVisible] = useState<boolean>(false);
  const [migrationModalVisible, setMigrationModalVisible] = useState<boolean>(false);
  const [migrationWithElfiModalVisible, setMigrationWithElfiModalVisible] = useState<boolean>(false);
  const [stakingEndedVisible, setStakingEndedVisible] = useState<boolean>(false);
  const [migrationEndedVisible, setMigrationEndedVisible] = useState<boolean>(false);

  const [roundData, setRoundData] = useState<RoundData>({
    loading: true,
    error: '',
    accountReward: constants.Zero,
    accountPrincipal: constants.Zero,
    totalPrincipal: constants.Zero,
    apr: constants.Zero,
    loadedAt: moment(),
    startedAt: stakingRoundTimes[0].startedAt,
    endedAt: stakingRoundTimes[0].endedAt,
  })

  const [expectedReward, setExpectedReward] = useState({ before: constants.Zero, value: constants.Zero });

  const fetchRoundData = async (account: string, round: number) => {
    if (current.diff(stakingRoundTimes[round - 1].startedAt) < 0) {
      setRoundData({
        ...roundData,
        accountReward: constants.Zero,
        accountPrincipal: constants.Zero,
        totalPrincipal: constants.Zero,
        apr: constants.Zero,
      });
      setExpectedReward({ before: constants.Zero, value: constants.Zero });
      return
    }

    setRoundData({ ...roundData, loading: true });

    try {
      const poolData = await stakingPool.getPoolData(round.toString());
      const userData = await stakingPool.getUserData(round.toString(), account);
      const accountReward = await stakingPool.getUserReward(account, round.toString());

      setRoundData({
        ...roundData,
        loading: false,
        accountReward,
        totalPrincipal: poolData.totalPrincipal,
        accountPrincipal: userData.userPrincipal,
        apr: calcAPR(
          poolData.totalPrincipal,
          stakedToken === Token.EL ? elPrice : elfiPrice,
          rewardToken === Token.ELFI ? ELFIPerDayOnELStakingPool : DAIPerDayOnELFIStakingPool,
          rewardToken === Token.ELFI ? elfiPrice : 1
        ),
        loadedAt: moment(),
        startedAt: stakingRoundTimes[round - 1].startedAt,
        endedAt: stakingRoundTimes[round - 1].endedAt,
      })
    } catch (e) {
      console.log(e)
      setRoundData({
        ...roundData,
        error: e,
        loading: false,
      })
    }
  }

  useEffect(() => {
    if (account) {
      fetchRoundData(account, state.selectPhase);
    }
  }, [account, state.selectPhase])

  useEffect(() => {
    if (roundData.error || roundData.loading) return;

    const interval = setInterval(
      () => {
        setExpectedReward({
          before: expectedReward.value.isZero() ? roundData.accountReward : expectedReward.value,
          value: calcExpectedReward(
            roundData,
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

  return (
    <>
      <Header title={t("staking.token_staking", { stakedToken: stakedToken }).toUpperCase()} />
      <section className="staking">
        <ClaimStakingRewardModal
          visible={claimStakingRewardModalVisible}
          stakedToken={stakedToken}
          token={rewardToken}
          balance={expectedReward.value}
          round={state.selectPhase}
          closeHandler={() => setClaimStakingRewardModalVisible(false)}
          afterTx={() => { account && fetchRoundData(account, state.selectPhase) }}
        />
        <StakingModal
          visible={
            stakingModalVisible
          }
          closeHandler={() => setStakingModalVisible(false)}
          stakedToken={stakedToken}
          stakedBalance={roundData.accountPrincipal}
          round={state.selectPhase}
          afterTx={() => { account && fetchRoundData(account, state.selectPhase) }}
          endedModal={() => {
            setStakingEndedVisible(true)
          }}
        />
        <MigrationNavigationModal
          visible={migrationNavigationModalVisible}
          SelectELFIModal={() => {
            setMigrationWithElfiModalVisible(true)
            setMigrationNavigationModalVisible(false)
          }}
          SelectELModal={() => {
            setMigrationModalVisible(true)
            setMigrationNavigationModalVisible(false)
          }}
          closeHandler={() => setMigrationNavigationModalVisible(false)}
        />
        <MigrationModal
          visible={migrationModalVisible}
          closeHandler={() => setMigrationModalVisible(false)}
          stakedToken={stakedToken}
          stakedBalance={roundData.accountPrincipal}
          round={state.selectPhase}
          afterTx={() => { account && fetchRoundData(account, state.selectPhase) }}
        />
        <MigrationWithElfiModal
          visible={migrationWithElfiModalVisible}
          closeHandler={() => setMigrationWithElfiModalVisible(false)}
          stakedToken={stakedToken}
          stakedBalance={roundData.accountPrincipal}
          round={state.selectPhase}
          afterTx={() => { account && fetchRoundData(account, state.selectPhase) }}
        />
        <StakingEnded
          visible={
            stakingEndedVisible
          }
          onClose={() => {
            setStakingEndedVisible(false)
            setState({ ...state, selectPhase: currentPhase })
          }}
          round={state.selectPhase}
        />
        <MigrationEnded
          visible={
            migrationEndedVisible
          }
          onClose={() => {
            setMigrationEndedVisible(false)
            setState({ ...state, selectPhase: currentPhase })
          }}
          round={state.selectPhase}
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
        <div className="staking__progress-bar__wrapper">
          <div className="staking__progress-bar">
            <div
              className="staking__progress-bar__value"
              style={{
                width: ((1100 / 5) * (currentPhase - 1)),
                backgroundColor: domainColor
              }}
            />
          </div>
          <div className="staking__progress-bar__button__wrapper">
            {
              stakingRoundTimes.map((time, index) => {
                const status = current.diff(time.startedAt) < 0 ? "waiting" : current.diff(time.endedAt) > 0 ? "ended" : "now";
                const onClicked = state.selectPhase - 1 === index ? " selected" : ""
                return (
                  <div
                    key={`dot-${index}`}
                    className={`staking__progress-bar__button ${status} ${onClicked} ${rewardToken === Token.ELFI ? "EL" : "ELFI"}`}
                    onClick={() => setState({ selectPhase: index + 1 })}
                  // style={{
                  //   backgroundColor: status === "waiting" ? "white" : domainColor,
                  //   borderColor: domainColor,
                  // }}
                  >
                    <div>
                      <p className="spoqa">
                        {
                          status === 'ended'
                            ?
                            t("staking.nth_ended", { nth: toOrdinalNumber(i18n.language, index + 1) })
                            :
                            status === "now"
                              ?
                              t("staking.nth_progress", { nth: toOrdinalNumber(i18n.language, index + 1) })
                              :
                              t("staking.nth", { nth: toOrdinalNumber(i18n.language, index + 1) })

                        }
                      </p>
                      <p style={{ display: status === 'now' ? "block" : onClicked === ' selected' ? "block" : "none" }}>
                        {`${time.startedAt.format('YYYY.MM.DD HH:mm:ss')}\n~ ${time.endedAt.format('YYYY.MM.DD HH:mm:ss')} (KST)`}
                      </p>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
        <div className="staking__infomation">
          <div className="staking__container__wrapper">
            <div className="staking__container">
              <div className="staking__container__header">
                <p className="spoqa__bold">
                  {t("staking.nth_staking", { nth: toOrdinalNumber(i18n.language, state.selectPhase) })}
                </p>
              </div>
              <div>
                <h2 className="spoqa__bold">
                  {
                    roundData.loading ?
                      <Skeleton width={100} height={40} /> :
                      <span>
                        {
                          current.diff(stakingRoundTimes[state.selectPhase - 1].startedAt) <= 0
                            || roundData.apr.eq(constants.MaxUint256) ? '-' : toPercentWithoutSign(roundData.apr)
                        }
                      </span>
                  }
                  <span className="spoqa staking__sign">&nbsp;%</span>
                </h2>
              </div>
            </div>
            <div className="staking__container">
              <div className="staking__container__header">
                <p className="spoqa__bold">
                  {t("staking.nth_staking_amount", { nth: toOrdinalNumber(i18n.language, state.selectPhase) })}
                </p>
              </div>
              <div className="staking__value">
                <h2 className="spoqa__bold">
                  {
                    roundData.loading ?
                      <Skeleton width={100} height={40} /> :
                      <>
                        <span className="spoqa">
                          {`${current.diff(stakingRoundTimes[state.selectPhase - 1].startedAt) > 0 ? formatCommaSmall(roundData.accountPrincipal) : '-'}`}
                        </span>
                        <span className="spoqa staking__sign">{` ${stakedToken}`}</span>
                      </>
                  }
                </h2>
              </div>
              <div className="staking__content">
                <a
                  className={`staking__button ${current.diff(stakingRoundTimes[state.selectPhase - 1].startedAt) < 0 ? "disable" : ""}`}
                  onClick={(e) => {
                    // current.diff(stakingRoundTimes[state.selectPhase - 1].endedAt) > 0
                    //   ?
                    //   setMigrationNavigationModalVisible(true)
                    //   :
                    current.diff(stakingRoundTimes[state.selectPhase - 1].startedAt) > 0 &&
                      setStakingModalVisible(true)
                  }}
                >
                  <p>
                    {
                      // current.diff(stakingRoundTimes[state.selectPhase - 1].endedAt) > 0 ?
                      //   t("staking.unstaking_migration")
                      //   : 
                      t("staking.staking_btn")
                    }
                  </p>
                </a>
              </div>
            </div>
          </div>
          <div style={{ flex: 1 }} >
            <img src={ContainerArrow} style={{ width: 77, height: 191, position: 'relative', bottom: 25 }} />
          </div>
          <div className="staking__container">
            <div className="staking__container__header">
              <p className="spoqa__bold">
                {t("staking.nth_reward_amount", { nth: toOrdinalNumber(i18n.language, state.selectPhase) })}
              </p>
            </div>
            <div className="staking__value__reward">
              {
                roundData.loading ?
                  <Skeleton width={100} height={40} />
                  :
                  <h2 className="spoqa__bold">
                    <span
                      className="colored spoqa__bold"
                    >
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
                                roundData.accountReward :
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
                    </span>
                    <span className="spoqa staking__sign">{` ${rewardToken}`}</span>
                  </h2>
              }
              <a
                className={`staking__button ${current.diff(stakingRoundTimes[state.selectPhase - 1].startedAt) < 0 ? "disable" : ""}`}
                onClick={(e) => {
                  current.diff(stakingRoundTimes[state.selectPhase - 1].startedAt) > 0
                    &&
                    setClaimStakingRewardModalVisible(true)
                }}
              >
                <p>
                  {t("staking.claim_reward")}
                </p>
              </a>
            </div>
          </div>
        </div>
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