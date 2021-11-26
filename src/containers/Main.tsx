
import MainBackground from "src/assets/images/main-background.png";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/src/ScrollTrigger'
import { useEffect, useRef } from "react";

const Main = () => {

  gsap.registerPlugin(ScrollTrigger);

  gsap.to(".main__title", {
    scrollTrigger: {
      trigger: ".main__title",
      scrub: true,
      pin: true,
      start: "center center",
      end: "bottom -100%",
      toggleClass: "active"
    }
  })
  gsap.to(".main__title__image", {
    scrollTrigger: {
      trigger: ".main__title",
      scrub: 0.5,
      start: "top bottom",
      end: "bottom -300%"
    },
    y: "-30%"
  })

  gsap.utils.toArray(".main__content__panel").forEach((section: any, i) => {
    const innerWidth = window.innerWidth;
    const innerHeight = window.innerHeight;
    section.bg = section.querySelector(".main__content__panel__bg"); 
    section.bg.style.backgroundImage = `url(https://picsum.photos/${innerWidth}/${innerHeight}?random=${i})`;

    // Do the parallax effect on each section
    if (i) {
      section.bg.style.backgroundPosition = `50% ${-innerHeight / 2}px`;

      gsap.to(section.bg, {
        backgroundPosition: `50% ${innerHeight / 2}px`,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          scrub: true
        }
      });
    } 
    
    // the first image should be positioned against the top. Use px on the animating part to work with GSAP. 
    else {
      section.bg.style.backgroundPosition = "50% 0px"; 

      gsap.to(section.bg, {
        backgroundPosition: `50% ${innerHeight / 2}px`,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top", 
          end: "bottom top",
          scrub: true
        }
      });
    }
  });


  return (
    <section className="main">
      <div className="main__title">
        <div>
          <div className="main__title__images">
            <img src={MainBackground} className="main__title__image" />
          </div>
          <div className="main__title__content">
            <div>
              <div>
                <p>
                  현실자산과 가상자산을 연결하는
                </p>
                <h3>
                  새로운 디파이 플랫폼, <span className="blue">엘리파이</span>
                </h3>
              </div>
              <div>
                <p>
                  부동산을 연결하여 안정적인 수익을 창출하고 있는 엘리파이<br />
                  엘리파이에 가상자산을 예치하여 실시간으로 쌓이는 이자를 받아가세요!
                </p>
              </div>
            </div>
            <div>
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
          
        </div>
      </div>
      <section className="main__content">
        <div className="main__content__panel">
          <div className="main__content__panel__sticky">
            <p>#1</p>
          </div>
          <div>
            <div className="main__content__panel__bg">
              <div>
              <h2>
                전통적인 금융시장 대비<br />
                <span>
                  훨씬 큰 수익을 얻을 수 있습니다!
                </span>
              </h2>
              <p>
                전통금융 시장과 달리, 우리는 예치가 높습니다<br />
                또한 투자자에게 거버넌스 토큰을 지급하여 더 큰 수익을 보장합니다.
              </p>
              </div>
            </div>
            
          </div>
        </div>
        <div className="main__content__panel">
          <div className="main__content__panel__sticky">
            <p>#2</p>
          </div>
          <div>
            <div className="main__content__panel__bg">
              <div>
              <h2>
                전통적인 금융시장 대비<br />
                <span>
                  훨씬 큰 수익을 얻을 수 있습니다!
                </span>
              </h2>
              <p>
                전통금융 시장과 달리, 우리는 예치가 높습니다<br />
                또한 투자자에게 거버넌스 토큰을 지급하여 더 큰 수익을 보장합니다.
              </p>
              </div>
            </div>
            
          </div>
        </div>
        <div className="main__content__panel">
          <div className="main__content__panel__sticky">
            <p>#3</p>
          </div>
          <div>
            <div className="main__content__panel__bg">
              
            <div>
              <h2>
                전통적인 금융시장 대비<br />
                <span>
                  훨씬 큰 수익을 얻을 수 있습니다!
                </span>
              </h2>
              <p>
                전통금융 시장과 달리, 우리는 예치가 높습니다<br />
                또한 투자자에게 거버넌스 토큰을 지급하여 더 큰 수익을 보장합니다.
              </p>
            </div>
            </div>
          </div>
        </div>
        <div className="main__content__panel">
          <div className="main__content__panel__sticky">
            <p>#4</p>
          </div>
          <div>
            <div className="main__content__panel__bg">

            <div>
              <h2>
                전통적인 금융시장 대비<br />
                <span>
                  훨씬 큰 수익을 얻을 수 있습니다!
                </span>
              </h2>
              <p>
                전통금융 시장과 달리, 우리는 예치가 높습니다<br />
                또한 투자자에게 거버넌스 토큰을 지급하여 더 큰 수익을 보장합니다.
              </p>
            </div>
            </div>
          </div>
        </div>
      </section>
      <div>
        END
      </div>
    </section>
  )
}

export default Main;