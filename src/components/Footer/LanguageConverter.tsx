import {
  useContext,
  useState,
  useEffect,
  useRef,
  FunctionComponent,
} from 'react';
import LanguageType from 'src/enums/LanguageType';
import LanguageContext from 'src/contexts/LanguageContext';
import ko from 'src/assets/images/korea@2x.png';
import en from 'src/assets/images/america@2x.png';
import cn from 'src/assets/images/china@2x.png';
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
  [LanguageType.CN]: {
    image: cn,
    title: '中文',
  },
};

export const LanguageConverter: FunctionComponent = () => {
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
        className="footer__lang__image-handler"
        style={{ display: visible ? 'flex' : 'none' }}>
        {[LanguageType.EN, LanguageType.KO, LanguageType.CN]
          .filter((languageType) => languageType !== lng)
          .map((languageType, index) => {
            return (
              <div
                className="footer__lang__image-handler__wrapper"
                key={index}
                onClick={() => {
                  setLanguage(languageType);
                  handleHover();
                }}>
                <img
                  src={languageData[languageType].image}
                  alt={languageData[languageType].title}
                />
                <p>{languageData[languageType].title}</p>
              </div>
            );
          })}
      </div>
    );
  };

  const showingLanguageIcon = (languageType: LanguageType) => {
    return (
      <>
        <img
          src={languageData[languageType].image}
          alt="Selected language icon"
        />
        <p className="montserrat">{languageData[languageType].title}</p>
      </>
    );
  };

  return (
    <div className="footer__lang" ref={LangRef}>
      {changeLanguage()}
      <div className="footer__lang__wrapper" onClick={() => handleHover()}>
        {showingLanguageIcon(lng as LanguageType)}
      </div>
    </div>
  );
};

export default LanguageConverter;
