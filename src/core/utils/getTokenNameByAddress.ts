import envs from 'src/core/envs';
import Token from 'src/enums/Token';

const getTokenNameByAddress = (
  address: string,
): Token.DAI | Token.USDT | Token.BUSD | Token.USDC => {
  switch (address) {
    case envs.token.usdcAddress:
      return Token.USDC;
    case envs.token.daiAddress:
      return Token.DAI;
    case envs.token.usdtAddress:
      return Token.USDT;
    case envs.token.busdAddress:
      return Token.BUSD;
    default:
      throw new Error('unsupport token address!');
  }
};

export default getTokenNameByAddress;
