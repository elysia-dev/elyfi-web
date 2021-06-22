import React from 'react';
import "./i18n";

import TokenProvider from './providers/TokenProvider';
import WalletProvider from './providers/WalletProvider';
import LanguageProvider from './providers/LanguageProvider';
import { Web3ReactProvider } from '@web3-react/core';
import getLibrary from './core/utils/getLibrary';
import PageProvider from './providers/PageProvider';
import AppNavigator from './AppNavigator';
import AssetProvider from './providers/AssetProvider';
import {
  ApolloProvider,
  InMemoryCache,
  ApolloClient,
} from "@apollo/client";

const client = new ApolloClient({
  uri: 'http://127.0.0.1:8000/subgraphs/name/elysia-dev/elyfi-subgraph',
  cache: new InMemoryCache()
});

const App: React.FC = () => {
  return (
    <ApolloProvider client={client} >
      <LanguageProvider>
        <TokenProvider>
          <Web3ReactProvider getLibrary={getLibrary}>
            <WalletProvider>
              <AssetProvider>
                <PageProvider>
                  <AppNavigator />
                </PageProvider>
              </AssetProvider>
            </WalletProvider>
          </Web3ReactProvider>
        </TokenProvider>
      </LanguageProvider>
    </ApolloProvider>
  );
}

export default App;
