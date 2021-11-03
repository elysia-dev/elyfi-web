import axios, { AxiosResponse } from 'axios';
import { BigNumber } from 'ethers';

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
    // FIXME pool id
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
}

export default UniswapV3;
