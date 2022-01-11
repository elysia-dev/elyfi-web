import MainnetType from 'src/enums/MainnetType';
import { createContext } from 'react';

export interface IMainnetContextTypes {
  type: MainnetType,
  unsupportedChainid: boolean
}

export interface IMainnetContext extends IMainnetContextTypes {
  changeMainnet: (mainnetChainId: number) => Promise<void>;
  setCurrentMainnet: (data: MainnetType) => void;
}

export const initialMainnetData: IMainnetContextTypes = {
  type: MainnetType.Ethereum,
  unsupportedChainid: false
}

export const initialMainnetContext = {
  ...initialMainnetData,
  changeMainnet: async (mainnetChainId: number) => {},
  setCurrentMainnet: (data: MainnetType) => {}
}


const MainnetContext = createContext<IMainnetContext>(initialMainnetContext)

export default MainnetContext;