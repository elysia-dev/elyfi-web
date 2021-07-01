import { useState } from 'react';
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
      language: language,
      languageArray: [LanguageType.EN, LanguageType.KO, LanguageType.ZHHANS].filter(num => num !== language) 
    })
    console.log(i18n.language)
  }


  return (
    <LanguageContext.Provider value={{
      ...state,
      setLanguage
    }}>
      {props.children}
    </LanguageContext.Provider>
  );
}

export default TokenProvider;