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

const AppNavigator: React.FC = () => {
  const { active } = useWeb3React();

  return (
    <div className="elysia">
      <Router>
        <Navigation />
        <Switch>
          <Route exact path="/linkage_institution" component={LinkageInstitution} />
          <Route exact path="/dashboard" component={active ? Dashboard : DisableWalletPage} />
          <Route exact path="/portfolio" component={Portfolio} />
          <Route exact path="/asset_detail" component={AssetDetail} />
          <Route exact path="/markets/:id" component={MarketDetail} />
          <Route path="/" component={Market} />
        </Switch>
        <Footer />
      </Router>
    </div>

  );
}

export default AppNavigator;