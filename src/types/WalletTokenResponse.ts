import TokenTypes from '../enums/TokenType';

export type WalletTokenResponse = {
  name: string,
  value: number,
  symbol: TokenTypes | string,
  tokenBalance: number,
  address: string
}