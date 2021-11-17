import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import getLocalLanauge from 'src/utiles/getLocalLanguage';
import LanguageContext from '../contexts/LanguageContext';
import LanguageType from '../enums/LanguageType';

const LanguageProvider: React.FC = (props) => {
  const { i18n } = useTranslation();
  const { lng } = useParams<{ lng: string }>();
  const history = useHistory();

  const setLanguage = (language: LanguageType) => {
    window.localStorage.setItem('@language', language);
    console.log(language)
    history.push(`/${language}`);
  };

  useEffect(() => {
    if (
      [LanguageType.EN, LanguageType.KO, LanguageType.ZHHANS].includes(
        lng as LanguageType,
      )
    ) {
      i18n.changeLanguage(lng);
    } else {
      history.replace(`/${getLocalLanauge()}`);
    }
  }, [lng]);

  return (
    <LanguageContext.Provider
      value={{
        setLanguage,
      }}>
      {props.children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
