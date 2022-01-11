/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetAllReserves
// ====================================================

export interface GetAllReserves_reserves_deposit {
  __typename: 'Deposit';
  id: string;
}

export interface GetAllReserves_reserves_incentivePool {
  __typename: 'IncentivePool';
  id: string;
}

export interface GetAllReserves_reserves_borrow {
  __typename: 'Borrow';
  id: string;
  amount: any;
  timestamp: number;
  tokenId: string;
}

export interface GetAllReserves_reserves_repay {
  __typename: 'Repay';
  id: string;
  userDTokenBalance: any;
  feeOnCollateralServiceProvider: any;
  timestamp: number;
  tokenId: string;
}

export interface GetAllReserves_reserves_reserveHistory {
  __typename: 'ReserveHistory';
  id: string;
  timestamp: number;
  borrowAPY: any;
  depositAPY: any;
  totalBorrow: any;
  totalDeposit: any;
}

export interface GetAllReserves_reserves_lToken {
  __typename: 'LToken';
  id: string;
}

export interface GetAllReserves_reserves {
  __typename: 'Reserve';
  id: string;
  lTokenInterestIndex: any;
  lastUpdateTimestamp: number;
  borrowAPY: any;
  depositAPY: any;
  totalBorrow: any;
  totalDeposit: any;
  lTokenUserBalanceCount: number;
  dTokenUserBalanceCount: number;
  deposit: GetAllReserves_reserves_deposit[];
  incentivePool: GetAllReserves_reserves_incentivePool;
  borrow: GetAllReserves_reserves_borrow[];
  repay: GetAllReserves_reserves_repay[];
  reserveHistory: GetAllReserves_reserves_reserveHistory[];
  lToken: GetAllReserves_reserves_lToken;
}

export interface GetAllReserves {
  data: { reserves: GetAllReserves_reserves[] };
}

export interface GetAllReservesVariables {
  minimumTimestamp?: number | null;
}
