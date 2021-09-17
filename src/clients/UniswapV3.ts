import axios, { AxiosResponse } from 'axios';

interface IPoolData {
  data: {
    pool: {
      poolDayData: {
        date: number,
        token1Price: string,
      }[]
    }
  }
}

const baseUrl = "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3";

export class UniswapV3 {
  static getPoolData = async (): Promise<AxiosResponse<IPoolData>> => {
    return axios.post(
      baseUrl,
      {
        query: `
          {
            pool(id: "0xbde484db131bd2ae80e44a57f865c1dfebb7e31f"){
              token0 {
                tokenDayData(orderBy: date) {
                   date,
                   priceUSD
                }
              },
							poolDayData(orderBy: date) {
								date,
								token1Price
							}
            },
          }
        `
      }
    )
  }
}

export default UniswapV3