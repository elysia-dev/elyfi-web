import envs from 'src/core/envs';
import Token from 'src/enums/Token';

const getTokenNameByAddress = (address: string): Token.DAI | Token.USDT | Token.BUSD => {
	switch (address) {
		case envs.daiAddress:
			return Token.DAI
		case envs.usdtAddress:
			return Token.USDT
		case envs.busdAddress:
			return Token.BUSD
		default:
			throw new Error('unsupport token address!');
	}
}

export default getTokenNameByAddress;