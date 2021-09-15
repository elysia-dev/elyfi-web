import axios, { AxiosResponse } from 'axios';

interface IELFIPrice {
	data: {
		data: {
			token: {
				tokenDayData: { priceUSD: string }[]
			}
		}
	}
}

interface IPoolData {
	data: {
		pool: {
			totalValueLockedUSD: string
			token0: {
				tokenDayData: {
					priceUSD: string,
					date: number
				}[]
			}
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
              totalValueLockedUSD,
              token0 {
                tokenDayData(orderBy: date) {
                   date,
                   priceUSD
                  }
                }
              }
          }
        `
			}
		)
	}

	static getELFIPRice = async (): Promise<string> => {
		try {
			const uniswapSubGraphRes = await axios.post(
				baseUrl,
				{
					query: "{ token(id: \"0x4da34f8264cb33a5c9f17081b9ef5ff6091116f4\"){ tokenDayData(orderBy: date, orderDirection: desc, first:1){ priceUSD } } }"
				}
			) as IELFIPrice

			return uniswapSubGraphRes.data.data.token.tokenDayData[0].priceUSD;
		} catch (e) {
			const cache = await axios.get('https://elyfi-subgraph-cache.s3.ap-northeast-2.amazonaws.com/elfiPoolResponse.json')
			return cache.data.data.pool.token0.tokenDayData.slice(-1)[0].priceUSD;
		}
	}
}

export default UniswapV3