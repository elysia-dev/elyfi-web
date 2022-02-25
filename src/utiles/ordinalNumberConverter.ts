import { i18n } from 'i18next';
import { useTranslation } from 'react-i18next';
import LanguageType from 'src/enums/LanguageType';

export const ordinalNumberConverter = (value: number, i18n: i18n): string => {
  switch (value) {
    case 1:
      return i18n.language === LanguageType.EN ? '1st' : '1';
    case 2:
      return i18n.language === LanguageType.EN ? '2nd' : '2';
    case 3:
      return i18n.language === LanguageType.EN ? '3rd' : '3';
    case 4:
      return i18n.language === LanguageType.EN ? '4th' : '4';
    case 5:
      return i18n.language === LanguageType.EN ? '5th' : '5';
    case 6:
      return i18n.language === LanguageType.EN ? '6th' : '6';
    case 7:
      return i18n.language === LanguageType.EN ? '7th' : '7';
    case 8:
      return i18n.language === LanguageType.EN ? '8th' : '8';
    default:
      return '';
  }
};
export const busdOrdinalNumberConverter = (value: number): string => {
  const { i18n } = useTranslation();

  switch (value) {
    case 1:
      return i18n.language === LanguageType.EN ? '1st' : '1';
    case 2:
      return i18n.language === LanguageType.EN ? '2nd' : '2';
    case 3:
      return i18n.language === LanguageType.EN ? '3rd' : '3';
    default:
      return i18n.language === LanguageType.EN ? '1st' : '1';
  }
};
