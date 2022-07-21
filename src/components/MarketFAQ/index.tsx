import { useCallback, useEffect, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import MediaQuery from 'src/enums/MediaQuery';
import TokenColors from 'src/enums/TokenColors';
import useMediaQueryType from 'src/hooks/useMediaQueryType';
import DrawWave from 'src/utiles/drawWave';

import KoGuide00 from 'src/assets/images/market/guide/ko/guide00.png';
import KoGuide01 from 'src/assets/images/market/guide/ko/guide01.png';
import KoGuide02 from 'src/assets/images/market/guide/ko/guide02.png';
import KoGuide03 from 'src/assets/images/market/guide/ko/guide03.png';
import KoGuide04 from 'src/assets/images/market/guide/ko/guide04.png';
import KoGuide05 from 'src/assets/images/market/guide/ko/guide05.png';
import KoGuide06 from 'src/assets/images/market/guide/ko/guide06.png';
import KoGuide07 from 'src/assets/images/market/guide/ko/guide07.png';
import KoGuide08 from 'src/assets/images/market/guide/ko/guide08.png';
import KoGuide09 from 'src/assets/images/market/guide/ko/guide09.png';
import KoGuide10 from 'src/assets/images/market/guide/ko/guide10.png';
import KoGuide11 from 'src/assets/images/market/guide/ko/guide11.png';
import KoGuide12 from 'src/assets/images/market/guide/ko/guide12.png';
import KoGuide13 from 'src/assets/images/market/guide/ko/guide13.png';
import KoGuide14 from 'src/assets/images/market/guide/ko/guide14.png';
import KoGuide15 from 'src/assets/images/market/guide/ko/guide15.png';
import KoGuide16 from 'src/assets/images/market/guide/ko/guide16.png';
import KoGuide17 from 'src/assets/images/market/guide/ko/guide17.png';
import KoGuide18 from 'src/assets/images/market/guide/ko/guide18.png';
import KoGuide19 from 'src/assets/images/market/guide/ko/guide19.png';
import KoGuide20 from 'src/assets/images/market/guide/ko/guide20.png';
import KoGuide21 from 'src/assets/images/market/guide/ko/guide21.png';
import KoGuide22 from 'src/assets/images/market/guide/ko/guide22.png';

import EnGuide00 from 'src/assets/images/market/guide/en/guide00.png';
import EnGuide01 from 'src/assets/images/market/guide/en/guide01.png';
import EnGuide02 from 'src/assets/images/market/guide/en/guide02.png';
import EnGuide03 from 'src/assets/images/market/guide/en/guide03.png';
import EnGuide04 from 'src/assets/images/market/guide/en/guide04.png';
import EnGuide05 from 'src/assets/images/market/guide/en/guide05.png';
import EnGuide06 from 'src/assets/images/market/guide/en/guide06.png';
import EnGuide07 from 'src/assets/images/market/guide/en/guide07.png';
import EnGuide08 from 'src/assets/images/market/guide/en/guide08.png';
import EnGuide09 from 'src/assets/images/market/guide/en/guide09.png';
import EnGuide10 from 'src/assets/images/market/guide/en/guide10.png';
import EnGuide11 from 'src/assets/images/market/guide/en/guide11.png';
import EnGuide12 from 'src/assets/images/market/guide/en/guide12.png';
import EnGuide13 from 'src/assets/images/market/guide/en/guide13.png';
import EnGuide14 from 'src/assets/images/market/guide/en/guide14.png';
import EnGuide15 from 'src/assets/images/market/guide/en/guide15.png';
import EnGuide16 from 'src/assets/images/market/guide/en/guide16.png';
import EnGuide17 from 'src/assets/images/market/guide/en/guide17.png';
import EnGuide21 from 'src/assets/images/market/guide/en/guide21.png';
import EnGuide22 from 'src/assets/images/market/guide/en/guide22.png';

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

  const [isQ1Visible, setIsQ1Visible] = useState(questionBox);
  const [isQ2Visible, setIsQ2Visible] = useState(questionBox);
  const [isQ3Visible, setIsQ3Visible] = useState(questionBox);
  const [isQ4Visible, setIsQ4Visible] = useState(questionBox);
  const [isQ5Visible, setIsQ5Visible] = useState(questionBox);

  const onClickBox = useCallback(
    (questionNumber: number) => {
      switch (questionNumber) {
        case 1:
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
          <section className="faq__wrapper__section">
            <div className={`question_title_box ${isQ1Visible.box}`}>
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
              <img
                src={i18n.language === 'ko' ? KoGuide00 : EnGuide00}
                alt="Guide image"
                className="market__guide__image"
              />
              <p>{t('market.faq.answer.a1.2')}</p>
              <img
                src={i18n.language === 'ko' ? KoGuide01 : EnGuide01}
                alt="Guide image"
                className="market__guide__image"
              />
              <p>{t('market.faq.answer.a1.3')}</p>
              <span>{t('market.faq.answer.a1.4')}</span>
              <img
                src={i18n.language === 'ko' ? KoGuide02 : EnGuide02}
                alt="Guide image"
                className="market__guide__image"
              />
              <p>{t('market.faq.answer.a1.5')}</p>
              <img
                src={i18n.language === 'ko' ? KoGuide03 : EnGuide03}
                alt="Guide image"
                className="market__guide__image"
              />
              <p>{t('market.faq.answer.a1.6')}</p>
              <img
                src={i18n.language === 'ko' ? KoGuide04 : EnGuide04}
                alt="Guide image"
                className="market__guide__image"
              />
              <p>{t('market.faq.answer.a1.7')}</p>
              <img
                src={i18n.language === 'ko' ? KoGuide05 : EnGuide05}
                alt="Guide image"
                className="market__guide__image"
              />
              <p>{t('market.faq.answer.a1.8')}</p>
              <span>{t('market.faq.answer.a1.9')}</span>
              <img
                src={i18n.language === 'ko' ? KoGuide06 : EnGuide06}
                alt="Guide image"
                className="market__guide__image"
              />
              <p>{t('market.faq.answer.a1.10')}</p>
              <img
                src={i18n.language === 'ko' ? KoGuide07 : EnGuide07}
                alt="Guide image"
                className="market__guide__image"
              />
            </div>
            {i18n.language === 'ko' && (
              <div className={`question_title_box ${isQ2Visible.box}`}>
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
                <img
                  src={KoGuide08}
                  alt="Guide image"
                  className="market__guide__image"
                />
                <p>{t('market.faq.answer.a2.1')}</p>
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
                <img
                  src={KoGuide09}
                  alt="Guide image"
                  className="market__guide__image"
                />
                <p>{t('market.faq.answer.a2.4')}</p>
                <img
                  src={KoGuide10}
                  alt="Guide image"
                  className="market__guide__image"
                />

                <p>{t('market.faq.answer.a2.5')}</p>
                <span>{t('market.faq.answer.a2.6')}</span>
                <img
                  src={KoGuide11}
                  alt="Guide image"
                  className="market__guide__image"
                />

                <p>{t('market.faq.answer.a2.7')}</p>
                <img
                  src={KoGuide12}
                  alt="Guide image"
                  className="market__guide__image"
                />

                <p>{t('market.faq.answer.a2.8')}</p>
                <img
                  src={KoGuide13}
                  alt="Guide image"
                  className="market__guide__image"
                />
                <p>{t('market.faq.answer.a2.9')}</p>
                <img
                  src={KoGuide14}
                  alt="Guide image"
                  className="market__guide__image"
                />
                <br />
                <p>{t('market.faq.answer.a2.10')}</p>
              </div>
            )}
            {i18n.language === 'ko' ? (
              <div className={`question_title_box ${isQ3Visible.box}`}>
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
                <img
                  src={KoGuide15}
                  alt="Guide image"
                  className="market__guide__image"
                />

                <p>{t('market.faq.answer.a3.1')}</p>
                <img
                  src={KoGuide16}
                  alt="Guide image"
                  className="market__guide__image"
                />

                <p>{t('market.faq.answer.a3.2')}</p>
                <img
                  src={KoGuide17}
                  alt="Guide image"
                  className="market__guide__image"
                />

                <p>{t('market.faq.answer.a3.3')}</p>
                <img
                  src={KoGuide18}
                  alt="Guide image"
                  className="market__guide__image"
                />
                <p>{t('market.faq.answer.a3.4')}</p>
                <img
                  src={KoGuide19}
                  alt="Guide image"
                  className="market__guide__image"
                />
                <p>{t('market.faq.answer.a3.5')}</p>
                <img
                  src={KoGuide20}
                  alt="Guide image"
                  className="market__guide__image"
                />
              </div>
            ) : (
              <div className={`question_title_box ${isQ3Visible.box}`}>
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
                <img
                  src={EnGuide08}
                  alt="Guide image"
                  className="market__guide__image"
                />

                <p>{t('market.faq.answer.a3.1')}</p>
                <img
                  src={EnGuide09}
                  alt="Guide image"
                  className="market__guide__image"
                />

                <p>{t('market.faq.answer.a3.2')}</p>
                <img
                  src={EnGuide10}
                  alt="Guide image"
                  className="market__guide__image"
                />

                <p>{t('market.faq.answer.a3.3')}</p>
                <img
                  src={EnGuide11}
                  alt="Guide image"
                  className="market__guide__image"
                />
                <p>{t('market.faq.answer.a3.4')}</p>
                <img
                  src={EnGuide12}
                  alt="Guide image"
                  className="market__guide__image"
                />
                <p>{t('market.faq.answer.a3.5')}</p>
                <img
                  src={EnGuide13}
                  alt="Guide image"
                  className="market__guide__image"
                />
                <p>{t('market.faq.answer.a3.6')}</p>
                <img
                  src={EnGuide14}
                  alt="Guide image"
                  className="market__guide__image"
                />
                <p>{t('market.faq.answer.a3.7')}</p>
                <img
                  src={EnGuide15}
                  alt="Guide image"
                  className="market__guide__image"
                />
                <p>{t('market.faq.answer.a3.8')}</p>
                <img
                  src={EnGuide16}
                  alt="Guide image"
                  className="market__guide__image"
                />
                <p>{t('market.faq.answer.a3.9')}</p>
                <img
                  src={EnGuide17}
                  alt="Guide image"
                  className="market__guide__image"
                />
              </div>
            )}

            <div className={`question_title_box ${isQ4Visible.box}`}>
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
              <img
                src={undefined}
                alt="Guide image"
                className="market__guide__image"
              />
              <p>{t('market.faq.answer.a4.1')}</p>
              <img
                src={i18n.language === 'ko' ? KoGuide21 : EnGuide21}
                alt="Guide image"
                className="market__guide__image"
              />

              <p>{t('market.faq.answer.a4.2')}</p>
              <p>{t('market.faq.answer.a4.3')}</p>
              <img
                src={undefined}
                alt="Guide image"
                className="market__guide__image"
              />
            </div>
            <div className={`question_title_box ${isQ5Visible.box}`}>
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
              <img
                src={undefined}
                alt="Guide image"
                className="market__guide__image"
              />
              <p>{t('market.faq.answer.a5.1')}</p>
              <img
                src={undefined}
                alt="Guide image"
                className="market__guide__image"
              />
              <p>{t('market.faq.answer.a5.2')}</p>
              <span>{t('market.faq.answer.a5.3')}</span>
              <img
                src={undefined}
                alt="Guide image"
                className="market__guide__image"
              />
              <p>{t('market.faq.answer.a5.4')}</p>
              <span>{t('market.faq.answer.a5.5')}</span>
              <img
                src={undefined}
                alt="Guide image"
                className="market__guide__image"
              />

              <p>{t('market.faq.answer.a5.6')}</p>
              <img
                src={undefined}
                alt="Guide image"
                className="market__guide__image"
              />
            </div>
          </section>
        </article>
      </main>
    </>
  );
};

export default MarketFAQ;
