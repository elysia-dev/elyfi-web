import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageContext, {
  initialLanguageContext,
  ILanguageContext,
} from '../contexts/LanguageContext';
import LanguageType from '../enums/LanguageType';

const LanguageProvider: React.FC = (props) => {
  const [state, setState] = useState<ILanguageContext>(initialLanguageContext);
  const { i18n } = useTranslation();

  const setLanguage = (language: LanguageType) => {
    window.localStorage.setItem('@language', language);
    i18n.changeLanguage(language);
    setState({
      ...state,
      language,
    });
  };

  useEffect(() => {
    const language = window.localStorage.getItem('@language') as LanguageType;

    if (language) {
      i18n.changeLanguage(language);
      setState({
        ...state,
        language,
      });
    } else {
      let localLanguage = LanguageType.EN;

      const userLang = navigator.language;

      if (userLang?.includes('ko')) {
        localLanguage = LanguageType.KO;
      }

      if (userLang?.includes('zh')) {
        localLanguage = LanguageType.ZHHANS;
      }

      i18n.changeLanguage(localLanguage);
      setState({
        ...state,
        language: localLanguage,
      });
    }
  }, []);

  return (
    <LanguageContext.Provider
      value={{
        ...state,
        setLanguage,
      }}>
      {props.children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
