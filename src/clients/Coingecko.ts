import axios, { AxiosResponse } from 'axios';

interface ICoinPriceResponse {
	elysia: {
		usd: number;
	};
	dai: {
		usd: number;
	};
	tether: {
		usd: number;
	}
};

export default class Coingecko {
	static getElPrice = async (): Promise<AxiosResponse<ICoinPriceResponse>> => {
		return axios.get(
			'https://api.coingecko.com/api/v3/simple/price?ids=elysia&vs_currencies=usd',
		);
	};
	static getDaiPrice = async (): Promise<AxiosResponse<ICoinPriceResponse>> => {
		return axios.get(
			'https://api.coingecko.com/api/v3/simple/price?ids=dai&vs_currencies=usd',
		);
	};
	static getTetherPrice = async (): Promise<AxiosResponse<ICoinPriceResponse>> => {
		return axios.get(
			'https://api.coingecko.com/api/v3/simple/price?ids=Tether&vs_currencies=usd',
		);
	};
}
