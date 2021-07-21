import axios, { AxiosResponse } from 'axios';

interface ICoinPriceResponse {
	elysia: {
		usd: number;
	};
};

export default class Coingecko {
	static getElPrice = async (): Promise<AxiosResponse<ICoinPriceResponse>> => {
		return axios.get(
			'https://api.coingecko.com/api/v3/simple/price?ids=elysia&vs_currencies=usd',
		);
	};
}
