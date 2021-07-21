import { createContext } from 'react';

export type PriceContextType = {
  elfiPrice: number;
  elPrice: number;
  loading: boolean;
  error: boolean;
}

export const initialPriceContext = {
  elfiPrice: 0,
  elPrice: 0,
  loading: false,
  error: false,
}

const PriceContext = createContext<PriceContextType>(initialPriceContext);

export default PriceContext;