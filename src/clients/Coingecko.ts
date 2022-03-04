import axios from 'axios';

export interface ICoinPriceResponse {
  elysia: {
    usd: number;
  };
  elyfi: {
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

export const pricesFetcher = (url: string): Promise<ICoinPriceResponse> =>
  axios.get(url).then((res) => res.data);
