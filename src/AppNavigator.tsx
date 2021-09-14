import React, { useEffect } from 'react';
import {
  Switch,
  Route,
} from "react-router-dom";
import Footer from 'src/components/Footer';
import Dashboard from 'src/containers/Dashboard';
import { StakingEL, StakingELFI } from 'src/containers/Staking';
import { useWeb3React } from '@web3-react/core';
import DisableWalletPage from 'src/components/DisableWalletPage';
import ScrollToTop from 'src/hooks/ScrollToTop';
import envs from 'src/core/envs';
import usePageTracking from 'src/hooks/usePageTracking';
import { useMediaQuery } from 'react-responsive';

import 'src/stylesheet/public.scss';
import 'src/stylesheet/pc.scss';
import 'src/stylesheet/tablet.scss';
import 'src/stylesheet/mobile.scss';
import Navigation from 'src/components/Navigation';

const AppNavigator: React.FC = () => {
  const isPc = useMediaQuery({
    query: "(min-width: 1190px)"
  })
  const isTablet = useMediaQuery({
    query: "(min-width: 768px) and (max-width: 1189px)"
  })
  const isMobile = useMediaQuery({
    query: "(max-width: 767px)"
  })

  useEffect(() => {
    isPc ? window.sessionStorage.setItem("@MediaQuery", "PC") : isTablet ? window.sessionStorage.setItem("@MediaQuery", "Tablet") : window.sessionStorage.setItem("@MediaQuery", "Mobile")
  }, [isPc, isTablet, isMobile])
  
  const { active, chainId, deactivate } = useWeb3React();
  usePageTracking();

  useEffect(() => {
    window.sessionStorage.getItem("@connect") === "false" && deactivate();
  }, [active])

  return (
    <div className={`elysia ${isPc ? "view-w" : isTablet ? "view-t" : "view-m"}`}>
      <Navigation />
      <ScrollToTop />
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