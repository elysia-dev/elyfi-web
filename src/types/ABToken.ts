
type ABToken = {
  abTokenId: string,
  collateralAddress: string,
  data: {
    loanProducts: string,
    loan: number,
    interest: number,
    overdueInterest: number,
    borrowingDate: number,
    maturityDate: number,
    maximumBond: number,
    collateralType: string,
    collateralAddress: string,
    contractImage: string
  }
}

export default ABToken;