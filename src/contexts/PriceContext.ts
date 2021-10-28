import { createContext } from 'react';

export type PriceContextType = {
  elfiPrice: number;
  elPrice: number;
  tetherPrice: number;
  daiPrice: number;
  ethPrice: number;
  loading: boolean;
  error: boolean;
};

export const initialPriceContext = {
  elfiPrice: 0,
  elPrice: 0,
  tetherPrice: 0,
  daiPrice: 0,
  ethPrice: 0,
  loading: true,
  error: false,
};

const PriceContext = createContext<PriceContextType>(initialPriceContext);

export default PriceContext;
