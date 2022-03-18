import axios from 'axios';

export type PriceType = {
  elfiPrice: number;
  elPrice: number;
  tetherPrice: number;
  daiPrice: number;
  ethPrice: number;
};

export const pricesFetcher = (url: string): Promise<PriceType> =>
  axios.get(url).then((res) => res.data);
