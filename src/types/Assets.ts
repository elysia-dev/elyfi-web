import AssetStatus from '../enums/AssetStatus';
import TokenTypes from '../enums/TokenType';
import ABToken from './ABToken';

type Assets = {
  loanNumber: number,
  status: AssetStatus,
  collateral: string,
  collateralAddress: string,
  borrower: string,
  loan: number,
  method: TokenTypes,
  interest: number,
  overdueInterest: number,
  borrowingDate: number,
  maturityDate: number,
  abTokenId: string,
  map: string,
}

export default Assets;