import axios, { AxiosResponse } from 'axios';
import envs from 'src/core/envs';
import moment from 'moment';

export interface IReserveSubgraph {
  data: {
    reserves: {
      id: string;
      lTokenInterestIndex: any;
      lastUpdateTimestamp: number;
      borrowAPY: any;
      depositAPY: any;
      totalBorrow: any;
      totalDeposit: any;
      lTokenUserBalanceCount: number;
      dTokenUserBalanceCount: number;
      deposit: {
        id: string;
      }[];
      incentivePool: {
        id: string;
      };
      borrow: {
        id: string;
        amount: any;
        timestamp: number;
        tokenId: string;
      }[];
      repay: {
        id: string;
        userDTokenBalance: any;
        feeOnCollateralServiceProvider: any;
        timestamp: number;
        tokenId: string;
      }[];
      reserveHistory: {
        id: string;
        timestamp: number;
        borrowAPY: any;
        depositAPY: any;
        totalBorrow: any;
        totalDeposit: any;
      }[];
      lToken: {
        id: string;
      };
    }[]
  }
}

const minimumTimestamp = moment().subtract(35, 'days').unix();

export class ReserveSubgraph {
  static getBscReserveData = async (): Promise<AxiosResponse<IReserveSubgraph>> => {
    return axios.post(envs.bscSubgraphURI , {
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
      `
    })
  }
  static getEthReserveData = async (): Promise<AxiosResponse<IReserveSubgraph>> => {
    return axios.post(envs.subgraphURI , {
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
      `
    })
  } 
}