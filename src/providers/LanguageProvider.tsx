import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageContext, { initialLanguageContext, ILanguageContext } from '../contexts/LanguageContext';
import LanguageType from '../enums/LanguageType';

const TokenProvider: React.FC = (props) => {
  const [state, setState] = useState<ILanguageContext>(initialLanguageContext);
  const { i18n } = useTranslation();

  const setLanguage = (language: LanguageType) => {
    i18n.changeLanguage(language)
    setState({
      ...state,
      language
    })
  }

  const ChangeLanguageArray = (language: LanguageType) => {
    setState({ 
      ...state, 
      languageArray: 
        [LanguageType.EN, LanguageType.KO, LanguageType.ZHHANS].filter(num => num !== language) 
      })
  }


  // useEffect(() => {
  //   let lang = navigator.language;
  //   lang = lang.toLowerCase().substring(0, 2);
  //   console.log("돌아가나?")
  //   console.log(lang)
  //   if (lang.includes('ko')) {
  //     setLanguage(LanguageType.KO)
  //   } else if (lang.includes('zh')) {
  //     setLanguage(LanguageType.ZHHANS)
  //   } else { 
  //     setLanguage(LanguageType.EN)
  //   }
  // }, [])

  return (
    <LanguageContext.Provider value={{
      ...state,
      setLanguage,
      ChangeLanguageArray
    }}>
      {props.children}
    </LanguageContext.Provider>
  );
}

export default TokenProvider;