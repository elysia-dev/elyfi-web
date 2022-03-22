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
const MainGovernanceTable = lazy(() => import('src/components/Main/MainGovernanceTable'));
const ShowingPopup = lazy(() => import('src/components/Popup'));

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

  const draw = (isResize: boolean) => {
    const dpr = window.devicePixelRatio;
    const canvas: HTMLCanvasElement | null = mainCanvasRef.current;
    if (
      !mainHeaderY.current ||
      !mainHeaderMoblieY.current ||
      !guideY.current ||
      !auditPageY.current ||
      !governancePageY.current ||
      !governancePageBottomY.current
    )
      return;
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
          governancePageY.current,
          isResize,
        )
      : new DrawWave(ctx, browserWidth).drawOnMain(
          mainHeaderY.current,
          mainHeaderMoblieY.current,
          guideY.current,
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

  useEffect(() => {
    draw(false);
  }, [governancePageBottomY.current]);

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
      <Suspense fallback={null}>
        <ShowingPopup 
          visible={popupVisible}
          closeHandler={setPopupVisible}
        />
      </Suspense>
      <div className="main root-container">
        <section className="main__title main__section">
          <Suspense fallback={<Skeleton width={"100%"} height={'100%'} />}>
            <MainPage 
              mainHeaderY={mainHeaderY}
              mainHeaderMoblieY={mainHeaderMoblieY}
            />
          </Suspense>
        </section>
        <Suspense fallback={<Skeleton width={"100%"} height={'100%'} />}>
          <SectionEvent />
        </Suspense>
        <section className="main__advantages main__section">
          <Suspense fallback={<Skeleton width={"100%"} height={'100%'} />}>
            <Advantage guideY={guideY} />
          </Suspense>
        </section>
        {/* <section className="main__service main__section">
          <Suspense fallback={<Skeleton width={"100%"} height={'100%'} />}>
            <Service serviceGraphPageY={serviceGraphPageY} />
          </Suspense>
        </section> */}
        <section className="main__partners main__section">
          <Suspense fallback={<Skeleton width={"100%"} height={'100%'} />}>
            <Partners auditPageY={auditPageY} />
          </Suspense>
        </section>
        <Suspense fallback={<Skeleton width={"100%"} height={'100%'} />}>
          <MainGovernanceTable
            governancePageY={governancePageY}
            governancePageBottomY={governancePageBottomY}
            draw={draw}
          />
        </Suspense>
      </div>
    </>
  );
};

export default Main;
