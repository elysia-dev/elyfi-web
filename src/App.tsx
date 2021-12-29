import './i18n';

import { ApolloProvider, InMemoryCache, ApolloClient } from '@apollo/client';
import envs from 'src/core/envs';
import { BrowserRouter as Router } from 'react-router-dom';
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
            <ReservesProvider>
              <MainnetProvider>
                <TxProvider>
                  <Router>
                    <AppNavigator />
                  </Router>
                </TxProvider>
              </MainnetProvider>
            </ReservesProvider>
          </Web3Provider>
        </PriceProvider>
      </UniswapPoolProvider>
    </ApolloProvider>
  );
};

export default App;
