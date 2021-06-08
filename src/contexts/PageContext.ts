import { createContext } from 'react';
import { ServicePage } from '../enums/pageEnum';

export type PageContextState = {
  page: ServicePage;
}

export interface IPageContext extends PageContextState {
  setPage: (navigation: ServicePage) => void; 
}

export const initialPageState = {
  page: ServicePage.Deposit
}

export const initialPageContext = {
  ...initialPageState,
  setPage: (navigation: ServicePage) => { }
}

const PageContext = createContext<IPageContext>(initialPageContext);

export default PageContext;