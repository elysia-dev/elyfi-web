import axios, { AxiosResponse } from 'axios';
import { BigNumber } from 'ethers';
import Position from 'src/core/types/Position';
import envs from 'src/core/envs';
import {
  GetAllReserves,
  GetAllReserves_reserves,
} from 'src/queries/__generated__/GetAllReserves';

const baseUrl = envs.subgraphURI;

export class DepositSubgraph {
  static getAllReserves1st = async (
    minimumTimestamp: number,
  ): Promise<AxiosResponse<GetAllReserves>> => {
    return await axios.post(
      'https://gateway.thegraph.com/api/96f993b15274d04d4c1be0cb5fb79ff6/subgraphs/id/0x9d2d46e67c420147834c76b23c9bac485f114feb-0',
      {
        query: `
      {
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
            where: { timestamp_gt: ${minimumTimestamp} }
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
        `,
      },
    );
  };

  static getAllReserves2nd = async (
    minimumTimestamp: number,
  ): Promise<AxiosResponse<GetAllReserves_reserves>> => {
    return axios.post(
      'https://gateway.thegraph.com/api/96f993b15274d04d4c1be0cb5fb79ff6/subgraphs/id/0x9d2d46e67c420147834c76b23c9bac485f114feb-0',
      {
        query: `
      {
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
            where: { timestamp_gt: ${minimumTimestamp} }
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
        `,
      },
    );
  };
}

export default DepositSubgraph;
