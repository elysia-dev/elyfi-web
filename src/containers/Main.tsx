import { useState } from 'react';

import Advantages00 from 'src/assets/images/advantages00.png';
import Advantages01 from 'src/assets/images/advantages01.png';
import Advantages02 from 'src/assets/images/advantages02.png';
import Advantages03 from 'src/assets/images/advantages03.png';
import Advantages04 from 'src/assets/images/advantages04.png';
import Advantages05 from 'src/assets/images/advantages05.png';
import HaechiLabs from 'src/assets/images/haechi-labs.png';
import SHIN from 'src/assets/images/shin.png';
import BKI from 'src/assets/images/bkl.png';
import FocusLaw from 'src/assets/images/focus_law_asia.png';
import HUB from 'src/assets/images/hub.png';
import HOW from 'src/assets/images/how.png';
import TSMP from 'src/assets/images/tsmp.png';
import MainGovernanceTable from 'src/components/MainGovernanceTable';


const Main = () => {
  const [advantagesHover, setAdvantagesHover] = useState(0);

  const animationLine = (length: number, deg: "up" | "down" | "left" | "right") => {
    const result = [];
    for (let i=0; i<length; i++) {
      result.push(
        <span className="arrow--00" />
      )
    }
    for (let i=0; i<length; i++) {
      result.push(
        <span className="arrow--01" />
      )
    }
    for (let i=0; i<length; i++) {
      result.push(
        <span className="arrow--02" />
      )
    }
    for (let i=0; i<length; i++) {
      result.push(
        <span className="arrow--03" />
      )
    }
    for (let i=0; i<length; i++) {
      result.push(
        <span className="arrow--04" />
      )
    }
    return (
      <div className={`scroll-arrow ${deg}`}>
        {
          result
        }
      </div>
    )
  }

  const MainContent = (_index: number, _data: string[]) => {
    return (
      <div className="main__section">
        <div className="main__content__image-container"style={{ display: !(_index % 2) ? "none" : "block" }}>

        </div>
        <div className="main__content">
          <div>
            <h2 className="blue">
              #{_index}
            </h2>
          </div>
          <div>
            <p>
              {_data[0]}
            </p>
            <h2>
              {_data[1]}
            </h2>
            <p className="main__content__details">
              {_data[2]}
            </p>
            <div>
              <p>
                {_data[3]}
              </p>
            </div>
          </div>
        </div>
        <div className="main__content__image-container" style={{ display: _index % 2 ? "none" : "block" }}>

        </div>
      </div>
    )
  }
  
  return (
    <div className="main root-container">
      <div className="main__title main__section">
        <div className="main__title__text-container">
          <p>
            부동산 기반 NFT를 담보로
          </p>
          <h2>
            가상자산 대출이 이뤄지는 <span className="blue bold">엘리파이</span>
          </h2>
          <p>
            엘리파이는 부동산 기반의 대출채권을 토큰화하여 만들어진 NFT를 담보로<br />가상자산 대출이 이뤄지는 랜딩 프로토콜입니다.
          </p>
        </div>
        <div className="main__title__button">
          <div>
            <p>
              예치하기
            </p>
          </div>
          <div>
            <p>
              자세히 알아보기
            </p>
          </div>
        </div>
      </div>
      {
        [
          ["가상 자산을 예치하면 보상으로", "이자와 ELFI를 받을 수 있습니다!", `가상자산을 예치하면 예치 이자는 물론 거버넌스 토큰(ELFI)까지 받을 수 있습니다.\n또한 스테이킹시 프로토콜 수익까지 분배 받을 수 있습니다.`, "이자율 확인하기"],
          ["부동산 자산을 담보로 하여", "안정적으로 수익을 얻을 수 있습니다!", "가치의 변동폭이 커서 청산 위험이 높은 가상자산이 아닌\n변동폭이 작은 부동산을 담보로 하는 시스템으로 프로토콜이 안정적으로 운영됩니다.", "담보물 확인하기"],
          ["프로토콜의 운영과 관련된 사항을,", "유저들이 직접 결정합니다!", "대출 실행 여부, 이자율 등 프로토콜의 운영과 관련된 사항이\n유저들의 투표를 통하여 결정되며, 그렇기 때문에 신뢰할 수 있습니다.", "거버넌스 확인하기"]
        ].map((data, _index) => {
          return MainContent(_index + 1, data)
        })
      }
      <div className="main__advantages main__section">
        <h2>왜 <span className="bold blue">ELYFI</span>를 써야하나요?</h2>
        <div className="main__advantages__container">
          {
            [
              [Advantages00, "Stable profit", "You can get stable profit by using real estate as collateral"],
              [Advantages01, "Participation in decision-making", "By holding ELFI tokens, you can participate in various ELYFI decisions"],
              [Advantages02, "Big profit", "You can earn big profits by distributing protocol revenue and governance tokens"],
              [Advantages03, "No limit on investment amount", "There is no limit to the amount of investment, and even a small amount can be invested in real estate assets"],
              [Advantages04, "No signup requierd", "There ard no signup requirements, so anyone in the world can use it"],
              [Advantages05, "Investment details Disclosure", "Real estate investment details ard transparently disclosed"]
            ].map((data, _index) => {
              return (
                <>
                  <div
                    className="main__advantages__wrapper"
                    style={{ 
                      backgroundImage: `url(${data[0]})`,
                      backgroundColor: advantagesHover === _index + 1 ? "#00000055" : "#FFFFFFFF"
                    }}
                    onMouseEnter={() => setAdvantagesHover(_index + 1)}
                    onMouseLeave={() => setAdvantagesHover(0)}
                  >
                    <div 
                      className="main__advantages__wrapper--hovers" 
                      style={{
                        opacity: advantagesHover === _index + 1 ? 0.5 : 0
                      }}
                    />
                    <p>
                      {advantagesHover === _index + 1 ? data[2] : data[1]}
                    </p>
                  </div>
                </>
              )
            })
          }
        </div>
      </div>
      <div className="main__service main__section">
        <h2><span className="bold blue">ELYFI</span> 서비스 이해하기</h2>
        <div className="main__service__graph">
          <div className="main__service__graph--section01">
            <div className="main__service__graph--section01--01">
              <div />
            </div>
            <div className="main__service__graph--section01--02">
              <div>
                <p>
                  투자
                </p>
              </div>
              <div className="main__service__graph__line-wrapper">
              {
                animationLine(5, "left")
              }
              </div>
              <div />
            </div>
            <div className="main__service__graph--section01--03">
              <div />
            </div>
            <div className="main__service__graph--section01--04">
              <p>
                대출채권 토큰화 및 NFT 담보
              </p>
              <div className="main__service__graph__line-wrapper">
              {
                animationLine(7, "right")
              }
              </div>
              <div>

              </div>
              <div className="main__service__graph__line-wrapper">
              {
                animationLine(7, "left")
              }
              </div>
              <p>
                가상자산 대출
              </p>
            </div>
            <div className="main__service__graph--section01--05">
              <div />
            </div>
          </div>
          <div className="main__service__graph--section02">
            <div className="main__service__graph--section02--01">
              <div className="main__service__graph--section02--01--01">
                <div></div>
                <div className="main__service__graph__line-wrapper">
                {
                  animationLine(2, "up")
                }
                </div>
                <div>

                </div>
                <div className="main__service__graph__line-wrapper">
                {
                  animationLine(2, "down")
                }
                </div>
                <div>
                  <p>
                    대출계약
                  </p>
                </div>
              </div>
              <div className="main__service__graph--section02--01--02">
                <div />
              </div>
            </div>
            <div className="main__service__graph--section02--02">
              <div>
                <div />
                <div className="main__service__graph__line-wrapper">
                {
                  animationLine(4, "up")
                }
                </div>
              </div>
              <div className="main__service__graph__line-wrapper">
                {
                  animationLine(8, "left")
                }
              </div>
              <div>
                <div>
                  <p>
                    대출계약
                  </p>
                </div>
                <div>

                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="main__service__comment">
          <p>
            <span className="blue">*</span> 금융위원회에 등록된 온라인투자연계금융업을 영위하려는 회사
          </p>
          <div>
            <p className="bold">
              등록업체 리스트 확인하러 가기 &gt;
            </p>
          </div>
        </div>
      </div>
      <div className="main__partners  main__section">
        <div>
          <h2 className="bold">
            ELFI Token Contract <span className="blue bold">Audited</span> by
          </h2>
          <img src={HaechiLabs} />
        </div>
        <div>
          <h2>
            법률 지원
          </h2>
          <div className="main__partners__lawfirm">
            {
              [SHIN, BKI, FocusLaw, HUB, HOW, TSMP]
              .map((LawFirm) => {
                return (
                  <img src={LawFirm} />
                )
              })
            }
          </div>
        </div>
      </div>
      <MainGovernanceTable />
    </div>
  )
}

export default Main;