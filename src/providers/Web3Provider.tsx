import { createContext, useState } from 'react';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3 from 'web3';
import { ethers, providers } from 'ethers';

interface Web3State {
  fetching: boolean;
  account: string;
  web3: any;
  provider: providers.Web3Provider | null;
  active: boolean;
  chainId: number;
  networkId: number;
  pendingRequest: boolean;
  result: any | null;
}

const web3Modal = new Web3Modal({
  cacheProvider: true, // optional
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        chainId: 1,
        infuraId: 'd3988071acf74e9cbec7ec15ebca4d7c',
        rpc: {
          1:
            process.env.NODE_ENV === 'development'
              ? 'https://elyfi-test.elyfi.world:8545'
              : process.env.REACT_APP_JSON_RPC,
          56: 'https://bsc-dataseed.binance.org/',
          97: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
        },
        qrcodeModalOptions: {
          mobileLinks: [
            'rainbow',
            'metamask',
            'argent',
            'trust',
            'imtoken',
            'pillar',
          ],
          desktopLinks: ['encrypted ink'],
          supportedChainIds: [1, 56, 97],
        },
      },
    },
  },
});

const INIT_STATE = {
  fetching: false,
  account: '',
  web3: null,
  provider: null,
  active: false,
  chainId: 1,
  networkId: 1,
  pendingRequest: false,
  result: null,
};

interface IWeb3Context extends Web3State {
  activate: () => Promise<void>;
  deactivate: () => Promise<void>;
}

export const Web3Context = createContext<IWeb3Context>({} as IWeb3Context);

const Web3Provider: React.FC = (props) => {
  const [state, setState] = useState<Web3State>({
    ...INIT_STATE,
  });

  const subscribeProvider = async (provider: any) => {
    if (!provider.on) {
      return;
    }
    provider.on('connect', async (accounts: string[]) => {
      setState({ ...state, account: accounts[0] });
    });
  };

  const activate = async () => {
    const web3ModalConnection = await web3Modal.connect();
    const web3 = new Web3(web3ModalConnection);
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    const networkId = await web3.eth.net.getId();
    const chainId = await web3.eth.getChainId();
    const provider = new ethers.providers.Web3Provider(web3ModalConnection);
    setState({
      ...state,
      web3,
      provider,
      active: true,
      account,
      chainId,
      networkId,
    });

    subscribeProvider(provider);
  };

  const deactivate = async () => {
    const { web3 } = state;
    if (web3 && web3.currentProvider && web3.currentProvider.close) {
      await web3.currentProvider.close();
    }
    await web3Modal.clearCachedProvider();
    setState({
      ...INIT_STATE,
    });
  };

  return (
    <Web3Context.Provider
      value={{
        ...state,
        activate,
        deactivate,
      }}>
      {props.children}
    </Web3Context.Provider>
  );
};

export default Web3Provider;
