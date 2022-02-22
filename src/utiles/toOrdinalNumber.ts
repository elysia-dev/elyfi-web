import LanguageType from 'src/enums/LanguageType';

const toOrdinalNumber = (language: string, value: number): string => {
  switch (value) {
    case 1:
      return language === LanguageType.EN
        ? '1st'
        : language === LanguageType.ZHHANS
        ? '一'
        : '1';
    case 2:
      return language === LanguageType.EN
        ? '2nd'
        : language === LanguageType.ZHHANS
        ? '二'
        : '2';
    case 3:
      return language === LanguageType.EN
        ? '3rd'
        : language === LanguageType.ZHHANS
        ? '三'
        : '3';
    case 4:
      return language === LanguageType.EN
        ? '4th'
        : language === LanguageType.ZHHANS
        ? '四'
        : '4';
    case 5:
      return language === LanguageType.EN
        ? '5th'
        : language === LanguageType.ZHHANS
        ? '五'
        : '5';
    case 6:
      return language === LanguageType.EN
        ? '6th'
        : language === LanguageType.ZHHANS
        ? '六'
        : '6';
    case 7:
      return language === LanguageType.EN ? '7th' : '7';
    case 8:
      return language === LanguageType.EN ? '8th' : '8';
    default:
      return '';
  }
};

export default toOrdinalNumber;
