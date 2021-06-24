import React from 'react';
import "./i18n";

import LanguageProvider from './providers/LanguageProvider';
import { Web3ReactProvider } from '@web3-react/core';
import getLibrary from './core/utils/getLibrary';
import AppNavigator from './AppNavigator';
import AssetProvider from './providers/AssetProvider';
import {
  ApolloProvider,
  InMemoryCache,
  ApolloClient,
} from "@apollo/client";
import ReservesProvider from './providers/ReservesProvider';

const client = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/modonguk/elyfikovan',
  cache: new InMemoryCache()
});

const App: React.FC = () => {
  return (
    <ApolloProvider client={client} >
      <LanguageProvider>
        <Web3ReactProvider getLibrary={getLibrary}>
          <ReservesProvider>
            <AssetProvider>
              <AppNavigator />
            </AssetProvider>
          </ReservesProvider>
        </Web3ReactProvider>
      </LanguageProvider>
    </ApolloProvider>
  );
}

export default App;
