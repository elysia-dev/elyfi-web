import Token from 'src/enums/Token';

const isSupportedReserveByChainId = (
  token: Token,
  chainId?: number,
): boolean => {
  switch (chainId) {
    case 1:
    case 1337:
      return [Token.DAI, Token.USDT, Token.USDC].includes(token);
    case 56:
    case 97:
      return [Token.BUSD].includes(token);
    default:
      return false;
  }
};

export default isSupportedReserveByChainId;
