/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetUser
// ====================================================

export interface GetUser_user_lTokenBalance_lToken_reserve {
  __typename: 'Reserve';
  id: string;
  depositAPY: any;
}

export interface GetUser_user_lTokenBalance_lToken {
  __typename: 'LToken';
  reserve: GetUser_user_lTokenBalance_lToken_reserve;
}

export interface GetUser_user_lTokenBalance {
  __typename: 'LTokenUserBalance';
  lToken: GetUser_user_lTokenBalance_lToken;
  balance: any;
}

export interface GetUser_user_deposit_reserve {
  __typename: 'Reserve';
  id: string;
}

export interface GetUser_user_deposit {
  __typename: 'Deposit';
  id: string;
  amount: any;
  reserve: GetUser_user_deposit_reserve;
}

export interface GetUser_user_withdraw_reserve {
  __typename: 'Reserve';
  id: string;
}

export interface GetUser_user_withdraw {
  __typename: 'Withdraw';
  id: string;
  amount: any;
  reserve: GetUser_user_withdraw_reserve;
}

export interface GetUser_user_lTokenMint_lToken {
  __typename: 'LToken';
  id: string;
}

export interface GetUser_user_lTokenMint {
  __typename: 'LTokenMint';
  lToken: GetUser_user_lTokenMint_lToken;
  amount: any;
  index: any;
  timestamp: number;
}

export interface GetUser_user_lTokenBurn_lToken {
  __typename: 'LToken';
  id: string;
}

export interface GetUser_user_lTokenBurn {
  __typename: 'LTokenBurn';
  lToken: GetUser_user_lTokenBurn_lToken;
  amount: any;
  index: any;
  timestamp: number;
}

export interface GetUser_user {
  __typename: 'User';
  id: string;
  lTokenBalance: GetUser_user_lTokenBalance[];
  isCouncil: boolean;
  isCollateralServiceProvider: boolean;
  deposit: GetUser_user_deposit[];
  withdraw: GetUser_user_withdraw[];
  lTokenMint: GetUser_user_lTokenMint[];
  lTokenBurn: GetUser_user_lTokenBurn[];
}

export interface GetUser {
  user: GetUser_user | null;
}

export interface GetUserVariables {
  id: string;
}
