import { useEffect, useRef, useState, lazy, Suspense } from 'react';

import DrawWave from 'src/utiles/drawWave';
import Skeleton from 'react-loading-skeleton';
import useMediaQueryType from 'src/hooks/useMediaQueryType';
import MediaQuery from 'src/enums/MediaQuery';

const Advantage = lazy(() => import('./Advantage'));
const SectionEvent = lazy(() => import('./SectionEvent'));
const Service = lazy(() => import('./Service'));
const MainPage = lazy(() => import('./MainPage'));
const Partners = lazy(() => import('./Partners'));
const MainGovernanceTable = lazy(
  () => import('src/components/Main/MainGovernanceTable'),
);

const Main = (): JSX.Element => {
  const [popupVisible, setPopupVisible] = useState(false);
  const mainCanvasRef = useRef<HTMLCanvasElement>(null);
  const mainHeaderY = useRef<HTMLParagraphElement>(null);
  const mainHeaderMoblieY = useRef<HTMLParagraphElement>(null);
  const guideY = useRef<HTMLParagraphElement>(null);
  const auditPageY = useRef<HTMLParagraphElement>(null);
  const governancePageY = useRef<HTMLParagraphElement>(null);
  const governancePageBottomY = useRef<HTMLParagraphElement>(null);
  const { value: mediaQueryType } = useMediaQueryType();
  const [isPartnersLoading, setIsPartnersLoading] = useState(true);
  const [isAdvantageLoading, setIsAdvantageLoading] = useState(true);

  const draw = (isResize: boolean) => {
    const dpr = window.devicePixelRatio;
    const canvas: HTMLCanvasElement | null = mainCanvasRef.current;
    if (
      !mainHeaderY.current ||
      !mainHeaderMoblieY.current ||
      !guideY.current ||
      !auditPageY.current
    ) {
      return;
    }
    if (!canvas) return;
    canvas.width = document.body.clientWidth * dpr;
    canvas.height = document.body.clientHeight * dpr;
    const browserWidth = canvas.width / dpr + 40;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    mediaQueryType === MediaQuery.Mobile
      ? new DrawWave(ctx, browserWidth).drawMoblieOnMain(
          mainHeaderY.current,
          mainHeaderMoblieY.current,
          guideY.current,
          auditPageY.current,
          isResize,
        )
      : new DrawWave(ctx, browserWidth).drawOnMain(
          mainHeaderY.current,
          mainHeaderMoblieY.current,
          guideY.current,
          auditPageY.current,
          isResize,
        );
  };

  useEffect(() => {
    if (isAdvantageLoading || isPartnersLoading) return;
    const setTime = setTimeout(() => {
      draw(false);
    }, 200);

    return () => {
      clearTimeout(setTime);
    };
  }, [isAdvantageLoading, isPartnersLoading]);

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
          <Suspense
            fallback={
              <div ref={mainHeaderY}>
                <div ref={mainHeaderMoblieY} />
              </div>
            }>
            <MainPage
              mainHeaderY={mainHeaderY}
              mainHeaderMoblieY={mainHeaderMoblieY}
            />
          </Suspense>
        </section>
        <Suspense fallback={<div style={{ height: '100vh' }} />}>
          <SectionEvent />
        </Suspense>
        <section className="main__advantages main__section">
          <Suspense fallback={<div style={{ height: '80vh' }} />}>
            <Advantage
              guideY={guideY}
              setIsAdvantageLoading={() => setIsAdvantageLoading(false)}
            />
          </Suspense>
        </section>
        <section className="main__partners main__section">
          <Suspense fallback={<div style={{ height: '100vh' }} />}>
            <Partners
              auditPageY={auditPageY}
              setIsPartnersLoading={() => setIsPartnersLoading(false)}
            />
          </Suspense>
        </section>
      </div>
    </>
  );
};

export default Main;
