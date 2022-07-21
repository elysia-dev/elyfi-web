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
enum Questions {
  MoneyPool,
  Markets,
}

const Faq = (): JSX.Element => {
  const { t, i18n } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const { value: mediaQuery } = useMediaQueryType();
  const [questionSelect, setQuestion] = useState<Questions>(Questions.Markets);
  const [isQ1Visible, setIsQ1Visible] = useState(questionBox);
  const [isQ2Visible, setIsQ2Visible] = useState(questionBox);
  const [isQ3Visible, setIsQ3Visible] = useState(questionBox);
  const [isQ4Visible, setIsQ4Visible] = useState(questionBox);
  const [isQ5Visible, setIsQ5Visible] = useState(questionBox);
  const [isQ6Visible, setIsQ6Visible] = useState(questionBox);
  const [isQ7Visible, setIsQ7Visible] = useState(questionBox);
  const [isQ8Visible, setIsQ8Visible] = useState(questionBox);
  const [isQ9Visible, setIsQ9Visible] = useState(questionBox);
  const [isQ10Visible, setIsQ10Visible] = useState(questionBox);
  const [isQ11Visible, setIsQ11Visible] = useState(questionBox);
  const [isQ12Visible, setIsQ12Visible] = useState(questionBox);
  const [isQ13Visible, setIsQ13Visible] = useState(questionBox);
  const [isQ14Visible, setIsQ14Visible] = useState(questionBox);

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
        case 8:
          setIsQ8Visible({
            ...isQ8Visible,
            arrow: isQ8Visible.visible ? 'arrow_down' : 'arrow_up',
            box: isQ8Visible.visible
              ? `box${questionNumber}_up`
              : `box${questionNumber}_down`,
            visible: !isQ8Visible.visible,
          });
          break;
        case 9:
          setIsQ9Visible({
            ...isQ9Visible,
            arrow: isQ9Visible.visible ? 'arrow_down' : 'arrow_up',
            box: isQ9Visible.visible
              ? `box${questionNumber}_up`
              : `box${questionNumber}_down`,
            visible: !isQ9Visible.visible,
          });
          break;
        case 10:
          setIsQ10Visible({
            ...isQ10Visible,
            arrow: isQ10Visible.visible ? 'arrow_down' : 'arrow_up',
            box: isQ10Visible.visible
              ? `box${questionNumber}_up`
              : `box${questionNumber}_down`,
            visible: !isQ10Visible.visible,
          });
          break;
        case 11:
          setIsQ11Visible({
            ...isQ11Visible,
            arrow: isQ11Visible.visible ? 'arrow_down' : 'arrow_up',
            box: isQ11Visible.visible
              ? `box${questionNumber}_up`
              : `box${questionNumber}_down`,
            visible: !isQ11Visible.visible,
          });
          break;
        case 12:
          setIsQ12Visible({
            ...isQ12Visible,
            arrow: isQ12Visible.visible ? 'arrow_down' : 'arrow_up',
            box: isQ12Visible.visible
              ? `box${questionNumber}_up`
              : `box${questionNumber}_down`,
            visible: !isQ12Visible.visible,
          });
          break;
        case 13:
          setIsQ13Visible({
            ...isQ13Visible,
            arrow: isQ13Visible.visible ? 'arrow_down' : 'arrow_up',
            box: isQ13Visible.visible
              ? `box${questionNumber}_up`
              : `box${questionNumber}_down`,
            visible: !isQ13Visible.visible,
          });
          break;
        case 14:
          setIsQ14Visible({
            ...isQ14Visible,
            arrow: isQ14Visible.visible ? 'arrow_down' : 'arrow_up',
            box: isQ14Visible.visible
              ? `box${questionNumber}_up`
              : `box${questionNumber}_down`,
            visible: !isQ14Visible.visible,
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
            <h1 ref={headerRef}>{t('nftMarket.question.0')}</h1>
          </header>
          <article className="faq__switch">
            <button
              className={
                questionSelect === Questions.MoneyPool ? 'disable' : ''
              }
              onClick={() => setQuestion(Questions.MoneyPool)}>
              {t('nftMarket.question.1')}
            </button>
            <button
              className={questionSelect === Questions.Markets ? 'disable' : ''}
              onClick={() => setQuestion(Questions.Markets)}>
              {t('nftMarket.question.2')}
            </button>
          </article>
          {questionSelect === Questions.Markets ? (
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
          ) : (
            <section className="faq__wrapper__section">
              <div
                className={`question_title_box`}
                style={{
                  maxHeight:
                    mediaQuery === MediaQuery.PC
                      ? isQ1Visible.visible
                        ? '400px'
                        : '86px'
                      : isQ1Visible.visible
                      ? '450px'
                      : '42px',
                }}>
                <div onClick={() => onClickBox(1)}>
                  <h3>
                    <span>Q</span> {t('nftMarket.guideData.title.0')}
                  </h3>
                  <div className={`arrow ${isQ1Visible.arrow}`}>
                    <div></div>
                    <div></div>
                  </div>
                </div>
                <p>{t('nftMarket.guideData.answer.0')}</p>
              </div>
              <div
                className={`question_title_box`}
                style={{
                  maxHeight:
                    mediaQuery === MediaQuery.PC
                      ? isQ2Visible.visible
                        ? '400px'
                        : '86px'
                      : isQ2Visible.visible
                      ? '450px'
                      : '42px',
                }}>
                <div onClick={() => onClickBox(2)}>
                  <h3>
                    <span>Q</span> {t('nftMarket.guideData.title.2')}
                  </h3>
                  <div className={`arrow ${isQ2Visible.arrow}`}>
                    <div></div>
                    <div></div>
                  </div>
                </div>
                <p>{t('nftMarket.guideData.answer.2')}</p>
              </div>

              <div
                className={`question_title_box `}
                style={{
                  maxHeight:
                    mediaQuery === MediaQuery.PC
                      ? isQ3Visible.visible
                        ? '400px'
                        : '86px'
                      : isQ3Visible.visible
                      ? '450px'
                      : '42px',
                }}>
                <div onClick={() => onClickBox(3)}>
                  <h3>
                    <span>Q</span> {t('nftMarket.guideData.title.3')}
                  </h3>
                  <div className={`arrow ${isQ3Visible.arrow}`}>
                    <div></div>
                    <div></div>
                  </div>
                </div>
                <p>{t('nftMarket.guideData.answer.3')}</p>
              </div>
              <div
                className={`question_title_box`}
                style={{
                  maxHeight:
                    mediaQuery === MediaQuery.PC
                      ? isQ4Visible.visible
                        ? '400px'
                        : '86px'
                      : isQ4Visible.visible
                      ? '450px'
                      : '42px',
                }}>
                <div onClick={() => onClickBox(4)}>
                  <h3>
                    <span>Q</span> {t('nftMarket.guideData.title.4')}
                  </h3>
                  <div className={`arrow ${isQ4Visible.arrow}`}>
                    <div></div>
                    <div></div>
                  </div>
                </div>
                <p>{t('nftMarket.guideData.answer.4')}</p>
              </div>
              <div
                className={`question_title_box `}
                style={{
                  maxHeight:
                    mediaQuery === MediaQuery.PC
                      ? isQ5Visible.visible
                        ? '400px'
                        : '86px'
                      : isQ5Visible.visible
                      ? '450px'
                      : '42px',
                }}>
                <div onClick={() => onClickBox(5)}>
                  <h3>
                    <span>Q</span> {t('nftMarket.guideData.title.5')}
                  </h3>
                  <div className={`arrow ${isQ5Visible.arrow}`}>
                    <div></div>
                    <div></div>
                  </div>
                </div>
                <p>{t('nftMarket.guideData.answer.5')}</p>
              </div>
              <div
                className={`question_title_box`}
                style={{
                  maxHeight:
                    mediaQuery === MediaQuery.PC
                      ? isQ6Visible.visible
                        ? '400px'
                        : '86px'
                      : isQ6Visible.visible
                      ? '450px'
                      : '42px',
                }}>
                <div onClick={() => onClickBox(6)}>
                  <h3>
                    <span>Q</span> {t('nftMarket.guideData.title.6')}
                  </h3>
                  <div className={`arrow ${isQ6Visible.arrow}`}>
                    <div></div>
                    <div></div>
                  </div>
                </div>
                <p>{t('nftMarket.guideData.answer.6')}</p>
              </div>
              <div
                className={`question_title_box `}
                style={{
                  maxHeight:
                    mediaQuery === MediaQuery.PC
                      ? isQ7Visible.visible
                        ? '400px'
                        : '86px'
                      : isQ7Visible.visible
                      ? '450px'
                      : '42px',
                }}>
                <div onClick={() => onClickBox(7)}>
                  <h3>
                    <span>Q</span> {t('nftMarket.guideData.title.7')}
                  </h3>
                  <div className={`arrow ${isQ7Visible.arrow}`}>
                    <div></div>
                    <div></div>
                  </div>
                </div>
                <p>{t('nftMarket.guideData.answer.7')}</p>
              </div>
              <div
                className={`question_title_box`}
                style={{
                  maxHeight:
                    mediaQuery === MediaQuery.PC
                      ? isQ8Visible.visible
                        ? '400px'
                        : '86px'
                      : isQ8Visible.visible
                      ? '450px'
                      : '42px',
                }}>
                <div onClick={() => onClickBox(8)}>
                  <h3>
                    <span>Q</span> {t('nftMarket.guideData.title.8')}
                  </h3>
                  <div className={`arrow ${isQ8Visible.arrow}`}>
                    <div></div>
                    <div></div>
                  </div>
                </div>
                <p>{t('nftMarket.guideData.answer.8')}</p>
              </div>
              <div
                className={`question_title_box `}
                style={{
                  maxHeight:
                    mediaQuery === MediaQuery.PC
                      ? isQ9Visible.visible
                        ? '400px'
                        : '86px'
                      : isQ9Visible.visible
                      ? '450px'
                      : '42px',
                }}>
                <div onClick={() => onClickBox(9)}>
                  <h3>
                    <span>Q</span> {t('nftMarket.guideData.title.9')}
                  </h3>
                  <div className={`arrow ${isQ9Visible.arrow}`}>
                    <div></div>
                    <div></div>
                  </div>
                </div>
                <p>{t('nftMarket.guideData.answer.9')}</p>
              </div>
              <div
                className={`question_title_box`}
                style={{
                  maxHeight:
                    mediaQuery === MediaQuery.PC
                      ? isQ10Visible.visible
                        ? '400px'
                        : '86px'
                      : isQ10Visible.visible
                      ? '450px'
                      : '42px',
                }}>
                <div onClick={() => onClickBox(10)}>
                  <h3>
                    <span>Q</span> {t('nftMarket.guideData.title.10')}
                  </h3>
                  <div className={`arrow ${isQ10Visible.arrow}`}>
                    <div></div>
                    <div></div>
                  </div>
                </div>
                <p>{t('nftMarket.guideData.answer.10')}</p>
              </div>
              <div
                className={`question_title_box`}
                style={{
                  maxHeight:
                    mediaQuery === MediaQuery.PC
                      ? isQ11Visible.visible
                        ? '400px'
                        : '86px'
                      : isQ11Visible.visible
                      ? '450px'
                      : '42px',
                }}>
                <div onClick={() => onClickBox(11)}>
                  <h3>
                    <span>Q</span> {t('nftMarket.guideData.title.11')}
                  </h3>
                  <div className={`arrow ${isQ11Visible.arrow}`}>
                    <div></div>
                    <div></div>
                  </div>
                </div>
                <p>{t('nftMarket.guideData.answer.11')}</p>
              </div>
              <div
                className={`question_title_box `}
                style={{
                  maxHeight:
                    mediaQuery === MediaQuery.PC
                      ? isQ12Visible.visible
                        ? '400px'
                        : '86px'
                      : isQ12Visible.visible
                      ? '450px'
                      : '42px',
                }}>
                <div onClick={() => onClickBox(12)}>
                  <h3>
                    <span>Q</span> {t('nftMarket.guideData.title.12')}
                  </h3>
                  <div className={`arrow ${isQ12Visible.arrow}`}>
                    <div></div>
                    <div></div>
                  </div>
                </div>
                <p>{t('nftMarket.guideData.answer.12')}</p>
              </div>
              <div
                className={`question_title_box `}
                style={{
                  maxHeight:
                    mediaQuery === MediaQuery.PC
                      ? isQ13Visible.visible
                        ? '400px'
                        : '86px'
                      : isQ13Visible.visible
                      ? '450px'
                      : '42px',
                }}>
                <div onClick={() => onClickBox(13)}>
                  <h3>
                    <span>Q</span> {t('nftMarket.guideData.title.13')}
                  </h3>
                  <div className={`arrow ${isQ13Visible.arrow}`}>
                    <div></div>
                    <div></div>
                  </div>
                </div>
                <p>{t('nftMarket.guideData.answer.13')}</p>
              </div>
              <div
                className={`question_title_box `}
                style={{
                  maxHeight:
                    mediaQuery === MediaQuery.PC
                      ? isQ14Visible.visible
                        ? '400px'
                        : '86px'
                      : isQ14Visible.visible
                      ? '450px'
                      : '42px',
                }}>
                <div onClick={() => onClickBox(14)}>
                  <h3>
                    <span>Q</span> {t('nftMarket.guideData.title.14')}
                  </h3>
                  <div className={`arrow ${isQ14Visible.arrow}`}>
                    <div></div>
                    <div></div>
                  </div>
                </div>
                <p>{t('nftMarket.guideData.answer.14')}</p>
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
};

export default Faq;
