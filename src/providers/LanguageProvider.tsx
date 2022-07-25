import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import getLocalLanauge from 'src/utiles/getLocalLanguage';
import LanguageContext from '../contexts/LanguageContext';
import LanguageType from '../enums/LanguageType';
const LanguageProvider: React.FC = (props) => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const setLanguage = (language: LanguageType) => {
    window.localStorage.setItem('@language', language);
    navigate(`/${language}`);
    const getPath = location.pathname.split('/')[2];
    if (getPath === undefined) {
      return navigate(`/${language}`);
    }
    i18n.changeLanguage(language);
    navigate(
      `/${language + '/' + getPath + location.pathname.split(getPath)[1]}`,
    );
  };

  useEffect(() => {
    if (
      [LanguageType.EN, LanguageType.KO, LanguageType.CN].includes(
        location.pathname.split('/')[1] as LanguageType,
      )
    ) {
      i18n.changeLanguage(location.pathname.split('/')[1]);
    } else {
      navigate(`/${getLocalLanauge()}`);
    }
  }, [location.pathname]);
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
