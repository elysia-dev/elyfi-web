import Token from 'src/enums/Token';
import envs from 'src/core/envs';

const getTokenNameFromAddress = (address: string): Token => {
  if (address === envs.token.usdtAddress) return Token.USDT;
  if (address === envs.token.daiAddress) return Token.DAI;
  if (address === envs.token.busdAddress) return Token.BUSD;

  return Token.ETH;
};

export default getTokenNameFromAddress;
