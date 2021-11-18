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
  };
  ethereum: {
    usd: number;
  };
}

export default class Coingecko {
  static getPrices = async (): Promise<AxiosResponse<ICoinPriceResponse>> => {
    return axios.get(
      'https://api.coingecko.com/api/v3/simple/price?ids=elysia,dai,ethereum,tether&vs_currencies=usd',
    );
  };
}
