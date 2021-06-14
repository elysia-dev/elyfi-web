export type ContractType = {
  id: number;
  abTokenId: string;
  borrowingDate: string;
  maturityDate: string;
  infomation: {
    collateralServiceProvider: string;
    loanProducts: string;
    borrowings: number;
    loanInterestRate: number;
    delinquentInterestRate: number;
    maxBond: number;
    collateralType: string;
    callateralAddress: string;
    contractImage: string;
  }
}