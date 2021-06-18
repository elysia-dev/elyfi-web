import { createContext } from 'react';
import AssetStatus from '../enums/AssetStatus';
import TokenTypes from '../enums/TokenType';
import ABToken from '../types/ABToken';
import Assets from '../types/Assets';

export type AssetContextState = {
  abToken: ABToken[];
  assets: Assets[];
}

export interface IAssetContext extends AssetContextState {
  getABToken: (abTokenId: string) => ABToken | undefined;
}

export const InitialAssetState = {
  abToken: [
    {
      abTokenId: "",
      collateralAddress: "",
      data: {
        loanProducts: "",
        loan: 0,
        interest: 0,
        overdueInterest: 0,
        borrowingDate: 0,
        maturityDate: 0,
        maximumBond: 0,
        collateralType: "",
        collateralAddress: "",
        contractImage: ""
      }
    }
  ],
  assets: [
    {
      loanNumber: 0,
      status: AssetStatus.Repaid,
      collateral: "",
      collateralAddress: "",
      borrower: "",
      loan: 0,
      method: TokenTypes.BUSD,
      interest: 0,
      overdueInterest: 0,
      borrowingDate: 0,
      maturityDate: 0,
      abTokenId: "",
      map: ""
    }
  ]
}

export const initialAssetContext = {
  ...InitialAssetState,
  getABToken: (abTokenId: string) => { return undefined }
}

const TokenContext = createContext<IAssetContext>(initialAssetContext);

export default TokenContext;
