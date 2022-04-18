import { useEffect, useRef } from 'react';
import MediaQuery from 'src/enums/MediaQuery';
import TokenColors from 'src/enums/TokenColors';
import useMediaQueryType from 'src/hooks/useMediaQueryType';
import DrawWave from 'src/utiles/drawWave';
import { useTranslation, Trans } from 'react-i18next';
import { useParams } from 'react-router-dom';

const ElStaking: React.FC = () => {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const { lng } = useParams<{ lng: string }>();

  const { value: mediaQuery } = useMediaQueryType();

  const draw = () => {
    const dpr = window.devicePixelRatio;
    const canvas: HTMLCanvasElement | null = canvasRef.current;

    if (!headerRef.current) return;
    if (!canvas) return;
    canvas.width = document.body.clientWidth * dpr;
    canvas.height = document.body.clientHeight * dpr;
    const headerY =
      headerRef.current.offsetTop + document.body.clientWidth > 1190
        ? canvas.height / 2 / dpr
        : 90;
    const browserWidth = canvas.width / dpr + 40;
    const browserHeight = canvas.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    if (mediaQuery === MediaQuery.Mobile) return;

    new DrawWave(ctx, browserWidth).drawOnPages(
      headerY,
      TokenColors.EL,
      browserHeight,
      true,
    );
  };

  useEffect(() => {
    draw();
    window.addEventListener('scroll', () => draw());
    window.addEventListener('resize', () => draw());

    return () => {
      window.removeEventListener('scroll', () => draw());
      window.removeEventListener('resize', () => draw());
    };
  }, [document.body.clientHeight]);

  return (
    <section className="staking__el">
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          width: '100%',
          top: 0,
          left: 0,
          zIndex: -1,
        }}
      />
      <div className="staking__el__content">
        <h2>{t('staking.el.title')}</h2>
        <p>
          <Trans i18nKey="staking.el.content" />
        </p>
        <div onClick={() => window.open(`https://gov.elysia.land/${lng}`)}>
          <p>{t('staking.el.button')}</p>
        </div>
        <section ref={headerRef} />
      </div>
    </section>
  );
};

export default ElStaking;
