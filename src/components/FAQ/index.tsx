import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import MediaQuery from 'src/enums/MediaQuery';
import TokenColors from 'src/enums/TokenColors';
import useMediaQueryType from 'src/hooks/useMediaQueryType';
import DrawWave from 'src/utiles/drawWave';

const questionBox = {
  arrow: '',
  box: '',
  visible: false,
};

const Faq = (): JSX.Element => {
  const { t, i18n } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const { value: mediaQuery } = useMediaQueryType();
  const [isQ1Visible, setIsQ1Visible] = useState(questionBox);
  const [isQ2Visible, setIsQ2Visible] = useState(questionBox);
  const [isQ3Visible, setIsQ3Visible] = useState(questionBox);
  const [isQ4Visible, setIsQ4Visible] = useState(questionBox);
  const [isQ5Visible, setIsQ5Visible] = useState(questionBox);
  const [isQ6Visible, setIsQ6Visible] = useState(questionBox);
  const [isQ7Visible, setIsQ7Visible] = useState(questionBox);

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
        case 6:
          setIsQ6Visible({
            ...isQ6Visible,
            arrow: isQ6Visible.visible ? 'arrow_down' : 'arrow_up',
            box: isQ6Visible.visible
              ? `box${questionNumber}_up`
              : `box${questionNumber}_down`,
            visible: !isQ6Visible.visible,
          });
          break;
        case 7:
          setIsQ7Visible({
            ...isQ7Visible,
            arrow: isQ7Visible.visible ? 'arrow_down' : 'arrow_up',
            box: isQ7Visible.visible
              ? `box${questionNumber}_up`
              : `box${questionNumber}_down`,
            visible: !isQ7Visible.visible,
          });
          break;
        default:
          break;
      }
    },
    [
      isQ1Visible,
      isQ2Visible,
      isQ3Visible,
      isQ4Visible,
      isQ5Visible,
      isQ6Visible,
      isQ7Visible,
    ],
  );

  const draw = () => {
    const dpr = window.devicePixelRatio;
    const canvas: HTMLCanvasElement | null = canvasRef.current;

    if (!headerRef.current) return;
    const headerY = headerRef.current.offsetTop - 20;
    if (!canvas) return;
    canvas.width = document.body.clientWidth * dpr;
    canvas.height = document.body.clientHeight * dpr;
    const browserWidth = canvas.width / dpr + 40;
    const browserHeight = canvas.height / dpr + 300;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;
    ctx.scale(dpr, dpr);
    if (mediaQuery === MediaQuery.Mobile) return;
    new DrawWave(ctx, browserWidth).drawOnPages(
      headerY,
      TokenColors.ELFI,
      browserHeight,
      false,
    );
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      draw();
    }, 200);

    return () => {
      clearTimeout(timeout);
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
      <div className="faq">
        <div className="faq__wrapper">
          <header className="faq__wrapper__header">
            <h1 ref={headerRef}>Frequently Asked Questions</h1>
          </header>
          <section className="faq__wrapper__section">
            <div className={`question_title_box ${isQ1Visible.box}`}>
              <div onClick={() => onClickBox(1)}>
                <h3>
                  <span>Q</span> {t('faq.question_first.0')}
                </h3>
                <div className={`arrow ${isQ1Visible.arrow}`}>
                  <div></div>
                  <div></div>
                </div>
              </div>
              <p>{t('faq.question_first.1')}</p>
              <div>
                <div>{t('faq.question_first.2')}</div>
                <div>
                  <div>{t('faq.question_first.3')}</div>
                  <p>{t('faq.question_first.4')}</p>
                </div>
                <div>
                  <div>{t('faq.question_first.5')}</div>
                  <p>{t('faq.question_first.6')}</p>
                </div>
                <div>
                  <div>{t('faq.question_first.7')}</div>
                  <p>{t('faq.question_first.8')}</p>
                </div>
              </div>
            </div>
            <div className={`question_title_box ${isQ2Visible.box}`}>
              <div onClick={() => onClickBox(2)}>
                <h3>
                  <span>Q</span> {t('faq.question_second.0')}
                </h3>
                <div className={`arrow ${isQ2Visible.arrow}`}>
                  <div></div>
                  <div></div>
                </div>
              </div>
              <p>{t('faq.question_second.1')}</p>
              <p>{t('faq.question_second.2')}</p>
            </div>
            <div className={`question_title_box ${isQ3Visible.box}`}>
              <div onClick={() => onClickBox(3)}>
                <h3>
                  <span>Q</span> {t('faq.question_third.0')}
                </h3>
                <div className={`arrow ${isQ3Visible.arrow}`}>
                  <div></div>
                  <div></div>
                </div>
              </div>
              <p>{t('faq.question_third.1')}</p>
              <p>{t('faq.question_third.2')}</p>
              {i18n.language === 'en' ? (
                <p>
                  {t('faq.question_third.3')}
                  <a>{t('faq.question_third.4')}</a>
                </p>
              ) : (
                <p>
                  {t('faq.question_third.3')}
                  <a>{t('faq.question_third.4')}</a>
                  {t('faq.question_third.5')}
                </p>
              )}
            </div>
            <div className={`question_title_box ${isQ4Visible.box}`}>
              <div onClick={() => onClickBox(4)}>
                <h3>
                  <span>Q</span> {t('faq.question_fourth.0')}
                </h3>
                <div className={`arrow ${isQ4Visible.arrow}`}>
                  <div></div>
                  <div></div>
                </div>
              </div>
              {i18n.language === 'en' ? (
                <>
                  <p>
                    <span>{t('faq.question_fourth.1')}</span>
                    <br />
                    {t('faq.question_fourth.2')}
                    <a>{t('faq.question_fourth.3')}</a>
                  </p>
                  <p>
                    <span>{t('faq.question_fourth.4')}</span>
                    <br />
                    {t('faq.question_fourth.5')}
                    <p>{t('faq.question_fourth.6')}</p>
                  </p>
                </>
              ) : (
                <>
                  <p>
                    <span>{t('faq.question_fourth.1')}</span>
                    <br />
                    {t('faq.question_fourth.2')}
                    <a>{t('faq.question_fourth.3')}</a>
                    {t('faq.question_fourth.4')}
                  </p>
                  <p>
                    <span>{t('faq.question_fourth.5')}</span>
                    <br />
                    {t('faq.question_fourth.6')}
                    <p>{t('faq.question_fourth.7')}</p>
                  </p>
                </>
              )}
            </div>
            <div className={`question_title_box ${isQ5Visible.box}`}>
              <div onClick={() => onClickBox(5)}>
                <h3>
                  <span>Q</span> {t('faq.question_fifth.0')}
                </h3>
                <div className={`arrow ${isQ5Visible.arrow}`}>
                  <div></div>
                  <div></div>
                </div>
              </div>
              <p>{t('faq.question_fifth.1')}</p>
            </div>
            <div className={`question_title_box ${isQ6Visible.box}`}>
              <div onClick={() => onClickBox(6)}>
                <h3>
                  <span>Q</span> {t('faq.question_sixth.0')}
                </h3>
                <div className={`arrow ${isQ6Visible.arrow}`}>
                  <div></div>
                  <div></div>
                </div>
              </div>
              <p>{t('faq.question_sixth.1')}</p>
            </div>
            <div className={`question_title_box ${isQ7Visible.box}`}>
              <div onClick={() => onClickBox(7)}>
                <h3>
                  <span>Q</span> {t('faq.question_seventh.0')}
                </h3>
                <div className={`arrow ${isQ7Visible.arrow}`}>
                  <div></div>
                  <div></div>
                </div>
              </div>
              <p>{t('faq.question_seventh.1')}</p>
              <p>
                <span>{t('faq.question_seventh.2')}</span>
                <br />
                {t('faq.question_seventh.3')}
              </p>
              <p>
                <span>{t('faq.question_seventh.4')}</span>
                <br />
                {t('faq.question_seventh.5')}
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Faq;
