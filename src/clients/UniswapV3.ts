import axios, { AxiosResponse } from 'axios';

interface IELFIPrice {
	data: {
		token: {
			tokenDayData: { priceUSD: string }[]
		}
	}
}

const baseUrl = "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3";

export class UniswapV3 {
	static getELFIPRice = async (): Promise<AxiosResponse<IELFIPrice>> => {
		return axios.post(
			baseUrl,
			{
				query: "{ token(id: \"0x4da34f8264cb33a5c9f17081b9ef5ff6091116f4\"){ tokenDayData(orderBy: date, orderDirection: desc, first:1){ priceUSD } } }"
			}
		)
	}
}

export default UniswapV3