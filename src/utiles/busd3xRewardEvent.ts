import moment, { Moment } from 'moment';
import Token from 'src/enums/Token';

export const busd3xRewardEvent = (token?: string, date?: Moment): number => {
  return token === Token.BUSD
    ? (date ? date : moment()).diff('2022.1.26 19:00:00 +9:00') >= 0
      ? 1
      : 3
    : 1;
};
