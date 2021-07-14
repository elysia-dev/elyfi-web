import React from 'react';
import "./i18n";

import LanguageProvider from './providers/LanguageProvider';
import { Web3ReactProvider } from '@web3-react/core';
import getLibrary from './core/utils/getLibrary';
import AppNavigator from './AppNavigator';
import {
  ApolloProvider,
  InMemoryCache,
  ApolloClient,
} from "@apollo/client";
import ReservesProvider from './providers/ReservesProvider';
import envs from 'src/core/envs';
import PriceProvider from './providers/PriceProvider';

const client = new ApolloClient({
  uri: envs.subgraphURI,
  cache: new InMemoryCache()
});

const App: React.FC = () => {
  return (
    <ApolloProvider client={client} >
      <PriceProvider>
        <LanguageProvider>
          <Web3ReactProvider getLibrary={getLibrary}>
            <ReservesProvider>
              <AppNavigator />
            </ReservesProvider>
          </Web3ReactProvider>
        </LanguageProvider>
      </PriceProvider>
    </ApolloProvider>
  );
}

export default App;
