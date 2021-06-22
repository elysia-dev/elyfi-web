import { gql } from "@apollo/client";

export const GET_RESERVE = gql`
  query GetReserve($id: String!) {
	  reserve (id: $id) {
      id,
      lTokenInterestIndex,
      borrowAPY,
      depositAPY,
      totalBorrow,
      toatlDeposit,
      reserveHistory {
        id,
        timestamp,
        borrowAPY,
        depositAPY,
        totalBorrow,
        toatlDeposit
      }
    }
  }
`

export const GET_ALL_RESERVES = gql`
  query GetAllReserves {
	reserves {
    id,
    lTokenInterestIndex,
    borrowAPY,
    depositAPY,
    totalBorrow,
    toatlDeposit,
    }
  }
`
