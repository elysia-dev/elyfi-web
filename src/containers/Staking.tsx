import { Title } from 'src/components/Texts';
import Header from 'src/components/Header';
import { useState } from 'react';
import ContainerArrow from 'src/assets/images/container-arrow@2x.png';
import ELFI from 'src/assets/images/ELFI.png';

const Staking = () => {
  const TotalPhase = 6;

  const currentPhase = 2;
  const [state, setState] = useState({
    selectPhase: 1,
  })
  const [modal, setModal] = useState<boolean>(false);

  const [elStakingModal, setElStakingModal] = useState<boolean>(false);
  const [elStakingSelected, elStakingSelect] = useState<boolean>(true)

  const [amount, setAmount] = useState<string>('');
  const CallModal = () => { 
    return (
      <div className="modal" style={{ display: modal ? "block" : "none" }}>
        <div className="modal__container">
          <div className="modal__staking">
            <div className="close-button" onClick={() => setModal(false)}>
              <div className="close-button--1">
                <div className="close-button--2" />
              </div>
            </div>
            <div className="modal__staking__button">
              <div>
                <p className="spoqa">
                  가스비 절감을 위해
                </p>
                <h2 className="spoqa__bold">
                  ELFI 토큰도 같이 출금하기
                </h2>
              </div>
              <div>
                <p className="modal__staking__button__arrow bold">
                  {'>'}
                </p>
              </div>
            </div>
            <div className="modal__staking__button">
              <div>
                <p className="spoqa">
                  ELFI 토큰은 나중에 수취하고
                </p>
                <h2 className="spoqa__bold">
                  EL 토큰만 전송하기
                </h2>
              </div>
              <div>
                <p className="modal__staking__button__arrow bold">
                  {'>'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  const ElStaking = () => {
    return (
      <div className="modal" style={{ display: elStakingModal ? "block" : "none" }}>
        <div className="modal__container">
          <div className="modal__header">
            <div className="modal__header__token-info-wrapper">
              <img className="modal__header__image" src={ELFI} alt="Token" />
              <div className="modal__header__name-wrapper">
                <p className="modal__header__name spoqa__bold">EL</p>
              </div>
            </div>
            <div className="close-button" onClick={() => { }}>
              <div className="close-button--1">
                <div className="close-button--2" />
              </div>
            </div>
          </div>
          <div className='modal__converter'>
            <div
              className={`modal__converter__column${elStakingSelected ? "--selected" : ""}`}
              onClick={() => { elStakingSelect(true) }}
            >
              <p className="bold">STAKING</p>
            </div>
            <div
              className={`modal__converter__column${!elStakingSelected ? "--selected" : ""}`}
              onClick={() => { elStakingSelect(false) }}
            >
              <p className="bold">UNSTAKING</p>
            </div>
          </div>
          <div className="modal__body">
            <div>
              <div className="modal__value-wrapper">
                <p className="modal__maximum bold" onClick={() => { }}>
                  MAX
                </p>
                <p className="modal__value bold">
                  <input
                    type="number"
                    className="modal__text-input"
                    placeholder="0"
                    value={amount}
                    style={{ fontSize: amount.length < 8 ? 60 : amount.length > 12 ? 35 : 45 }}
                    onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => { 
                      ["-", "+", "e"].includes(e.key) && e.preventDefault();
                    }}
                    onChange={({ target }) => {
                      target.value = target.value.replace(/(\.\d{18})\d+/g, '$1');
                      
                      setAmount(target.value);
                    }}
                  />
                </p>
              </div>
              <div className="modal__staking__container">
                <p className="spoqa__bold">
                  스테이킹 가능한 양
                </p>
                <div>
                  <p className="spoqa__bold">
                    Wallet balance
                  </p>
                  <p className="spoqa__bold">
                    1000000 EL
                  </p>
                </div>
              </div>
              <div className={`modal__button${amount === "" ? "--disable" : ""}`} onClick={() => { }}>
                <p>
                  STAKING
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  const NthStakingInformation = () => {
    return ( 
      <div className="staking__infomation">
        <div className="staking__container__wrapper">
          <div className="staking__container">
            <div className="staking__container__header">
              <p className="spoqa__bold">{state.selectPhase}차 스테이킹 APR</p>
            </div>
            <div>
              <h2 className="spoqa__bold"><span>4.07</span> %</h2>
            </div>
          </div>
          <div className="staking__container">
            <div className="staking__container__header">
              <p className="spoqa__bold">{state.selectPhase}차 스테이킹 수량</p>
            </div>
            <div className="staking__value">
              <h2 className="spoqa__bold"><span>13,000,000</span> EL</h2>
              <a className="staking__button" onClick={() => setModal(true)}>
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
        <div style={{ flex: 1 }} >
          <img src={ContainerArrow} style={{ width: 77, height: 191, position: 'relative', bottom: 25 }} />
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
    )
  }
  return (
    <>
      <Header title="STAKING" />
      <section className="staking">
        {CallModal()}
        {ElStaking()}
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
            <div className="staking__progress-bar__value" style={{ width: ((1100 / 5) * (currentPhase - 1)) }}/>
          </div>
          <div className="staking__progress-bar__button__wrapper">
          {
            Array(TotalPhase).fill(0).map((_x, index) => {
              return (
                <div className={`staking__progress-bar__button${
                  index + 1 === state.selectPhase ? " now" 
                    :
                    index + 1 < currentPhase ? " ended"
                      :
                      index + 1 > currentPhase ? " waiting" 
                        : 
                        
                        " ended"
                  }`}
                  onClick={() => setState({ ...state, selectPhase: index + 1 })}
                >
                  <div>
                    <p className="spoqa">
                    {
                      index + 1 < currentPhase ? 
                        `${index + 1}차 완료`
                        :
                        index + 1 > currentPhase ? 
                          `${index + 1}차`
                          : 
                          `${index + 1}차 진행중`
                    }
                    </p>
                    <p style={{ display: index + 1 === state.selectPhase ? "block" : "none" }}>
                      2021.05.21 ~ 2021.07.21 (UTC+9:00)
                    </p>
                  </div>
                </div>
              )
            })
          }
          </div>
        </div>
        {NthStakingInformation()}
      </section>
    </>
  )
}

export default Staking;