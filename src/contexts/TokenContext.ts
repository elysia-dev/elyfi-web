import { createContext } from 'react';
import { TokenList } from '../types/TokenList';
import AssetTypes from '../enums/AssetType';
import TokenTypes from '../enums/TokenType';
import Token000 from '../shared/images/tokens/el.png';
import Token001 from '../shared/images/tokens/eth.png';

export type TokenContextState = {
  tokenlist: TokenList[];
}

export interface ITokenContext extends TokenContextState {
  TokenReturn: (key: "marketSize" | "totalBorrowed" | "depositApy" | "borrowApr", ascending: boolean, tokenType: TokenTypes) => void;
}

export const initialTokenState = {
  tokenlist: [
    {
      tokenName: "ELA21",
      type: TokenTypes.ASSETS,
      image: AssetTypes.COMMERCIAL,
      marketSize: 0,
    }, 
    {
      tokenName: "ELA18",
      type: TokenTypes.ASSETS,
      image: AssetTypes.RESIDENTIAL,
      marketSize: 0,
    }, 
    {
      tokenName: "EL",
      type: TokenTypes.CRYPTO,
      image: Token000,
      marketSize: 0,
    }, 
    {
      tokenName: "ETH",
      type: TokenTypes.CRYPTO,
      image: Token001,
      marketSize: 0,
    }
  ]
}

export const initialTokenContext = {
  ...initialTokenState,
  TokenReturn: (key: "marketSize" | "totalBorrowed" | "depositApy" | "borrowApr", ascending: boolean, tokenType: TokenTypes) => { },
}

const TokenContext = createContext<ITokenContext>(initialTokenContext);

export default TokenContext;