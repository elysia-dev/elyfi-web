import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Trans, useTranslation } from 'react-i18next';
import MediaQuery from 'src/enums/MediaQuery';
import TokenColors from 'src/enums/TokenColors';
import useMediaQueryType from 'src/hooks/useMediaQueryType';
import DrawWave from 'src/utiles/drawWave';

const LazyImage = lazy(() => import('src/utiles/lazyImage'));

import KoGuide1s00 from 'src/assets/images/market/guide/ko/1/guide01.png';
import KoGuide1s01 from 'src/assets/images/market/guide/ko/1/guide02.png';
import KoGuide1s02 from 'src/assets/images/market/guide/ko/1/guide03.png';
import KoGuide1s03 from 'src/assets/images/market/guide/ko/1/guide04.png';
import KoGuide1s04 from 'src/assets/images/market/guide/ko/1/guide05.png';
import KoGuide1s05 from 'src/assets/images/market/guide/ko/1/guide06.png';
import KoGuide1s06 from 'src/assets/images/market/guide/ko/1/guide07.png';
import KoGuide1s07 from 'src/assets/images/market/guide/ko/1/guide08.png';
import KoGuide2s00 from 'src/assets/images/market/guide/ko/2/guide01.png';
import KoGuide2s01 from 'src/assets/images/market/guide/ko/2/guide02.png';
import KoGuide2s02 from 'src/assets/images/market/guide/ko/2/guide03.png';
import KoGuide2s03 from 'src/assets/images/market/guide/ko/2/guide04.png';
import KoGuide2s04 from 'src/assets/images/market/guide/ko/2/guide05.png';
import KoGuide2s05 from 'src/assets/images/market/guide/ko/2/guide06.png';
import KoGuide2s06 from 'src/assets/images/market/guide/ko/2/guide07.png';
import KoGuide3s00 from 'src/assets/images/market/guide/ko/3/guide01.png';
import KoGuide3s01 from 'src/assets/images/market/guide/ko/3/guide02.png';
import KoGuide3s02 from 'src/assets/images/market/guide/ko/3/guide03.png';
import KoGuide3s03 from 'src/assets/images/market/guide/ko/3/guide04.png';
import KoGuide3s04 from 'src/assets/images/market/guide/ko/3/guide05.png';
import KoGuide3s05 from 'src/assets/images/market/guide/ko/3/guide06.png';
import KoGuide4s00 from 'src/assets/images/market/guide/ko/4/guide01.png';
import KoGuide4s01 from 'src/assets/images/market/guide/ko/4/guide02.png';
import KoGuide4s02 from 'src/assets/images/market/guide/ko/4/guide03.png';
import KoGuide4s03 from 'src/assets/images/market/guide/ko/4/guide04.png';
import KoGuide5s00 from 'src/assets/images/market/guide/ko/5/guide01.png';
import KoGuide5s01 from 'src/assets/images/market/guide/ko/5/guide02.png';
import KoGuide5s02 from 'src/assets/images/market/guide/ko/5/guide03.png';
import KoGuide5s03 from 'src/assets/images/market/guide/ko/5/guide04.png';
import KoGuide5s04 from 'src/assets/images/market/guide/ko/5/guide05.png';
import KoGuide5s05 from 'src/assets/images/market/guide/ko/5/guide06.png';

