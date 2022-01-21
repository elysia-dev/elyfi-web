import MainnetType from "src/enums/MainnetType"
import Token from "src/enums/Token"

const isSupportedReserve = (token: Token, network: MainnetType): boolean => {
	switch (network) {
		case MainnetType.Ethereum:
			return [Token.DAI, Token.USDT].includes(token)
		case MainnetType.BSC:
			return [Token.BUSD].includes(token)
		default:
			return false
	}
}

export default isSupportedReserve