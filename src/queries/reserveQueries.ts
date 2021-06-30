import { gql } from "@apollo/client";

export const GET_ALL_RESERVES = gql`
  query GetAllReserves($minimumTimestamp: Int) {
	reserves {
    id,
    lTokenInterestIndex,
    borrowAPY,
    depositAPY,
    totalBorrow,
    totalDeposit,
    lTokenUserBalanceCount,
    dTokenUserBalanceCount,
    borrow {
      id,
      amount,
      timestamp,
      tokenId,
    },
    repay {
      id,
      userDTokenBalance,
      feeOnCollateralServiceProvider,
      timestamp,
      tokenId
    },
    reserveHistory(orderBy: timestamp, timestamp: { gt: minimumTimestamp })  {
        id,
        timestamp,
        borrowAPY,
        depositAPY,
        totalBorrow,
        totalDeposit
    }
  }}
`
