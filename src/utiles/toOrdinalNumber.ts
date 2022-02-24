import LanguageType from 'src/enums/LanguageType';

const toOrdinalNumber = (language: string, value: number): string => {
  switch (value) {
    case 1:
      return language === LanguageType.EN ? '1st' : '1';
    case 2:
      return language === LanguageType.EN ? '2nd' : '2';
    case 3:
      return language === LanguageType.EN ? '3rd' : '3';
    case 4:
      return language === LanguageType.EN ? '4th' : '4';
    case 5:
      return language === LanguageType.EN ? '5th' : '5';
    case 6:
      return language === LanguageType.EN ? '6th' : '6';
    default:
      return '';
  }
};

export default toOrdinalNumber;
