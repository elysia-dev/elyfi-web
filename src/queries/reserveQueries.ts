import { gql } from '@apollo/client';

export const GET_ALL_RESERVES = gql`
  query GetAllReserves($minimumTimestamp: Int) {
    reserves {
      id
      lTokenInterestIndex
      lastUpdateTimestamp
      borrowAPY
      depositAPY
      totalBorrow
      totalDeposit
      lTokenUserBalanceCount
      dTokenUserBalanceCount
      deposit {
        id
      }
      incentivePool {
        id
      }
      borrow {
        id
        amount
        timestamp
        tokenId
      }
      repay {
        id
        userDTokenBalance
        feeOnCollateralServiceProvider
        timestamp
        tokenId
      }
      reserveHistory(
        orderBy: timestamp
        where: { timestamp_gt: $minimumTimestamp }
      ) {
        id
        timestamp
        borrowAPY
        depositAPY
        totalBorrow
        totalDeposit
      }
      lToken {
        id
      }
    }
  }
`;
