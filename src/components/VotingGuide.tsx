import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Guide1 from 'src/assets/images/guide/voting-01.png';
import Guide2 from 'src/assets/images/guide/voting-02.png';
import Guide3 from 'src/assets/images/guide/voting-03.png';

const VotingGuide = (): JSX.Element => {
  const { t } = useTranslation();
  const [clickedImage, setClickedImage] = useState(-1);

  return (
    <>
      <div className="guide__container">
        <h3>{t('guide.button.3')}</h3>
        <div className="guide__content">
          {[Guide1, Guide2, Guide3].map((image, index) => {
            return (
              <>
                <p className="guide__content__bold">
                  {t(`guide.content.section13.${index * 2}`)}
                </p>
                <p>{t(`guide.content.section13.${index * 2 + 1}`)}</p>
                <div
                  onClick={() => {
                    setClickedImage(index === clickedImage ? -1 : index);
                  }}
                  style={{
                    width: clickedImage === index ? 'calc(100% - 5%)' : 300,
                  }}
                  className={`guide__onclick${
                    clickedImage === index ? '--active' : ''
                  }`}>
                  <img className="guide__image" src={image} alt="Guide" />
                </div>
              </>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default VotingGuide;
