import axios, { AxiosResponse } from 'axios';
import envs from 'src/core/envs';
import moment from 'moment';
import { IReserveSubgraphData, IAssetBond } from 'src/contexts/SubgraphContext';

const minimumTimestamp = moment().subtract(35, 'days').unix();

const query = `
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
  },
  assetBondTokens(
    orderBy: loanStartTimestamp
    orderDirection: desc
    where: { state_gt: 2 }
  ) {
    id
    state
    signer {
      id
    }
    borrower {
      id
    }
    collateralServiceProvider {
      id
    }
    reserve {
      id
    }
    principal
    debtCeiling
    couponRate
    interestRate
    delinquencyRate
    loanStartTimestamp
    collateralizeTimestamp
    maturityTimestamp
    liquidationTimestamp
    ipfsHash
    signerOpinionHash
  }
}
`

interface IResponse {
  data: {
    reserves: IReserveSubgraphData[],
    assetBondTokens: IAssetBond[]
  }
}

export class ReserveSubgraph {
  static getBscReserveData = async (): Promise<AxiosResponse<IResponse>> => {
    return axios.post(envs.bscSubgraphURI, { query })
  }
  static getEthReserveData = async (): Promise<AxiosResponse<IResponse>> => {
    return axios.post(envs.subgraphURI, { query })
  }
}