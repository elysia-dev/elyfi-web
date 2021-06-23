import React from 'react';
import "./i18n";

import TokenProvider from './providers/TokenProvider';
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

const client = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/modonguk/elyfikovan',
  cache: new InMemoryCache()
});

const App: React.FC = () => {
  return (
    <ApolloProvider client={client} >
      <LanguageProvider>
        <TokenProvider>
          <Web3ReactProvider getLibrary={getLibrary}>
            <AssetProvider>
              <AppNavigator />
            </AssetProvider>
          </Web3ReactProvider>
        </TokenProvider>
      </LanguageProvider>
    </ApolloProvider>
  );
}

export default App;
