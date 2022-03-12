import { BigNumber } from 'ethers';
import { createContext } from 'react';
import ABTokenState from 'src/enums/ABTokenState';
import MainnetType from 'src/enums/MainnetType';

export interface IReserveHistory {
  id: string;
  timestamp: number;
  borrowAPY: any;
  depositAPY: any;
  totalBorrow: any;
  totalDeposit: any;
}

export interface IAssetBond {
  id: string;
  state: ABTokenState;
  signer: {
    id: string;
  };
  borrower: {
    id: string;
  };
  collateralServiceProvider: {
    id: string;
  };
  reserve: {
    id: string;
  };
  principal: BigNumber;
  debtCeiling: BigNumber;
  couponRate: BigNumber;
  interestRate: BigNumber;
  delinquencyRate: BigNumber;
  loanStartTimestamp: number;
  collateralizeTimestamp: number;
  maturityTimestamp: number;
  liquidationTimestamp: number;
  ipfsHash: string;
  signerOpinionHash: string;
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
  assetBondTokens: IAssetBond[];
}

export interface IReserveSubgraph {
  data: {
    reserves: IReserveSubgraphData[];
  };
  loading: boolean;
}

export const initialReserveSubgraph: IReserveSubgraph = {
  data: {
    reserves: [
      {
        id: '',
        lTokenInterestIndex: '',
        lastUpdateTimestamp: 0,
        borrowAPY: '',
        depositAPY: 0,
        totalBorrow: '',
        totalDeposit: '',
        lTokenUserBalanceCount: 0,
        dTokenUserBalanceCount: 0,
        deposit: [
          {
            id: '',
          },
        ],
        incentivePool: {
          id: '',
        },
        borrow: [
          {
            id: '',
            amount: '',
            timestamp: 0,
            tokenId: '',
          },
        ],
        repay: [
          {
            id: '',
            userDTokenBalance: '',
            feeOnCollateralServiceProvider: '',
            timestamp: 0,
            tokenId: '',
          },
        ],
        reserveHistory: [
          {
            id: '',
            timestamp: 0,
            borrowAPY: '',
            depositAPY: '',
            totalBorrow: '',
            totalDeposit: '',
          },
        ],
        lToken: {
          id: '',
        },
        assetBondTokens: [],
      },
    ],
  },
  loading: true,
};

interface ISubgraphContext {
  data: {
    reserves: IReserveSubgraphData[];
  };
  loading: boolean;
  getAssetBondsByNetwork: (network: MainnetType) => IAssetBond[];
}

const SubgraphContext = createContext<ISubgraphContext>({
  ...initialReserveSubgraph,
  getAssetBondsByNetwork: () => [],
});

export default SubgraphContext;
