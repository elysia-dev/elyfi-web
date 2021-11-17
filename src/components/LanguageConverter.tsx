import { useContext, useState, useEffect, useRef } from 'react';
import LanguageType from 'src/enums/LanguageType';
import LanguageContext from 'src/contexts/LanguageContext';
import ko from 'src/assets/images/korea@2x.png';
import cn from 'src/assets/images/china@2x.png';
import en from 'src/assets/images/america@2x.png';
import { useParams } from 'react-router-dom';

const languageData = {
  [LanguageType.KO]: {
    image: ko,
    title: '한국어',
  },
  [LanguageType.EN]: {
    image: en,
    title: 'English',
  },
  [LanguageType.ZHHANS]: {
    image: cn,
    title: '中文',
  },
};

export const LanguageConverter = () => {
  const { setLanguage } = useContext(LanguageContext);
  const [visible, setVisible] = useState(false);
  const LangRef = useRef<HTMLDivElement>(null);
  const { lng } = useParams<{ lng: string }>();

  const handleHover = () => {
    setVisible(!visible);
  };
  const handleOut = () => {
    setVisible(false);
  };

  const HandleClickOutside = (ref: any) => {
    useEffect(() => {
      function HandleClickOutside(e: any): void {
        if (ref.current && !ref.current.contains(e.target as Node)) {
          handleOut();
        }
      }
      document.addEventListener('mousedown', HandleClickOutside);
      return () => {
        document.removeEventListener('mousedown', HandleClickOutside);
      };
    }, [ref]);
  };

  HandleClickOutside(LangRef);

  const changeLanguage = () => {
    return (
      <div
        className="lang__image-wrapper"
        style={{ display: visible ? 'flex' : 'none' }}
      >
        {[LanguageType.EN, LanguageType.KO, LanguageType.ZHHANS]
          .filter((languageType) => languageType !== lng)
          .map((languageType, index) => {
            return (
              <div
                className="lang__select-image__wrapper"
                key={index}
                onClick={() => {
                  setLanguage(languageType);
                  handleHover();
                }}
              >
                <img
                  className="lang__select-image"
                  src={languageData[languageType].image}
                  alt={languageData[languageType].title}
                />
                <p>{languageData[languageType].title}</p>
              </div>
            );
          })}
      </div>
    )
  }

  const showingLanguageIcon = (languageType: LanguageType) => {
    return (
      <>
        <img className="lang__select-image" src={languageData[languageType].image} />
        <p
          className="lang__select-image__text"
          style={{ cursor: 'pointer' }}
        >
          {languageData[languageType].title}
        </p>
      </>
    )
  }

  return (
    <div className="lang" ref={LangRef}>
      {changeLanguage()}
      <div className="lang__button-wrapper" onClick={() => handleHover()}>
        {showingLanguageIcon(lng as LanguageType)}
      </div>
    </div>
  );
};

export default LanguageConverter;
