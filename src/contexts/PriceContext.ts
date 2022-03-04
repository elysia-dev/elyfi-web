import { createContext } from 'react';

export type PriceContextType = {
  elfiPrice: number;
  elPrice: number;
  tetherPrice: number;
  daiPrice: number;
  ethPrice: number;
};

export const initialPriceContext = {
  elfiPrice: 0,
  elPrice: 0,
  tetherPrice: 0,
  daiPrice: 0,
  ethPrice: 0,
};

const PriceContext = createContext<PriceContextType>(initialPriceContext);

export default PriceContext;
