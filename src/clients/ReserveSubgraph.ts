import axios, { AxiosResponse } from 'axios';
import envs from 'src/core/envs';
import moment from 'moment';
import { IReserveSubgraph } from 'src/contexts/SubgraphContext';

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