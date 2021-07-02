import React from 'react';
import {
  Switch,
  BrowserRouter as Router,
  Route,
} from "react-router-dom";

import Portfolio from './containers/Portfolio';
import Market from 'src/containers/Market';

import AssetDetail from './containers/AssetDetail';

import Footer from './components/Footer';
import Navigation from './components/Navigation';
import MarketDetail from './containers/MarketDetails';
import Dashboard from './containers/Dashboard';
import { useWeb3React } from '@web3-react/core';
import DisableWalletPage from './components/DisableWalletPage';
import LinkageInstitution from 'src/containers/LinkageInstitution';
import ScrollToTop from './hooks/ScrollToTop';
import Security from 'src/containers/Security';
import InvestmentGuide from 'src/containers/InvestmentGuide';
import envs from 'src/core/envs';

const AppNavigator: React.FC = () => {
  const { active, chainId } = useWeb3React();

  return (
    <div className="elysia">
      <Router>
        <ScrollToTop />
        <Navigation />
        <Switch>
          <Route exact path="/linkage_institution" component={LinkageInstitution} />
          <Route
            exact
            path="/dashboard"
            component={
              active && chainId === envs.requiredChainId ? Dashboard : DisableWalletPage
            }
          />
          <Route exact path="/security" component={Security} />
          <Route exact path="/guide" component={InvestmentGuide} />
          <Route exact path="/portfolio" component={Portfolio} />
          <Route exact path="/portfolio/:id" component={AssetDetail} />
          <Route exact path="/markets/:id" component={MarketDetail} />
          <Route path="/" component={Market} />
        </Switch>
        <Footer />
      </Router>
    </div>

  );
}

export default AppNavigator;