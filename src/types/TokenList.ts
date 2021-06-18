import AssetTypes from '../enums/AssetType';

export type TokenList = {
  tokenName: string;
  image: string | AssetTypes;
  marketSize: number;
  totalBorrowed?: number;
  depositApy?: number;
  borrowApr?: number;
}