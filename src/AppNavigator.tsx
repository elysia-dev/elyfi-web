import React, { useEffect } from 'react';
import {
  Switch,
  BrowserRouter as Router,
  Route,
} from "react-router-dom";

import Portfolio from './containers/Portfolio';

import PortfolioDetail from './containers/PortfolioDetail';

import Footer from './components/Footer';
import Navigation from './components/Navigation';
import Dashboard from './containers/Dashboard';
import Staking from './containers/Staking';
import { useWeb3React } from '@web3-react/core';
import DisableWalletPage from './components/DisableWalletPage';
import LinkageInstitution from 'src/containers/LinkageInstitution';
import ScrollToTop from './hooks/ScrollToTop';
import envs from 'src/core/envs';

const AppNavigator: React.FC = () => {
  const { active, chainId, deactivate } = useWeb3React();

  useEffect(() => {
    window.sessionStorage.getItem("@connect") === "false" && deactivate();
  }, [active])

  return (
    <div className="elysia">
      <Router>
        <ScrollToTop />
        <Navigation />
        <Switch>
          <Route exact path="/staking" component={
            active && chainId === envs.requiredChainId ? Staking : DisableWalletPage
          } />
          <Route exact path="/linkage_institution" component={LinkageInstitution} />
          <Route exact path="/portfolio" component={Portfolio} />
          <Route exact path="/portfolio/:id" component={PortfolioDetail} />
          <Route
            exact
            path="/"
            component={
              active && chainId === envs.requiredChainId ? Dashboard : DisableWalletPage
            }
          />
        </Switch>
        <Footer />
      </Router>
    </div>

  );
}

export default AppNavigator;