import React, { useEffect } from 'react';
import {
  Switch,
  Route,
} from "react-router-dom";

import Footer from './components/Footer';
import Navigation from './components/Navigation';
import Dashboard from './containers/Dashboard';
import { StakingEL, StakingELFI } from './containers/Staking';
import { useWeb3React } from '@web3-react/core';
import DisableWalletPage from './components/DisableWalletPage';
import ScrollToTop from './hooks/ScrollToTop';
import envs from 'src/core/envs';
import usePageTracking from './hooks/usePageTracking';

const AppNavigator: React.FC = () => {
  const { active, chainId, deactivate } = useWeb3React();
  usePageTracking();

  useEffect(() => {
    window.sessionStorage.getItem("@connect") === "false" && deactivate();
  }, [active])

  return (
    <div className="elysia">
      <ScrollToTop />
      <Navigation />
      <Switch>
        <Route exact path="/staking/EL" component={
          active && chainId === envs.requiredChainId ? StakingEL : DisableWalletPage
        } />
        <Route exact path="/staking/ELFI" component={
          active && chainId === envs.requiredChainId ? StakingELFI : DisableWalletPage
        } />
        <Route
          exact
          path="/"
          component={
            active && chainId === envs.requiredChainId ? Dashboard : DisableWalletPage
          }
        />
      </Switch>
      <Footer />
    </div>

  );
}

export default AppNavigator;