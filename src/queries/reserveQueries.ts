import { gql } from "@apollo/client";

export const GET_ALL_RESERVES = gql`
  query GetAllReserves {
	reserves {
    id,
    lTokenInterestIndex,
    borrowAPY,
    depositAPY,
    totalBorrow,
    totalDeposit,
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
    reserveHistory(orderBy: timestamp) {
        id,
        timestamp,
        borrowAPY,
        depositAPY,
        totalBorrow,
        totalDeposit
    }
  }}
`
