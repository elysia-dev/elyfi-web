import { createContext } from 'react';
import Token000 from '../shared/images/tokens/el.png';
import Token002 from '../shared/images/tokens/bnb.png';
import { DepositTokenType } from '../types/DepositTokenType';
import { MintedTokenType } from '../types/MintedTokenType';

export type TokenContextState = {
  depositToken: DepositTokenType[];
  mintedToken: MintedTokenType[];
}

export interface ITokenContext extends TokenContextState {
  TokenReturn: (key: "marketSize" | "totalBorrowed" | "depositApy" | "borrowApr", ascending: boolean) => void;
}

export const initialTokenState = {
  depositToken: [
    {
      tokenName: "BUSD",
      image: Token002,
    }
  ],
  mintedToken: [
    {
      tokenName: "ELFI",
      image: Token000
    }
  ]
}

export const initialTokenContext = {
  ...initialTokenState,
  TokenReturn: (key: "marketSize" | "totalBorrowed" | "depositApy" | "borrowApr", ascending: boolean) => { },
}

const TokenContext = createContext<ITokenContext>(initialTokenContext);

export default TokenContext;