import EnGuide1s00 from 'src/assets/images/market/guide/en/1/guide01.png';
import EnGuide1s01 from 'src/assets/images/market/guide/en/1/guide02.png';
import EnGuide1s02 from 'src/assets/images/market/guide/en/1/guide03.png';
import EnGuide1s03 from 'src/assets/images/market/guide/en/1/guide04.png';
import EnGuide1s04 from 'src/assets/images/market/guide/en/1/guide05.png';
import EnGuide1s05 from 'src/assets/images/market/guide/en/1/guide06.png';
import EnGuide1s06 from 'src/assets/images/market/guide/en/1/guide07.png';
import EnGuide1s07 from 'src/assets/images/market/guide/en/1/guide08.png';
import EnGuide3s00 from 'src/assets/images/market/guide/en/3/guide01.png';
import EnGuide3s01 from 'src/assets/images/market/guide/en/3/guide02.png';
import EnGuide3s02 from 'src/assets/images/market/guide/en/3/guide03.png';
import EnGuide3s03 from 'src/assets/images/market/guide/en/3/guide04.png';
import EnGuide3s04 from 'src/assets/images/market/guide/en/3/guide05.png';
import EnGuide3s05 from 'src/assets/images/market/guide/en/3/guide06.png';
import EnGuide3s06 from 'src/assets/images/market/guide/en/3/guide07.png';
import EnGuide3s07 from 'src/assets/images/market/guide/en/3/guide08.png';
import EnGuide3s08 from 'src/assets/images/market/guide/en/3/guide09.png';
import EnGuide3s09 from 'src/assets/images/market/guide/en/3/guide10.png';
import EnGuide4s00 from 'src/assets/images/market/guide/en/4/guide01.png';
import EnGuide4s01 from 'src/assets/images/market/guide/en/4/guide02.png';
import EnGuide4s02 from 'src/assets/images/market/guide/en/4/guide03.png';
import EnGuide4s03 from 'src/assets/images/market/guide/en/4/guide04.png';
import EnGuide5s00 from 'src/assets/images/market/guide/en/5/guide01.png';
import EnGuide5s01 from 'src/assets/images/market/guide/en/5/guide02.png';
import EnGuide5s02 from 'src/assets/images/market/guide/en/5/guide03.png';
import EnGuide5s03 from 'src/assets/images/market/guide/en/5/guide04.png';
import EnGuide5s04 from 'src/assets/images/market/guide/en/5/guide05.png';
import EnGuide5s05 from 'src/assets/images/market/guide/en/5/guide06.png';
import scrollToOffeset from 'src/core/utils/scrollToOffeset';
import Skeleton from 'react-loading-skeleton';

const questionBox = {
  arrow: '',
  box: '',
  visible: false,
};

