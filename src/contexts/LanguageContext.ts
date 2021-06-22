import LanguageType from '../enums/LanguageType';
import { createContext } from 'react';

export type LanguageContextState = {
  language: LanguageType;
  languageArray: LanguageType[];
}

export interface ILanguageContext extends LanguageContextState {
  setLanguage: (language: LanguageType) => void; 
}

export const initialLanguageState = {
  language: LanguageType.EN,
  languageArray: [
    LanguageType.KO,
    LanguageType.ZHHANS
  ]
}

export const initialLanguageContext = {
  ...initialLanguageState,
  setLanguage: (language: LanguageType) => { }
}

const LanguageContext = createContext<ILanguageContext>(initialLanguageContext);

export default LanguageContext;