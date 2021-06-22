// apollo-remote-state/client/src/operations/queries/getAllTodos.tsx
import { gql } from "@apollo/client";

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