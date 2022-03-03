import axios from 'axios';
import { BigNumber } from 'ethers';
interface IPool {
  totalValueLockedUSD: string;
  totalValueLockedToken0: string; // ELFI
  totalValueLockedToken1: string; // DAI
  poolDayData: {
    date: number;
    token1Price: string;
  }[];
  liquidity: BigNumber;
  sqrtPrice: BigNumber;
}

interface IPosition {
  liquidity: BigNumber;
  depositedToken0: string;
  depositedToken1: string;
}

export interface ILpInfo {
  data: {
    data: {
      data: {
        daiPool: IPool;
        ethPool: IPool;
        stakedDaiPositions: IPosition[];
        stakedEthPositions: IPosition[];
      };
    };
  };
}

export const poolDataFetcher = (url: string): Promise<ILpInfo> =>
  axios.get(url).then((res) => res.data);
