import { useEffect, useRef, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';

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
import AssetDom from 'src/assets/images/main/asset-dom.png';
import Pit from 'src/assets/images/main/pit.png';
import { useTranslation, Trans } from 'react-i18next';
import MainContent from 'src/components/MainContent';
import MainGraph from 'src/components/MainGraph';
import LanguageType from 'src/enums/LanguageType';
import MainAnimation from 'src/components/MainAnimation';
import { contextType } from 'google-map-react';

const Main = () => {
  const { t } = useTranslation();
  const mainCanvasRef = useRef<HTMLCanvasElement>(null);
  const mainHeaderY = useRef<HTMLParagraphElement>(null);
  const mainHeaderMoblieY = useRef<HTMLParagraphElement>(null);
  const guideY = useRef<HTMLParagraphElement>(null);
  const serviceGraphPageY = useRef<HTMLParagraphElement>(null);
  const auditPageY = useRef<HTMLParagraphElement>(null);
  const governancePageY = useRef<HTMLParagraphElement>(null);
  const governancePageBottomY = useRef<HTMLParagraphElement>(null);
  const [loading, setLoading] = useState(true);
  const History = useHistory();
  const { lng } = useParams<{ lng: string }>();
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [innerHeight, setInnerHeight] = useState(window.innerHeight);
  const sectionEvent = [
    {
      image: MainAnimation(0),
      link: `/${lng}/rewardplan/deposit`,
    },
    {
      image: MainAnimation(1),
      link: `/${lng}/dashboard`,
    },
    {
      image: MainAnimation(2),
      link: `/${lng}/governance`,
    },
  ];

  const resizeBrowser = () => {
    setInnerWidth(window.innerWidth);
    setInnerHeight(window.innerHeight);
  };

  useEffect(() => {
    window.addEventListener('resize', resizeBrowser);

    return () => {
      window.removeEventListener('resize', resizeBrowser);
    };
  }, []);

  const draw = () => {
    const dpr = window.devicePixelRatio;
    const canvas: HTMLCanvasElement | null = mainCanvasRef.current;
    if (!mainHeaderY.current) return;
    const headerY = mainHeaderY.current.offsetTop;
    if (!mainHeaderMoblieY.current) return;
    const mainMoblieY = mainHeaderMoblieY.current.offsetTop;
    if (!guideY.current) return;
    const guidePageY = guideY.current?.offsetTop;
    if (!serviceGraphPageY.current) return;
    const serviceGraphY = serviceGraphPageY.current.offsetTop;
    if (!auditPageY.current) return;
    const auditY = auditPageY.current.offsetTop;
    if (!governancePageY.current) return;
    const governanceY = governancePageY.current.offsetTop;
    if (!governancePageBottomY.current) return;
    const governanceBottomY = governancePageY.current.offsetHeight;

    if (!canvas) return;
    canvas.width = document.body.clientWidth * dpr;
    canvas.height = document.body.clientHeight * dpr;
    const browserWidth = canvas.width / dpr + 40;
    const context = canvas.getContext('2d');
    if (!context) return;
    context.scale(dpr, dpr);
    context.strokeStyle = '#00BFFF';
    const yValue = browserWidth > 1190 ? headerY : mainMoblieY / 1.12;
    context.beginPath();
    context.moveTo(0, yValue * 1.6);
    context.bezierCurveTo(
      browserWidth / 2,
      // 970,
      yValue * 1.885,
      browserWidth / 1.5,
      yValue * 1.145,
      browserWidth,
      yValue * 1.398,
    );
    context.moveTo(0, yValue * 1.631);
    context.bezierCurveTo(
      browserWidth / 1.5,
      yValue * 1.897,
      browserWidth / 1.7,
      yValue * 1.139,
      browserWidth,
      yValue * 1.417,
    );
    context.stroke();

    context.fillStyle = '#ffffff';
    context.beginPath();
    context.moveTo(browserWidth / 3.2 + 10, yValue * 1.685);
    context.arc(browserWidth / 3.2, yValue * 1.685, 10, 0, Math.PI * 2, true);

    context.moveTo(browserWidth / 3.35 + 4.4, yValue * 1.658);
    context.arc(browserWidth / 3.35, yValue * 1.658, 4.4, 0, Math.PI * 2, true);

    context.moveTo(browserWidth / 1.33 + 10, yValue * 1.378);
    context.arc(browserWidth / 1.33, yValue * 1.378, 10, 0, Math.PI * 2, true);

    context.moveTo(browserWidth / 1.31 + 5, yValue * 1.398);
    context.arc(browserWidth / 1.31, yValue * 1.398, 5, 0, Math.PI * 2, true);
    context.fill();

    context.stroke();

    context.beginPath();
    context.moveTo(0, guidePageY * 0.957);
    context.bezierCurveTo(
      browserWidth / 2,
      guidePageY * 0.933,
      browserWidth / 1.5,
      guidePageY * 1.057,
      browserWidth,
      guidePageY * 1.03,
    );
    context.stroke();

    // bottom
    context.fillStyle = 'rgba(247, 251, 255, 1)';
    context.beginPath();
    context.moveTo(0, guidePageY * 0.9639);
    context.bezierCurveTo(
      browserWidth / 2,
      guidePageY * 0.9484,
      browserWidth / 1.5,
      guidePageY * 1.0454,
      browserWidth,
      guidePageY * 1.0363,
    );
    context.lineTo(browserWidth, serviceGraphY * 0.9513);
    context.bezierCurveTo(
      browserWidth / 2,
      serviceGraphY * 1.0065,
      browserWidth / 1.5,
      serviceGraphY * 0.929,
      0,
      serviceGraphY * 0.992,
    );
    context.closePath();
    context.fill();
    context.stroke();

    context.beginPath();
    context.moveTo(0, serviceGraphY * 0.997);
    context.bezierCurveTo(
      browserWidth / 2,
      serviceGraphY * 0.9432,
      browserWidth / 1.4,
      serviceGraphY * 0.9972,
      browserWidth,
      serviceGraphY * 0.9538,
    );
    context.stroke();

    context.fillStyle = '#ffffff';
    // bottom circle
    context.beginPath();
    context.moveTo(browserWidth / 4 + 10, guidePageY * 0.966);
    context.arc(browserWidth / 4, guidePageY * 0.966, 10, 0, Math.PI * 2, true);
    context.fill();

    context.moveTo(browserWidth / 1.2 + 10, guidePageY * 1.0324);
    context.arc(
      browserWidth / 1.2,
      guidePageY * 1.0324,
      10,
      0,
      Math.PI * 2,
      true,
    );
    context.fill();

    context.moveTo(browserWidth / 1.22 + 5, guidePageY * 1.0281);
    context.arc(
      browserWidth / 1.22,
      guidePageY * 1.0281,
      5,
      0,
      Math.PI * 2,
      true,
    );
    context.fill();

    context.moveTo(browserWidth / 4 + 10, serviceGraphY * 0.977);
    context.arc(
      browserWidth / 4,
      serviceGraphY * 0.977,
      10,
      0,
      Math.PI * 2,
      true,
    );
    context.fill();

    context.moveTo(browserWidth / 3.8 + 5, serviceGraphY * 0.9714);
    context.arc(
      browserWidth / 3.8,
      serviceGraphY * 0.9714,
      5,
      0,
      Math.PI * 2,
      true,
    );
    context.fill();

    context.stroke();

    // audit image
    context.beginPath();
    context.moveTo(0, auditY * 0.9605);
    context.bezierCurveTo(
      browserWidth / 2,
      auditY * 1.0117,
      browserWidth / 1.7,
      auditY * 0.9301,
      browserWidth,
      auditY * 0.9877,
    );

    context.moveTo(0, auditY * 0.966);
    context.bezierCurveTo(
      browserWidth / 2,
      auditY * 1.0045,
      browserWidth / 1.7,
      auditY * 0.9301,
      browserWidth,
      auditY * 0.995,
    );
    context.stroke();

    // circle
    context.beginPath();
    context.moveTo(browserWidth / 3 + 10, auditY * 0.978);
    context.arc(browserWidth / 3, auditY * 0.978, 10, 0, Math.PI * 2, true);

    context.moveTo(browserWidth / 3.12 + 5, auditY * 0.9761);
    context.arc(browserWidth / 3.12, auditY * 0.9761, 5, 0, Math.PI * 2, true);
    context.fill();

    context.stroke();

    // gorvernence
    context.beginPath();
    context.moveTo(0, governanceY * 0.9936);
    context.bezierCurveTo(
      browserWidth / 2,
      governanceY * 0.961,
      browserWidth / 1.7,
      governanceY * 1.001,
      browserWidth,
      governanceY * 0.9663,
    );
    context.stroke();
    context.fillStyle = 'rgba(247, 251, 255, 1)';
    context.beginPath();
    context.moveTo(0, governanceY * 0.996);
    context.bezierCurveTo(
      browserWidth / 2,
      governanceY * 0.96,
      browserWidth / 1.7,
      governanceY * 1.001,
      browserWidth,
      governanceY * 0.9708,
    );
    context.lineTo(
      browserWidth,
      governanceY * 0.9708 + governanceBottomY + 220,
    );
    context.bezierCurveTo(
      browserWidth / 2,
      governanceY * 0.9708 + governanceBottomY + 110,
      browserWidth / 1.7,
      governanceY * 0.9708 + governanceBottomY + 280,
      0,
      governanceY * 0.9708 + governanceBottomY + 280,
    );
    // context.lineTo(0, governanceY * 0.9708 + governanceBottomY + 220);
    context.fill();
    context.stroke();

    context.beginPath();
    context.moveTo(0, governanceY * 0.9708 + governanceBottomY + 290);
    context.bezierCurveTo(
      browserWidth / 2,
      governanceY * 0.9708 + governanceBottomY + 290,
      browserWidth / 1.7,
      governanceY * 0.9708 + governanceBottomY + 100,
      browserWidth,
      governanceY * 0.9708 + governanceBottomY + 240,
    );

    context.stroke();
    // circle
    context.fillStyle = '#ffffff';
    context.beginPath();
    context.moveTo(browserWidth / 3.2 + 10, governanceY * 0.9807);
    context.arc(
      browserWidth / 3.2,
      governanceY * 0.9807,
      10,
      0,
      Math.PI * 2,
      true,
    );

    context.moveTo(browserWidth / 3.07 + 5, governanceY * 0.98);
    context.arc(
      browserWidth / 3.07,
      governanceY * 0.98,
      5,
      0,
      Math.PI * 2,
      true,
    );

    context.moveTo(
      browserWidth / 2.5 + 10,
      governanceY * 0.9708 + governanceBottomY + 243,
    );
    context.arc(
      browserWidth / 2.5,
      governanceY * 0.9708 + governanceBottomY + 243,
      10,
      0,
      Math.PI * 2,
      true,
    );

    context.moveTo(
      browserWidth / 2.6 + 5,
      governanceY * 0.9708 + governanceBottomY + 256,
    );
    context.arc(
      browserWidth / 2.6,
      governanceY * 0.9708 + governanceBottomY + 256,
      5,
      0,
      Math.PI * 2,
      true,
    );

    context.fill();
    context.stroke();
  };

  useEffect(() => {
    draw();
  }, [innerHeight, innerWidth, loading]);

  return (
    <>
      <canvas
        ref={mainCanvasRef}
        style={{
          position: 'absolute',
          width: '100%',
          top: 0,
          left: 0,
          zIndex: -1,
        }}
      />
      <div className="main root-container">
        <section className="main__title main__section">
          <div className="main__title__container">
            <div className="main__title__text-container">
              <p>
                <Trans i18nKey="main.landing.header__title" />
              </p>
              <p>{t('main.landing.header__content')}</p>
            </div>
            <div className="main__title__button pc-only">
              <div
                onClick={() => History.push({ pathname: `/${lng}/deposit` })}>
                <p ref={mainHeaderY}> {t('main.landing.button__deposit')}</p>
              </div>
              <div
                onClick={() =>
                  window.open(
                    lng === LanguageType.KO
                      ? 'https://elysia.gitbook.io/elysia.finance/'
                      : 'https://elysia.gitbook.io/elysia.finance/v/eng',
                  )
                }>
                <p>{t('main.landing.button__view-more')}</p>
              </div>
            </div>
          </div>
          <div className="main__image-wrapper">
            <img src={AssetDom} className="dom" />
            <img src={Pit} className="pit" />
          </div>
          <div className="main__title__button mobile-only">
            <div
              onClick={() => History.push({ pathname: `/${lng}/dashboard` })}>
              <p ref={mainHeaderMoblieY}>{t('main.landing.button__deposit')}</p>
            </div>
            <div
              onClick={() =>
                window.open(
                  lng === LanguageType.KO
                    ? 'https://elysia.gitbook.io/elysia.finance/'
                    : 'https://elysia.gitbook.io/elysia.finance/v/eng',
                )
              }>
              <p>{t('main.landing.button__view-more')}</p>
            </div>
          </div>
        </section>
        {sectionEvent.map((_data, _index) => {
          return <MainContent index={_index} data={_data} />;
        })}
        <section className="main__advantages main__section">
          <h2 ref={guideY}>
            <Trans i18nKey={'main.advantages.header'} />
          </h2>
          <div className="main__advantages__container">
            {[
              [
                Advantages00,
                t('main.advantages.section.0.header'),
                t('main.advantages.section.0.content'),
              ],
              [
                Advantages01,
                t('main.advantages.section.1.header'),
                t('main.advantages.section.1.content'),
              ],
              [
                Advantages02,
                t('main.advantages.section.2.header'),
                t('main.advantages.section.2.content'),
              ],
              [
                Advantages03,
                t('main.advantages.section.3.header'),
                t('main.advantages.section.3.content'),
              ],
              [
                Advantages04,
                t('main.advantages.section.4.header'),
                t('main.advantages.section.4.content'),
              ],
              [
                Advantages05,
                t('main.advantages.section.5.header'),
                t('main.advantages.section.5.content'),
              ],
            ].map((data, _index) => {
              return (
                <>
                  <div>
                    <img src={data[0]} />
                    <div>
                      <h2>{data[1]}</h2>
                      <p>{data[2]}</p>
                    </div>
                  </div>
                </>
              );
            })}
          </div>
        </section>
        <section className="main__service main__section">
          <h2 ref={serviceGraphPageY}>
            <Trans i18nKey={'main.graph.title'} />
          </h2>

          <MainGraph />

          <div className="main__service__comment pc-only">
            <p>{t('main.graph.investment-linked-financial')}</p>
            <div
              onClick={() =>
                window.open('https://www.fsc.go.kr/no040101?cnId=911')
              }>
              <h2>{t('main.graph.investment-linked-financial--button')}</h2>
            </div>
          </div>
        </section>
        <section className="main__partners main__section">
          <div>
            <h2 ref={auditPageY} className="bold">
              <Trans i18nKey={'main.partners.title'} />
            </h2>
            <img src={HaechiLabs} />
          </div>
          <div>
            <h2>{t('main.partners.lawfirm')}</h2>
            <div className="main__partners__lawfirm">
              {[SHIN, BKI, FocusLaw, HUB, HOW, TSMP].map((LawFirm) => {
                return <img src={LawFirm} />;
              })}
            </div>
          </div>
        </section>
        <MainGovernanceTable
          governancePageY={governancePageY}
          governancePageBottomY={governancePageBottomY}
          setLoading={setLoading}
        />
      </div>
    </>
  );
};

export default Main;
