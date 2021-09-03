import axios from 'axios';

interface IELFIPrice {
	data: {
		data: {
			token: {
				tokenDayData: { priceUSD: string }[]
			}
		}
	}
}

const baseUrl = "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3";

export class UniswapV3 {
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