import Token from "src/enums/Token";
import envs from "src/core/envs";

const getIncentivePoolAddress = (round: number, token: Token): string => {
	switch (token) {
		case Token.DAI:
			return round === 1 ? envs.prevDaiIncentivePool : envs.currentDaiIncentivePool
		case Token.USDT:
			return round === 1 ? envs.prevDaiIncentivePool : envs.currentDaiIncentivePool
		case Token.BUSD:
			return envs.busdAddress
		default:
			return envs.prevDaiIncentivePool
	}
}

export default getIncentivePoolAddress