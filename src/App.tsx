import React from 'react';
import "./i18n";

import TokenProvider from './providers/TokenProvider';
import WalletProvider from './providers/WalletProvider';
import LanguageProvider from './providers/LanguageProvider';
import { Web3ReactProvider } from '@web3-react/core';
import getLibrary from './core/utils/getLibrary';
import PageProvider from './providers/PageProvider';
import AppNavigator from './AppNavigator';

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <TokenProvider>
        <Web3ReactProvider getLibrary={getLibrary}>
          <WalletProvider>
            <PageProvider>
              <AppNavigator />
            </PageProvider>
          </WalletProvider>
        </Web3ReactProvider>
      </TokenProvider>
    </LanguageProvider>
  );
}

export default App;
