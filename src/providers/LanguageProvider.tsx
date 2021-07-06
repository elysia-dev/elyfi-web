import { useEffect } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageContext, { initialLanguageContext, ILanguageContext } from '../contexts/LanguageContext';
import LanguageType from '../enums/LanguageType';

const LanguageProvider: React.FC = (props) => {
  const [state, setState] = useState<ILanguageContext>(initialLanguageContext);
  const { i18n } = useTranslation();

  const setLanguage = (language: LanguageType) => {
    window.localStorage.setItem("@language", language);
    i18n.changeLanguage(language)
    setState({
      ...state,
      language: language,
    })
  }

  useEffect(() => {
    const language = window.localStorage.getItem("@language") as LanguageType

    if (language) {
      i18n.changeLanguage(language)
      setState({
        ...state,
        language,
      })
    }
  }, [])

  return (
    <LanguageContext.Provider value={{
      ...state,
      setLanguage
    }}>
      {props.children}
    </LanguageContext.Provider>
  );
}

export default LanguageProvider;