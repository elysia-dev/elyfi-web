import axios from 'axios';
import { BigNumber } from 'ethers';

export type UniswapPoolType = {
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
    liquidity: BigNumber;
    totalValueLockedToken0: number;
    totalValueLockedToken1: number;
    stakedToken0: number;
    stakedToken1: number;
  };
  ethPool: {
    liquidity: BigNumber;
    totalValueLockedToken0: number;
    totalValueLockedToken1: number;
    stakedToken0: number;
    stakedToken1: number;
  };
};

export const poolDataFetcher = (url: string): Promise<any> =>
  axios.get(url).then((res) => res.data);