const MarketFAQ = (): JSX.Element => {
  const { t, i18n } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const { value: mediaQuery } = useMediaQueryType();
  const FAQRef = useRef<HTMLDivElement>(null);

  const [isQ1Visible, setIsQ1Visible] = useState(questionBox);
  const [isQ2Visible, setIsQ2Visible] = useState(questionBox);
  const [isQ3Visible, setIsQ3Visible] = useState(questionBox);
  const [isQ4Visible, setIsQ4Visible] = useState(questionBox);
  const [isQ5Visible, setIsQ5Visible] = useState(questionBox);

  const initialAllBox = () => {
    return (
      setIsQ1Visible(questionBox),
      setIsQ2Visible(questionBox),
      setIsQ3Visible(questionBox),
      setIsQ4Visible(questionBox),
      setIsQ5Visible(questionBox)
    );
  };

  const onClickBox = useCallback(
    (questionNumber: number) => {
      switch (questionNumber) {
        case 1:
          initialAllBox();
          setIsQ1Visible({
            ...isQ1Visible,
            arrow: isQ1Visible.visible ? 'arrow_down' : 'arrow_up',
            box: isQ1Visible.visible
              ? `box${questionNumber}_up`
              : `box${questionNumber}_down`,
            visible: !isQ1Visible.visible,
          });
          break;
        case 2:
          initialAllBox();
          setIsQ2Visible({
            ...isQ2Visible,
            arrow: isQ2Visible.visible ? 'arrow_down' : 'arrow_up',
            box: isQ2Visible.visible
              ? `box${questionNumber}_up`
              : `box${questionNumber}_down`,
            visible: !isQ2Visible.visible,
          });
          break;
        case 3:
          initialAllBox();
          setIsQ3Visible({
            ...isQ3Visible,
            arrow: isQ3Visible.visible ? 'arrow_down' : 'arrow_up',
            box: isQ3Visible.visible
              ? `box${questionNumber}_up`
              : `box${questionNumber}_down`,
            visible: !isQ3Visible.visible,
          });
          break;
        case 4:
          initialAllBox();
          setIsQ4Visible({
            ...isQ4Visible,
            arrow: isQ4Visible.visible ? 'arrow_down' : 'arrow_up',
            box: isQ4Visible.visible
              ? `box${questionNumber}_up`
              : `box${questionNumber}_down`,
            visible: !isQ4Visible.visible,
          });
          break;
        case 5:
          initialAllBox();
          setIsQ5Visible({
            ...isQ5Visible,
            arrow: isQ5Visible.visible ? 'arrow_down' : 'arrow_up',
            box: isQ5Visible.visible
              ? `box${questionNumber}_up`
              : `box${questionNumber}_down`,
            visible: !isQ5Visible.visible,
          });
          break;
        default:
          break;
      }
    },
    [isQ1Visible, isQ2Visible, isQ3Visible, isQ4Visible, isQ5Visible],
  );

  const draw = () => {
    const dpr = window.devicePixelRatio;
    const canvas: HTMLCanvasElement | null = canvasRef.current;

    if (!headerRef.current) return;
    const headerY = headerRef.current.offsetTop + 80;
    if (!canvas) return;
    canvas.width = document.body.clientWidth * dpr;
    canvas.height = document.body.clientHeight * dpr;
    const browserWidth = canvas.width / dpr + 40;
    const browserHeight = canvas.height / dpr;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;
    ctx.scale(dpr, dpr);
    if (mediaQuery === MediaQuery.Mobile) return;
    new DrawWave(ctx, browserWidth).drawOnPages(
      headerY,
      TokenColors.ELFI,
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

  useEffect(() => {
    function handleClickOutside(e: MouseEvent): void {
      if (FAQRef.current && !FAQRef.current.contains(e.target as Node)) {
        initialAllBox();
        scrollToOffeset(`FAQ01`, 478);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
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
      <main className="market__guide">
        <section className="market__guide__header" ref={headerRef}>
          <h1>{t('market.faq.header')}</h1>
          <p>{t('market.faq.content')}</p>
          <span>{t('market.faq.comment')}</span>
        </section>
        <article className="market__guide__content">
          <section className="faq__wrapper__section" ref={FAQRef}>
            <div className={`question_title_box ${isQ1Visible.box}`} id="FAQ01">
              <Suspense fallback={<Skeleton width={500} height={500} />}>
                <div onClick={() => onClickBox(1)}>
                  <h3>
                    <span>1.</span> {t('market.faq.title.0')}
                  </h3>
                  <div className={`arrow ${isQ1Visible.arrow}`}>
                    <div></div>
                    <div></div>
                  </div>
                </div>
                <p>{t('market.faq.answer.a1.0')}</p>
                <a
                  href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn"
                  target="_blank">
                  {t('market.faq.answer.a1.1')}
                  {' >'}
                </a>
                <LazyImage
                  src={i18n.language === 'ko' ? KoGuide1s00 : EnGuide1s00}
                  name="market__guide__image"
                />
                <p>{t('market.faq.answer.a1.2')}</p>
                <LazyImage
                  src={i18n.language === 'ko' ? KoGuide1s01 : EnGuide1s01}
                  name="market__guide__image"
                />
                <p>{t('market.faq.answer.a1.3')}</p>
                <span>{t('market.faq.answer.a1.4')}</span>
                <LazyImage
                  src={i18n.language === 'ko' ? KoGuide1s02 : EnGuide1s02}
                  name="market__guide__image"
                />
                <p>{t('market.faq.answer.a1.5')}</p>
                <LazyImage
                  src={i18n.language === 'ko' ? KoGuide1s03 : EnGuide1s03}
                  name="market__guide__image"
                />
                <p>{t('market.faq.answer.a1.6')}</p>
                <LazyImage
                  src={i18n.language === 'ko' ? KoGuide1s04 : EnGuide1s04}
                  name="market__guide__image"
                />
                <p>{t('market.faq.answer.a1.7')}</p>
                <LazyImage
                  src={i18n.language === 'ko' ? KoGuide1s05 : EnGuide1s05}
                  name="market__guide__image"
                />
                <p>{t('market.faq.answer.a1.8')}</p>
                <span>{t('market.faq.answer.a1.9')}</span>
                <LazyImage
                  src={i18n.language === 'ko' ? KoGuide1s06 : EnGuide1s06}
                  name="market__guide__image"
                />
                <p>{t('market.faq.answer.a1.10')}</p>
                <LazyImage
                  src={i18n.language === 'ko' ? KoGuide1s07 : EnGuide1s07}
                  name="market__guide__image"
                />
              </Suspense>
            </div>
            {i18n.language === 'ko' && (
              <div
                className={`question_title_box ${isQ2Visible.box}`}
                id="FAQ02">
                <Suspense fallback={<Skeleton width={500} height={500} />}>
                  <div onClick={() => onClickBox(2)}>
                    <h3>
                      <span>2.</span> {t('market.faq.title.1')}
                    </h3>
                    <div className={`arrow ${isQ2Visible.arrow}`}>
                      <div></div>
                      <div></div>
                    </div>
                  </div>
                  <p>{t('market.faq.answer.a2.0')}</p>
                  <LazyImage src={KoGuide2s00} name="market__guide__image" />
                  <p>{t('market.faq.answer.a2.1')}</p>
                  <span>
                    <Trans i18nKey={'market.faq.answer.a2.2'}>
                      text
                      <u>
                        <a
                          target="_blank"
                          href="https://upbitcs.zendesk.com/hc/ko/articles/4406595681817-%EA%B3%A0%EA%B0%9D%ED%99%95%EC%9D%B8%EC%A0%88%EC%B0%A8-%EC%95%8C%EC%95%84%EB%B3%B4%EA%B8%B0"
                          style={{ color: '#00bfff' }}>
                          link
                        </a>
                      </u>
                    </Trans>
                    <Trans i18nKey={'market.faq.answer.a2.3'}>
                      text
                      <u>
                        <a
                          target="_blank"
                          href="https://upbitcs.zendesk.com/hc/ko/articles/900006142766-%EC%B9%B4%EC%B9%B4%EC%98%A4%ED%8E%98%EC%9D%B4-%EC%9D%B8%EC%A6%9D%EC%9D%84-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B3%A0-%EC%8B%B6%EC%96%B4%EC%9A%94-"
                          style={{ color: '#00bfff' }}>
                          link
                        </a>
                      </u>
                      text
                    </Trans>
                  </span>
                  <LazyImage src={KoGuide2s01} name="market__guide__image" />
                  <p>{t('market.faq.answer.a2.4')}</p>
                  <LazyImage src={KoGuide2s02} name="market__guide__image" />

                  <p>{t('market.faq.answer.a2.5')}</p>
                  <span>{t('market.faq.answer.a2.6')}</span>
                  <LazyImage src={KoGuide2s03} name="market__guide__image" />

                  <p>{t('market.faq.answer.a2.7')}</p>
                  <LazyImage src={KoGuide2s04} name="market__guide__image" />

                  <p>{t('market.faq.answer.a2.8')}</p>
                  <LazyImage src={KoGuide2s05} name="market__guide__image" />
                  <p>{t('market.faq.answer.a2.9')}</p>
                  <LazyImage src={KoGuide2s06} name="market__guide__image" />
                  <br />
                  <p>{t('market.faq.answer.a2.10')}</p>
                </Suspense>
              </div>
            )}
            {i18n.language === 'ko' ? (
              <div
                className={`question_title_box ${isQ3Visible.box}`}
                id="FAQ03">
                <Suspense fallback={<Skeleton width={500} height={500} />}>
                  <div onClick={() => onClickBox(3)}>
                    <h3>
                      <span>3.</span> {t('market.faq.title.2')}
                    </h3>
                    <div className={`arrow ${isQ3Visible.arrow}`}>
                      <div></div>
                      <div></div>
                    </div>
                  </div>
                  <p>{t('market.faq.answer.a3.0')}</p>
                  <LazyImage src={KoGuide3s00} name="market__guide__image" />

                  <p>{t('market.faq.answer.a3.1')}</p>
                  <LazyImage src={KoGuide3s01} name="market__guide__image" />

                  <p>{t('market.faq.answer.a3.2')}</p>
                  <LazyImage src={KoGuide3s02} name="market__guide__image" />

                  <p>{t('market.faq.answer.a3.3')}</p>
                  <LazyImage src={KoGuide3s03} name="market__guide__image" />
                  <p>{t('market.faq.answer.a3.4')}</p>
                  <LazyImage src={KoGuide3s04} name="market__guide__image" />
                  <p>{t('market.faq.answer.a3.5')}</p>
                  <LazyImage src={KoGuide3s05} name="market__guide__image" />
                </Suspense>
              </div>
            ) : (
              <div
                className={`question_title_box ${isQ3Visible.box}`}
                id="FAQ03">
                <Suspense fallback={<Skeleton width={500} height={500} />}>
                  <div onClick={() => onClickBox(3)}>
                    <h3>
                      <span>2.</span> {t('market.faq.title.2')}
                    </h3>
                    <div className={`arrow ${isQ3Visible.arrow}`}>
                      <div></div>
                      <div></div>
                    </div>
                  </div>
                  <p>{t('market.faq.answer.a3.0')}</p>
                  <LazyImage src={EnGuide3s00} name="market__guide__image" />

                  <p>{t('market.faq.answer.a3.1')}</p>
                  <LazyImage src={EnGuide3s01} name="market__guide__image" />

                  <p>{t('market.faq.answer.a3.2')}</p>
                  <LazyImage src={EnGuide3s02} name="market__guide__image" />

                  <p>{t('market.faq.answer.a3.3')}</p>
                  <LazyImage src={EnGuide3s03} name="market__guide__image" />
                  <p>{t('market.faq.answer.a3.4')}</p>
                  <LazyImage src={EnGuide3s04} name="market__guide__image" />
                  <p>{t('market.faq.answer.a3.5')}</p>
                  <LazyImage src={EnGuide3s05} name="market__guide__image" />
                  <p>{t('market.faq.answer.a3.6')}</p>
                  <LazyImage src={EnGuide3s06} name="market__guide__image" />
                  <p>{t('market.faq.answer.a3.7')}</p>
                  <LazyImage src={EnGuide3s07} name="market__guide__image" />
                  <p>{t('market.faq.answer.a3.8')}</p>
                  <LazyImage src={EnGuide3s08} name="market__guide__image" />
                  <p>{t('market.faq.answer.a3.9')}</p>
                  <LazyImage src={EnGuide3s09} name="market__guide__image" />
                </Suspense>
              </div>
            )}

            <div className={`question_title_box ${isQ4Visible.box}`} id="FAQ04">
              <Suspense fallback={<Skeleton width={500} height={500} />}>
                <div onClick={() => onClickBox(4)}>
                  <h3>
                    <span>{i18n.language === 'ko' ? '4.' : '3.'}</span>{' '}
                    {t('market.faq.title.3')}
                  </h3>
                  <div className={`arrow ${isQ4Visible.arrow}`}>
                    <div></div>
                    <div></div>
                  </div>
                </div>
                <p>{t('market.faq.answer.a4.0')}</p>
                <LazyImage
                  src={i18n.language === 'ko' ? KoGuide4s00 : EnGuide4s00}
                  name="market__guide__image"
                />
                <p>{t('market.faq.answer.a4.1')}</p>
                <LazyImage
                  src={i18n.language === 'ko' ? KoGuide4s01 : EnGuide4s01}
                  name="market__guide__image"
                />

                <p>{t('market.faq.answer.a4.2')}</p>
                <LazyImage
                  src={i18n.language === 'ko' ? KoGuide4s02 : EnGuide4s02}
                  name="market__guide__image"
                />
                <p>{t('market.faq.answer.a4.3')}</p>
                <LazyImage
                  src={i18n.language === 'ko' ? KoGuide4s03 : EnGuide4s03}
                  name="market__guide__image"
                />
              </Suspense>
            </div>
            <div className={`question_title_box ${isQ5Visible.box}`} id="FAQ05">
              <Suspense fallback={<Skeleton width={500} height={500} />}>
                <div onClick={() => onClickBox(5)}>
                  <h3>
                    <span>{i18n.language === 'ko' ? '5.' : '4.'}</span>{' '}
                    {t('market.faq.title.4')}
                  </h3>
                  <div className={`arrow ${isQ5Visible.arrow}`}>
                    <div></div>
                    <div></div>
                  </div>
                </div>
                <p>{t('market.faq.answer.a5.0')}</p>
                <LazyImage
                  src={i18n.language === 'ko' ? KoGuide5s00 : EnGuide5s00}
                  name="market__guide__image"
                />
                <p>{t('market.faq.answer.a5.1')}</p>
                <LazyImage
                  src={i18n.language === 'ko' ? KoGuide5s01 : EnGuide5s01}
                  name="market__guide__image"
                />
                <p>{t('market.faq.answer.a5.2')}</p>
                <LazyImage
                  src={i18n.language === 'ko' ? KoGuide5s02 : EnGuide5s02}
                  name="market__guide__image"
                />
                <p>{t('market.faq.answer.a5.3')}</p>
                <span>{t('market.faq.answer.a5.4')}</span>
                <LazyImage
                  src={i18n.language === 'ko' ? KoGuide5s03 : EnGuide5s03}
                  name="market__guide__image"
                />
                <p>{t('market.faq.answer.a5.5')}</p>
                <span>{t('market.faq.answer.a5.6')}</span>
                <LazyImage
                  src={i18n.language === 'ko' ? KoGuide5s04 : EnGuide5s04}
                  name="market__guide__image"
                />

                <p>{t('market.faq.answer.a5.7')}</p>
                <LazyImage
                  src={i18n.language === 'ko' ? KoGuide5s05 : EnGuide5s05}
                  name="market__guide__image"
                />
              </Suspense>
            </div>
          </section>
        </article>
      </main>
    </>
  );
};

export default MarketFAQ;
