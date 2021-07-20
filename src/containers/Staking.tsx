import { Title } from 'src/components/Texts';
import Header from 'src/components/Header';
import { useState } from 'react';

const Staking = () => {
  const TotalPhase = 6;
  const currentPhase = 1;
  const [state, setState] = useState({
    selectPhase: 1
  })
  return (
    <>
      <Header title="STAKING" />
      <section className="staking">
        <Title label="EL 토큰 스테이킹" />
        <div>
          <p>
            EL 토큰을 스테이킹하면 ELFI 토큰이 채굴되며, ELYFI V1 기간 동안에는 6차례로 나눠서 진행됩니다.<br />
            스테이킹한 EL 토큰은 자유롭게 언스테이킹이 가능합니다.<br/>
            또한 각 차시는 별개로 진행되며, 이전 차시에 스테이킹한 EL 토큰과 보상 받은 ELFI 토큰은 다음 차시 스테이킹 풀에 자동으로 전송되지 않습니다.<br />
            자세한 채굴 플랜은 여기에서 확인이 가능합니다.
          </p>
        </div>
        <div className="staking__progress-bar__wrapper">
          <div className="staking__progress-bar">
            <div className="staking__progress-bar__value" />
          </div>
          <div className="staking__progress-bar__button__wrapper">
          {
            Array(TotalPhase).fill(0).map((_x, index) => {
              return (
                <div className={`staking__progress-bar__button${index > currentPhase ? " disable" : ""}`}>
                  <div>
                    <p className="spoqa">
                      {index + 1}차
                    </p>
                    <p>
                      2021.05.21 ~ 2021.07.21 (UTC+9:00)
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
                <h2 className="spoqa__bold">- %</h2>
              </div>
            </div>
            <div className="staking__container">
              <div className="staking__container__header">
                <p className="spoqa__bold">{state.selectPhase}차 스테이킹 수량</p>
              </div>
              <div className="staking__value">
                <h2 className="spoqa__bold">- %</h2>
                <a className="staking__button" onClick={(e) => {
                  e.stopPropagation();
                  var openNewWindow = window.open("about:blank");
                  openNewWindow!.location.href = `https://elyfi.elysia.land/`;
                }}>
                  <p>
                    마이그레이션 | 언스테이킹
                  </p>
                </a>
              </div>
              <div className="staking__content">
                <p>
                  * 마이그레이션’은 이전에 스테이킹된 EL 토큰을 현재 진행중인 스테이킹 풀에 전송하여 자동으로 스테이킹 하는 기능입니다.
                </p>
              </div>
            </div>
          </div>
          <div>
            화살표가 있어야하는데
          </div>
          <div className="staking__container">
            <div className="staking__container__header">
              <p className="spoqa__bold">{state.selectPhase + 1}차 보상 수령</p>
            </div>
            <div className="staking__value__reward">
              <h2 className="spoqa__bold"><span className="colored spoqa__bold">500,000</span> ELFI</h2>
              <a className="staking__button" onClick={(e) => {
                e.stopPropagation();
                var openNewWindow = window.open("about:blank");
                openNewWindow!.location.href = `https://elyfi.elysia.land/`;
              }}>
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

export default Staking;