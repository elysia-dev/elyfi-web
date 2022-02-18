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
import reactGA from 'react-ga';
import PageEventType from 'src/enums/PageEventType';
import ButtonEventType from 'src/enums/ButtonEventType';
import { contextType } from 'google-map-react';
import DrawWave from 'src/utiles/drawWave';
import Fbg from 'src/assets/images/main/fbg.png';
import Blocore from 'src/assets/images/main/blocore.png';

const Main = (): JSX.Element => {
  const { t } = useTranslation();
  const mainCanvasRef = useRef<HTMLCanvasElement>(null);
  const mainHeaderY = useRef<HTMLParagraphElement>(null);
  const mainHeaderMoblieY = useRef<HTMLParagraphElement>(null);
  const guideY = useRef<HTMLParagraphElement>(null);
  const serviceGraphPageY = useRef<HTMLParagraphElement>(null);
  const auditPageY = useRef<HTMLParagraphElement>(null);
  const governancePageY = useRef<HTMLParagraphElement>(null);
  const governancePageBottomY = useRef<HTMLParagraphElement>(null);
  const History = useHistory();
  const { lng } = useParams<{ lng: string }>();
  const sectionEvent = [
    {
      image: MainAnimation(0),
      link: `/${lng}/rewardplan/deposit`,
      ga: () => {
        reactGA.event({
          category: PageEventType.MoveToInternalPage,
          action: ButtonEventType.CheckInterestRateButton,
        });
      },
    },
    {
      image: MainAnimation(1),
      link: `/${lng}/deposit`,
      ga: () => {
        reactGA.event({
          category: PageEventType.MoveToInternalPage,
          action: ButtonEventType.CheckCollateralButton,
        });
      },
    },
    {
      image: MainAnimation(2),
      link: `/${lng}/governance`,
      ga: () => {
        reactGA.event({
          category: PageEventType.MoveToInternalPage,
          action: ButtonEventType.CheckGovernanceButton,
        });
      },
    },
  ];

  const draw = (isResize: boolean) => {
    const dpr = window.devicePixelRatio;
    const canvas: HTMLCanvasElement | null = mainCanvasRef.current;
    if (
      !mainHeaderY.current ||
      !mainHeaderMoblieY.current ||
      !guideY.current ||
      !serviceGraphPageY.current ||
      !auditPageY.current ||
      !governancePageY.current ||
      !governancePageBottomY.current
    )
      return;
    if (!canvas) return;
    canvas.width = document.body.clientWidth * dpr;
    canvas.height = document.body.clientHeight * dpr + (isResize ? 0 : 500);
    const browserWidth = canvas.width / dpr + 40;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    new DrawWave(ctx, browserWidth).drawOnMain(
      mainHeaderY.current,
      mainHeaderMoblieY.current,
      guideY.current,
      serviceGraphPageY.current,
      auditPageY.current,
      governancePageY.current,
      isResize,
    );
  };

  useEffect(() => {
    draw(false);
    window.addEventListener('resize', () => draw(true));

    return () => {
      window.removeEventListener('resize', () => draw(true));
    };
  }, []);

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
                onClick={() => {
                  reactGA.event({
                    category: PageEventType.MoveToInternalPage,
                    action: ButtonEventType.DepositButton,
                  });
                  History.push({ pathname: `/${lng}/deposit` });
                }}>
                <p ref={mainHeaderY}> {t('main.landing.button__deposit')}</p>
              </div>
              <div
                onClick={() => {
                  reactGA.event({
                    category: PageEventType.MoveToExternalPage,
                    action: ButtonEventType.LearnMoreButton,
                  });
                  window.open(
                    lng === LanguageType.KO
                      ? 'https://elysia.gitbook.io/elysia.finance/'
                      : 'https://elysia.gitbook.io/elysia.finance/v/eng',
                  );
                }}>
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
              onClick={() => {
                reactGA.event({
                  category: PageEventType.MoveToInternalPage,
                  action: ButtonEventType.DepositButton,
                });
                History.push({ pathname: `/${lng}/deposit` });
              }}>
              <p ref={mainHeaderMoblieY}>{t('main.landing.button__deposit')}</p>
            </div>
            <div
              onClick={() => {
                reactGA.event({
                  category: PageEventType.MoveToExternalPage,
                  action: ButtonEventType.LearnMoreButton,
                });
                window.open(
                  lng === LanguageType.KO
                    ? 'https://elysia.gitbook.io/elysia.finance/'
                    : 'https://elysia.gitbook.io/elysia.finance/v/eng',
                );
              }}>
              <p>{t('main.landing.button__view-more')}</p>
            </div>
          </div>
        </section>
        {sectionEvent.map((_data, _index) => {
          return (
            <MainContent
              key={`sectionEvent_${_index}`}
              index={_index}
              data={_data}
            />
          );
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
                <div key={`advantage_${_index}`}>
                  <img src={data[0]} />
                  <div>
                    <h2>{data[1]}</h2>
                    <p>{data[2]}</p>
                  </div>
                </div>
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
            <h2 className="bold">
              <strong>Backed</strong> by
            </h2>
            <div>
              <img src={Fbg} alt={Fbg} />
              <img src={Blocore} alt={Blocore} />
            </div>
          </div>
          <div className="main__dao">
            <h2>
              <Trans i18nKey="main.dao.title" />
            </h2>
            <div>
              <div>
                <p>{t('main.dao.content.0')}</p>
              </div>
              <div>
                <p>{t('main.dao.content.1')}</p>
              </div>
              <div>
                <p>{t('main.dao.content.2')}</p>
              </div>
            </div>
          </div>
          <div>
            <h2>{t('main.partners.lawfirm')}</h2>
            <div className="main__partners__lawfirm">
              {[SHIN, BKI, FocusLaw, HUB, HOW, TSMP].map((LawFirm, _index) => {
                return <img key={`partner_${_index}`} src={LawFirm} />;
              })}
            </div>
          </div>
        </section>
        <MainGovernanceTable
          governancePageY={governancePageY}
          governancePageBottomY={governancePageBottomY}
        />
      </div>
    </>
  );
};

export default Main;
