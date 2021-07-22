import { Title } from 'src/components/Texts';
import Header from 'src/components/Header';
import ContainerArrow from 'src/assets/images/container-arrow@2x.png';

import { useContext, useEffect, useMemo, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import StakingPool from 'src/core/contracts/StakingPool';
import { constants } from 'ethers';
import Skeleton from 'react-loading-skeleton';
import { formatCommaSmall, toPercentWithoutSign } from 'src/utiles/formatters';
import stakingRoundTimes from 'src/core/data/stakingRoundTimes';
import PriceContext from 'src/contexts/PriceContext';
import calcAPR from 'src/core/utils/calcAPR';
import { ELFIPerDayOnELStakingPool, DAIPerDayOnELFIStakingPool } from 'src/core/data/stakings';
import moment from 'moment';
import ClaimStakingRewardModal from 'src/components/ClaimStakingRewardModal';
import StakingModal from 'src/containers/StakingModal';
import Token from 'src/enums/Token';
import AppColors from 'src/enums/AppColors';
import { tokenToString } from 'typescript';

interface IProps {
  stakedToken: Token.EL | Token.ELFI,
  rewardToken: Token.ELFI | Token.DAI,
}

const Staking: React.FunctionComponent<IProps> = ({
  stakedToken,
  rewardToken,
}) => {
  const current = moment();
  const domainColor = useMemo(() => {
    return rewardToken === Token.ELFI ? AppColors.elBlue : AppColors.daiYellow;
  }, [rewardToken])
  const { account, library } = useWeb3React();
  const { elPrice, elfiPrice } = useContext(PriceContext);

  const stakingPool = useMemo(() => {
    return new StakingPool(stakedToken, library)
  }, [library])

  const currentPhase = useMemo(() => {
    return stakingRoundTimes.filter((round) =>
      current.diff(round.startedAt) >= 0
    ).length
  }, [current]);

  const [state, setState] = useState({
    selectPhase: 1,
  })
  const [stakingModalVisible, setStakingModalVisible] = useState<boolean>(false);
  const [claimStakingRewardModalVisible, setClaimStakingRewardModalVisible] = useState<boolean>(false);

  const [roundData, setRoundData] = useState({
    loading: true,
    error: '',
    accountReward: constants.Zero,
    accountPrincipal: constants.Zero,
    totalPrincipal: constants.Zero,
    apr: constants.Zero,
  })

  const fetchRoundData = async (account: string, round: number) => {
    if (current.diff(stakingRoundTimes[round - 1].startedAt) < 0) {
      setRoundData({
        ...roundData,
        accountReward: constants.Zero,
        accountPrincipal: constants.Zero,
        totalPrincipal: constants.Zero,
        apr: constants.Zero,
      })
      return
    }

    setRoundData({ ...roundData, loading: true })

    try {
      const poolData = await stakingPool.getPoolData(round.toString());
      const userData = await stakingPool.getUserData(account, round.toString());

      setRoundData({
        ...roundData,
        loading: false,
        accountReward: await stakingPool.getUserReward(account, round.toString()),
        totalPrincipal: poolData.totalPrincipal,
        accountPrincipal: userData.userPrincipal,
        apr: calcAPR(
          poolData.totalPrincipal,
          stakedToken === Token.EL ? elPrice : elfiPrice,
          rewardToken === Token.ELFI ? ELFIPerDayOnELStakingPool : DAIPerDayOnELFIStakingPool,
          rewardToken === Token.ELFI ? elfiPrice : 1
        ),
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

  return (
    <>
      <Header title="STAKING" />
      <section className="staking">
        <ClaimStakingRewardModal
          visible={claimStakingRewardModalVisible}
          stakedToken={stakedToken}
          token={rewardToken}
          balance={roundData.accountReward}
          round={state.selectPhase}
          closeHandler={() => setClaimStakingRewardModalVisible(false)}
          afterTx={() => { account && fetchRoundData(account, state.selectPhase) }}
        />
        <StakingModal
          visible={stakingModalVisible}
          closeHandler={() => setStakingModalVisible(false)}
          stakedToken={stakedToken}
          stakedBalance={roundData.accountPrincipal}
          round={state.selectPhase}
          afterTx={() => { account && fetchRoundData(account, state.selectPhase) }}
        />
        <Title label={`${stakedToken} 토큰 스테이킹`} />
        <div>
          <p>
            {stakedToken} 토큰을 스테이킹하면 {rewardToken} 토큰이 채굴되며, ELYFI V1 기간 동안에는 6차례로 나눠서 진행됩니다.<br />
            스테이킹한 {stakedToken} 토큰은 자유롭게 언스테이킹이 가능합니다.<br />
            또한 각 차시는 별개로 진행되며, 이전 차시에 스테이킹한 {stakedToken} 토큰과 보상 받은 {rewardToken} 토큰은 다음 차시 스테이킹 풀에 자동으로 전송되지 않습니다.<br />
            자세한 채굴 플랜은 여기에서 확인이 가능합니다.
          </p>
        </div>
        <div className="staking__progress-bar__wrapper">
          <div className="staking__progress-bar">
            <div
              className="staking__progress-bar__value"
              style={{ width: ((1100 / 5) * (currentPhase - 1)) }}
            />
          </div>
          <div className="staking__progress-bar__button__wrapper">
            {
              stakingRoundTimes.map((time, index) => {
                const status = current.diff(time.startedAt) < 0 ? "wating" : current.diff(time.endedAt) > 0 ? "ended" : "now"
                return (
                  <div
                    key={`dot-${index}`}
                    className={`staking__progress-bar__button ${status}`}
                    onClick={() => setState({ selectPhase: index + 1 })}
                    style={{
                      backgroundColor: status === "wating" ? "white" : domainColor,
                      borderColor: domainColor,
                    }}
                  >
                    <div>
                      <p className="spoqa">
                        {
                          `${index + 1} ${status === 'ended' ? '완료' : status === "now" ? "진행중" : ""}`
                        }
                      </p>
                      <p style={{ display: status === 'now' ? "block" : "none" }}>
                        {`${time.startedAt.format('YYYY.MM.DD')} ~ ${time.endedAt.format('YYYY.MM.DD')} (UTC+9:00)`}
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
                <p className="spoqa__bold">{state.selectPhase}차 스테이킹 APR</p>
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
                  &nbsp;%
                </h2>
              </div>
            </div>
            <div className="staking__container">
              <div className="staking__container__header">
                <p className="spoqa__bold">{state.selectPhase}차 스테이킹 수량</p>
              </div>
              <div className="staking__value">
                <h2 className="spoqa__bold">
                  {
                    roundData.loading ?
                      <Skeleton width={100} height={40} /> :
                      <>
                        <span className="spoqa">
                          {`${current.diff(stakingRoundTimes[state.selectPhase - 1].startedAt) > 0 ? formatCommaSmall(roundData.accountPrincipal) : '-'}`}
                        </span> {` ${stakedToken}`}
                      </>
                  }
                </h2>
                <a className="staking__button" onClick={() => setStakingModalVisible(true)}>
                  <p>
                    스테이킹 | 언스테이킹
                  </p>
                </a>
              </div>
              <div className="staking__content">
                <p>
                  * 마이그레이션’은 이전에 스테이킹된 {stakedToken} 토큰을 현재 진행중인 스테이킹 풀에 전송하여 자동으로 스테이킹 하는 기능입니다.
                </p>
              </div>
            </div>
          </div>
          <div style={{ flex: 1 }} >
            <img src={ContainerArrow} style={{ width: 77, height: 191, position: 'relative', bottom: 25 }} />
          </div>
          <div className="staking__container">
            <div className="staking__container__header">
              <p className="spoqa__bold">{state.selectPhase}차 보상 수령</p>
            </div>
            <div className="staking__value__reward">
              {
                roundData.loading ?
                  <Skeleton width={100} height={40} />
                  :
                  <h2 className="spoqa__bold">
                    <span
                      className="colored spoqa__bold"
                      style={{ color: domainColor }}
                    >
                      {`${formatCommaSmall(roundData.accountReward)} `}
                    </span>
                    {rewardToken}
                  </h2>
              }
              <a className="staking__button" onClick={(e) => setClaimStakingRewardModalVisible(true)}>
                <p>
                  수령하기
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