import { useTranslation } from 'react-i18next';
import LanguageType from 'src/enums/LanguageType';

export const ordinalNumberConverter = (value: number): string => {
  const { i18n } = useTranslation();

  switch (value) {
    case 1:
      return i18n.language === LanguageType.EN
        ? '1st'
        : i18n.language === LanguageType.ZHHANS
        ? '一'
        : '1';
    case 2:
      return i18n.language === LanguageType.EN
        ? '2nd'
        : i18n.language === LanguageType.ZHHANS
        ? '二'
        : '2';
    case 3:
      return i18n.language === LanguageType.EN
        ? '3rd'
        : i18n.language === LanguageType.ZHHANS
        ? '三'
        : '3';
    case 4:
      return i18n.language === LanguageType.EN
        ? '4th'
        : i18n.language === LanguageType.ZHHANS
        ? '四'
        : '4';
    case 5:
      return i18n.language === LanguageType.EN
        ? '5th'
        : i18n.language === LanguageType.ZHHANS
        ? '三'
        : '5';
    case 6:
      return i18n.language === LanguageType.EN
        ? '6th'
        : i18n.language === LanguageType.ZHHANS
        ? '四'
        : '6';
    default:
      return '';
  }
};
