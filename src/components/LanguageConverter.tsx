import { useContext, useState, useEffect, useRef } from 'react';
import LanguageType from 'src/enums/LanguageType';
import LanguageContext from 'src/contexts/LanguageContext';
import ko from "src/assets/images/korea@2x.png";
import cn from "src/assets/images/china@2x.png";
import en from "src/assets/images/america@2x.png";

export const LanguageConverter = () => {
  const { language, languageArray, setLanguage } = useContext(LanguageContext);
  const [visible, setVisible] = useState(false);
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

  const showingLangIcon = (lang: LanguageType) => {
    switch (lang) {
      case LanguageType.KO:
        return (
          <>
            <img className="lang__select-image" src={ko} alt="KOR" />
            <p className="lang__select-image__text">KOR</p>
          </>
        )
      case LanguageType.ZHHANS:
        return (
          <>
            <img className="lang__select-image" src={cn} alt="CHA" />
            <p className="lang__select-image__text">CHA</p>
          </>
        )
      case LanguageType.EN:
      default:
        return (
          <>
            <img className="lang__select-image" src={en} alt="ENG" />
            <p className="lang__select-image__text">ENG</p>
          </>
        )
    }
  }
  let ChangeLang = () => {
    return (
      <div className="lang__image-wrapper" style={{ display: visible ? "flex" : "none" }}>
        <img
          className="lang__select-image" src={en} alt="ENG"
          style={{ display: languageArray.includes(LanguageType.EN) ? "block" : "none" }}
          onClick={() => {
            setLanguage(LanguageType.EN)
            handleHover()
          }} />
        <img
          className="lang__select-image" src={ko} alt="KOR"
          style={{ display: languageArray.includes(LanguageType.KO) ? "block" : "none" }}
          onClick={() => {
            setLanguage(LanguageType.KO)
            handleHover()
          }} />
        <img
          className="lang__select-image" src={cn} alt="CHA"
          style={{ display: languageArray.includes(LanguageType.ZHHANS) ? "block" : "none" }}
          onClick={() => {
            setLanguage(LanguageType.ZHHANS)
            handleHover()
          }} />
      </div>
    )
  }
  return (
    <div className="lang" ref={LangRef}>
      {ChangeLang()}
      <div className="lang__button-wrapper" onClick={() => handleHover()}>
        {showingLangIcon(language)}
      </div>
    </div>
  )

}


export default LanguageConverter;