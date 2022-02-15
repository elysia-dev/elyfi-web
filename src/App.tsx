import './i18n';

import { useContext, useEffect, useState } from 'react';
// import { Web3ReactProvider } from '@web3-react/core';
import { ApolloProvider, InMemoryCache, ApolloClient } from '@apollo/client';
import { Web3ReactProvider } from '@web3-react/core';
import envs from 'src/core/envs';
import { BrowserRouter as Router } from 'react-router-dom';
import getLibrary from './core/utils/getLibrary';
import AppNavigator from './AppNavigator';
import PriceProvider from './providers/PriceProvider';
import SubgraphProvider from './providers/SubgraphProvider';

import 'src/stylesheet/public.scss';
import 'src/stylesheet/pc.scss';
import 'src/stylesheet/tablet.scss';
import 'src/stylesheet/mobile.scss';
import TxProvider from './providers/TxProvider';
import UniswapPoolProvider from './providers/UniswapPoolProvider';
import MainnetProvider from './providers/MainnetProvider';

const App: React.FC = () => {
  const client = new ApolloClient({
    uri: envs.subgraphURI,
    // uri: envs.bscSubgraphURI,
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <UniswapPoolProvider>
        <PriceProvider>
          <Web3ReactProvider getLibrary={getLibrary}>
            <MainnetProvider>
              <TxProvider>
                <SubgraphProvider>
                  <Router>
                    <AppNavigator />
                  </Router>
                </SubgraphProvider>
              </TxProvider>
            </MainnetProvider>
          </Web3ReactProvider>
        </PriceProvider>
      </UniswapPoolProvider>
    </ApolloProvider>
  );
};

export default App;
