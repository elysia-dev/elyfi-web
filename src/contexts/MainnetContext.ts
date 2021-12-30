import MainnetType from 'src/enums/MainnetType';
import { createContext } from 'react';

export interface IMainnetContextTypes {
  type: MainnetType,
  name: string,
  image: string
}

export interface IMainnetContext extends IMainnetContextTypes {
  changeMainnet: (mainnet: IMainnetContextTypes) => Promise<void>;
  setCurrentMainnet: (data: IMainnetContextTypes) => void;
}

export const initialMainnetData: IMainnetContextTypes = {
  type: MainnetType.Ethereum,
  name: "",
  image: "",
}

export const initialMainnetContext = {
  ...initialMainnetData,
  changeMainnet: async (mainnet: IMainnetContextTypes) => {},
  setCurrentMainnet: (data: IMainnetContextTypes) => {}
}


const MainnetContext = createContext<IMainnetContext>(initialMainnetContext)

export default MainnetContext;