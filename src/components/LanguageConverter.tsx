import { useContext, useState, useEffect, useRef } from 'react';
import LanguageType from 'src/enums/LanguageType';
import LanguageContext from 'src/contexts/LanguageContext';
import ko from "src/assets/images/korea@2x.png";
import cn from "src/assets/images/china@2x.png";
import en from "src/assets/images/america@2x.png";

const languageData = {
  [LanguageType.KO]: {
    image: ko,
    title: "KOR"
  },
  [LanguageType.EN]: {
    image: en,
    title: "ENG"
  },
  [LanguageType.ZHHANS]: {
    image: cn,
    title: "CHA"
  },
}

export const LanguageConverter = () => {
  const { language, setLanguage } = useContext(LanguageContext);
  const [visible, setVisible] = useState(false);
  const selectedLanaugeData = languageData[language];
  const LangRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="lang" ref={LangRef}>
      <div className="lang__image-wrapper" style={{ display: visible ? "flex" : "none" }}>
        {
          [LanguageType.EN, LanguageType.KO, LanguageType.ZHHANS]
            .filter((languageType) => languageType !== language)
            .map((languageType, index) => {
              return (
                <img
                  key={index}
                  className="lang__select-image"
                  src={languageData[languageType].image}
                  alt={languageData[languageType].title}
                  onClick={() => {
                    setLanguage(languageType)
                    handleHover()
                  }}
                />
              )
            })
        }
      </div>
      <div className="lang__button-wrapper" onClick={() => handleHover()}>
        <img className="lang__select-image" src={selectedLanaugeData.image} alt={selectedLanaugeData.title} />
        <p className="lang__select-image__text">{selectedLanaugeData.title}</p>
      </div>
    </div>
  )
}

export default LanguageConverter;