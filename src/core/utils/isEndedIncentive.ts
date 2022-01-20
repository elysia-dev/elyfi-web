import Token from "src/enums/Token";
import {
	daiMoneyPoolTime,
	tetherMoneyPoolTime,
} from 'src/core/data/moneypoolTimes';
import moment from "moment";

const isEndedIncentive = (token: string, round: number): boolean => {
	if (token === Token.BUSD) return false;
	const moneyPoolTime =
		token === Token.DAI ? daiMoneyPoolTime : tetherMoneyPoolTime;
	return moment().isAfter(
			moneyPoolTime[round].endedAt,
	);
};

export default isEndedIncentive;