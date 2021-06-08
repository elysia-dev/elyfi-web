import React from 'react';
import {
  Switch,
  Route,
  BrowserRouter as Router,
} from "react-router-dom";
import "./i18n";

import TokenProvider from './providers/TokenProvider';
import WalletProvider from './providers/WalletProvider';

import Main from './modules/pc/main/Main';
import Service from './modules/pc/service/Service';

import MainM from './modules/mobile/main/Main';
import ServiceM from './modules/mobile/service/Service';

import { useMediaQuery } from 'react-responsive';
// import { useTranslation } from 'react-i18next';

// import LanguageContext from './contexts/LanguageContext';
// import LanguageType from './enums/LanguageType';
import LanguageProvider from './providers/LanguageProvider';
// import EthAddress from './containers/EthAddress';

import { Web3ReactProvider } from '@web3-react/core';
import getLibrary from './core/utils/getLibrary';

import { useEagerConnect } from './hooks/connectHoots'

import PageProvider from './providers/PageProvider';

const App: React.FC = () => {
  // const { i18n } = useTranslation();
  // const { language, setLanguage } = useContext(LanguageContext)

  const triedEager = useEagerConnect()

  const isPc = useMediaQuery({
    query: "(min-width: 768px)"
  })

  const PcRouter = () => {
    return (
      <Router>
        <Switch>
          <Route path="/service">
            <Service />
          </Route>
          <Route path="/">
            <Main />
          </Route>
        </Switch>
      </Router>
    );
  }
  const MobileRouter = () => {
    return (
      <Router>
        <Switch>
          <Route path="/service">
            <ServiceM triedEager={triedEager} />
          </Route>
          <Route path="/">
            <MainM />
          </Route>
        </Switch>
      </Router>
    );
  }


  return (
    <LanguageProvider>
      <TokenProvider>
        <Web3ReactProvider getLibrary={getLibrary}>
          <WalletProvider>
            <PageProvider>
              {
              isPc ?
                <PcRouter />
                :
                <MobileRouter />
              }
            </PageProvider>
          </WalletProvider>
        </Web3ReactProvider>
      </TokenProvider>
    </LanguageProvider>
    
  );
}

export default App;
