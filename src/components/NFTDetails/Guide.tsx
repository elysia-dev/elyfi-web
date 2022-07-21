import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import MediaQuery from 'src/enums/MediaQuery';
import useMediaQueryType from 'src/hooks/useMediaQueryType';

const questionBox = {
  arrow: '',
  box: '',
  visible: false,
};

const Guide = (): JSX.Element => {
  const { t, i18n } = useTranslation();
  const { value: mediaQuery } = useMediaQueryType();

  const [isQ1Visible, setIsQ1Visible] = useState(questionBox);
  const [isQ2Visible, setIsQ2Visible] = useState(questionBox);
  const [isQ3Visible, setIsQ3Visible] = useState(questionBox);
  const [isQ4Visible, setIsQ4Visible] = useState(questionBox);

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
        default:
          break;
      }
    },
    [isQ1Visible, isQ2Visible, isQ3Visible, isQ4Visible],
  );

  return (
    <section className="nft-details__faq__content">
      <div
        className={`question_title_box ${isQ1Visible.box}`}
        style={{
          maxHeight:
            mediaQuery === MediaQuery.PC
              ? isQ1Visible.visible
                ? '300px'
                : '70px'
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
        className={`question_title_box ${isQ2Visible.box}`}
        style={{
          maxHeight:
            mediaQuery === MediaQuery.PC
              ? isQ2Visible.visible
                ? '300px'
                : '70px'
              : isQ2Visible.visible
              ? '450px'
              : '42px',
        }}>
        <div onClick={() => onClickBox(2)}>
          <h3>
            <span>Q</span> {t('nftMarket.guideData.title.1')}
          </h3>
          <div className={`arrow ${isQ2Visible.arrow}`}>
            <div></div>
            <div></div>
          </div>
        </div>
        <p>{t('nftMarket.guideData.answer.1')}</p>
      </div>
      <div
        className={`question_title_box ${isQ3Visible.box}`}
        style={{
          maxHeight:
            mediaQuery === MediaQuery.PC
              ? isQ3Visible.visible
                ? '300px'
                : '70px'
              : isQ3Visible.visible
              ? '450px'
              : '42px',
        }}>
        <div onClick={() => onClickBox(3)}>
          <h3>
            <span>Q</span> {t('nftMarket.guideData.title.2')}
          </h3>
          <div className={`arrow ${isQ3Visible.arrow}`}>
            <div></div>
            <div></div>
          </div>
        </div>

        <p>{t('nftMarket.guideData.answer.2')}</p>
      </div>
      <div
        className={`question_title_box ${isQ4Visible.box}`}
        style={{
          maxHeight:
            mediaQuery === MediaQuery.PC
              ? isQ4Visible.visible
                ? '300px'
                : '70px'
              : isQ4Visible.visible
              ? '450px'
              : '42px',
        }}>
        <div onClick={() => onClickBox(4)}>
          <h3>
            <span>Q</span> {t('nftMarket.guideData.title.3')}
          </h3>
          <div className={`arrow ${isQ4Visible.arrow}`}>
            <div></div>
            <div></div>
          </div>
        </div>

        <p>{t('nftMarket.guideData.answer.3')}</p>
      </div>
    </section>
  );
};

export default Guide;
