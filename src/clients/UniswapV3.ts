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
    daiPool: IPool
    ethPool: IPool
    stakedDaiPositions: IPosition[]
    stakedEthPositions: IPosition[]
  };
}

interface IPoolData {
  data: {
    pool: {
      poolDayData: {
        date: number;
        token1Price: string;
      }[];
      liquidity: BigNumber;
      sqrtPrice: BigNumber; // sqrtPriceX96, https://docs.uniswap.org/sdk/guides/fetching-prices#understanding-sqrtprice
    };
  };
}

const baseUrl = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3';

export class UniswapV3 {
  static getPoolData = async (): Promise<AxiosResponse<ILpInfo>> => {
    return axios.post(baseUrl, {
      query: `
        {
          daiPool: pool(id: "0xbde484db131bd2ae80e44a57f865c1dfebb7e31f"){
            totalValueLockedUSD,
            totalValueLockedToken0,
            totalValueLockedToken1,
            liquidity,
            sqrtPrice,
            poolDayData(orderBy: date) {
              date,
              token1Price,
            },
          }

          ethPool: pool(id: "0xc311faebe8802f9cfc91284016d1de9537ec66b7"){
            totalValueLockedUSD,
            totalValueLockedToken0,
            totalValueLockedToken1,
            liquidity,
            sqrtPrice,
            poolDayData(orderBy: date) {
              date,
              token1Price,
            },
          }

          stakedDaiPositions: positions(where: {pool: "0xbde484db131bd2ae80e44a57f865c1dfebb7e31f", owner: "0x1f98407aaB862CdDeF78Ed252D6f557aA5b0f00d"}){
            id,
            liquidity,
            depositedToken0,
            depositedToken1,
          }

          stakedEthPositions: positions(where: {pool: "0xc311faebe8802f9cfc91284016d1de9537ec66b7", owner: "0x1f98407aaB862CdDeF78Ed252D6f557aA5b0f00d"}){
            id,
            liquidity,
            depositedToken0,
            depositedToken1,
          }
        }
        `,
    });
  };

  static getElfiDaiPoolData = async (): Promise<AxiosResponse<IPoolData>> => {
    return axios.post(baseUrl, {
      query: `
          {
            pool(id: "0xbde484db131bd2ae80e44a57f865c1dfebb7e31f"){
							poolDayData(orderBy: date) {
								date,
								token1Price
							},
              liquidity,
              sqrtPrice
            },
          }
        `,
    });
  };

  static getElfiEthPoolData = async (): Promise<AxiosResponse<IPoolData>> => {
    return axios.post(baseUrl, {
      query: `
          {
            pool(id: "0xc311faebe8802f9cfc91284016d1de9537ec66b7"){
							poolDayData(orderBy: date) {
								date,
								token1Price
							},
              liquidity,
              sqrtPrice
            },
          }
        `,
    });
  };
}

export default UniswapV3;
