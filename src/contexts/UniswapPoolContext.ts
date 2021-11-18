import { createContext } from 'react';
import { BigNumber, constants } from 'ethers';

export type UniswapPoolContextType = {
  totalValueLockedUSD: number;
  totalValueLockedToken0: number;
  totalValueLockedToken1: number;
  poolDayData: {
    date: number;
    token1Price: string;
  }[];
  latestPrice: number;
  loading: boolean;
  error: boolean;
  daiPool: {
    liquidity: BigNumber,
    totalValueLockedToken0: number;
    totalValueLockedToken1: number;
    stakedToken0: number,
    stakedToken1: number,
  },
  ethPool: {
    liquidity: BigNumber,
    totalValueLockedToken0: number;
    totalValueLockedToken1: number;
    stakedToken0: number,
    stakedToken1: number,
  }
};

export const initialUniswapPoolContext = {
  totalValueLockedUSD: 0,
  totalValueLockedToken0: 0,
  totalValueLockedToken1: 0,
  poolDayData: [],
  latestPrice: 0,
  loading: false,
  error: false,
  daiPool: {
    totalValueLockedToken0: 0,
    totalValueLockedToken1: 0,
    liquidity: constants.Zero,
    stakedToken0: 0,
    stakedToken1: 0,
  },
  ethPool: {
    totalValueLockedToken0: 0,
    totalValueLockedToken1: 0,
    liquidity: constants.Zero,
    stakedToken0: 0,
    stakedToken1: 0,
  }
};

const UniswapPoolContext = createContext<UniswapPoolContextType>(
  initialUniswapPoolContext,
);

export default UniswapPoolContext;
