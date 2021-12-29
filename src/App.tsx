import './i18n';

import { Web3ReactProvider } from '@web3-react/core';
import { ApolloProvider, InMemoryCache, ApolloClient } from '@apollo/client';
import envs from 'src/core/envs';
import { BrowserRouter as Router } from 'react-router-dom';
import getLibrary from './core/utils/getLibrary';
import AppNavigator from './AppNavigator';
import ReservesProvider from './providers/ReservesProvider';
import PriceProvider from './providers/PriceProvider';

import 'src/stylesheet/public.scss';
import 'src/stylesheet/pc.scss';
import 'src/stylesheet/tablet.scss';
import 'src/stylesheet/mobile.scss';
import TxProvider from './providers/TxProvider';
import UniswapPoolProvider from './providers/UniswapPoolProvider';
import MainnetProvider from './providers/MainnetProvider';
import Web3Provider from './providers/Web3Provider';

const client = new ApolloClient({
  uri: envs.subgraphURI,
  cache: new InMemoryCache(),
});

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <UniswapPoolProvider>
        <PriceProvider>
          <Web3Provider>
            <Web3ReactProvider getLibrary={getLibrary}>
              <ReservesProvider>
                <TxProvider>
                <MainnetProvider>
                  <Router>
                    <AppNavigator />
                  </Router>
                </MainnetProvider>
                </TxProvider>
              </ReservesProvider>
            </Web3ReactProvider>
          </Web3Provider>
        </PriceProvider>
      </UniswapPoolProvider>
    </ApolloProvider>
  );
};

export default App;
