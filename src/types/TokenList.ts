import AssetTypes from '../enums/AssetType';
import TokenTypes from '../enums/TokenType';

export type TokenList = {
  tokenName: string;
  type: TokenTypes;
  image: string | AssetTypes;
  marketSize: number;
  totalBorrowed?: number;
  depositApy?: number;
  borrowApr?: number;
}