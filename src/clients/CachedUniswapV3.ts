import axios, { AxiosResponse } from 'axios';
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

interface ILpInfo {
  data: {
    data: {
      data: {
        daiPool: IPool;
        ethPool: IPool;
        stakedDaiPositions: IPosition[];
        stakedEthPositions: IPosition[];
      };
    }
  }
}

export class CachedUniswapV3 {
  static getPoolData = async (): Promise<AxiosResponse<ILpInfo>> => {
    return axios.get("https://external-api-responses.s3.amazonaws.com/prod/uniswap-v3-subgraph.json")
  };
}

export default CachedUniswapV3;
