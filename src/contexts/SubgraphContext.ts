import { createContext } from "react"

export interface IReserveHistory {
  id: string;
  timestamp: number;
  borrowAPY: any;
  depositAPY: any;
  totalBorrow: any;
  totalDeposit: any;
}

export interface IReserveSubgraphData {
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
  reserveHistory: IReserveHistory[];
  lToken: {
    id: string;
  };
}

export interface IReserveSubgraph {
  data: {
    reserves: IReserveSubgraphData[]
  }
}

export const initialReserveSubgraph: IReserveSubgraph = {
  data: {
    reserves: [
      {
        id: "",
        lTokenInterestIndex: "",
        lastUpdateTimestamp: 0,
        borrowAPY: "",
        depositAPY: 0,
        totalBorrow: "",
        totalDeposit: "",
        lTokenUserBalanceCount: 0,
        dTokenUserBalanceCount: 0,
        deposit: [
          {
            id: "",
          }
        ],
        incentivePool: {
          id: "",
        },
        borrow: [
          {
            id: "",
            amount: "",
            timestamp: 0,
            tokenId: "",
          }
        ],
        repay: [
          {
            id: "",
            userDTokenBalance: "",
            feeOnCollateralServiceProvider: "",
            timestamp: 0,
            tokenId: "",
          }
        ],
        reserveHistory: [
          {
            id: "",
            timestamp: 0,
            borrowAPY: "",
            depositAPY: "",
            totalBorrow: "",
            totalDeposit: "",
          }
        ],
        lToken: {
          id: "",
        },
      }
    ]
  }
}

const SubgraphContext = createContext<IReserveSubgraph>(initialReserveSubgraph);

export default SubgraphContext