import { useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import Footer from 'src/components/Footer';
import Dashboard from 'src/containers/Dashboard';
import { StakingEL, StakingELFI } from 'src/containers/Staking';
import { useWeb3React } from '@web3-react/core';
import DisableWalletPage from 'src/components/DisableWalletPage';
import ScrollToTop from 'src/hooks/ScrollToTop';
import envs from 'src/core/envs';
import usePageTracking from 'src/hooks/usePageTracking';
import { useMediaQuery } from 'react-responsive';
import InjectedConnector from 'src/core/connectors/injectedConnector';

import 'src/stylesheet/public.scss';
import 'src/stylesheet/pc.scss';
import 'src/stylesheet/tablet.scss';
import 'src/stylesheet/mobile.scss';
import Navigation from 'src/components/Navigation';
import LPStaking from './containers/LPStaking';

const AppNavigator: React.FC = () => {
  const isPc = useMediaQuery({
    query: '(min-width: 1190px)',
  });
  const isTablet = useMediaQuery({
    query: '(min-width: 768px) and (max-width: 1189px)',
  });
  const isMobile = useMediaQuery({
    query: '(max-width: 767px)',
  });

  useEffect(() => {
    isPc
      ? window.sessionStorage.setItem('@MediaQuery', 'PC')
      : isTablet
      ? window.sessionStorage.setItem('@MediaQuery', 'Tablet')
      : window.sessionStorage.setItem('@MediaQuery', 'Mobile');
  }, [isPc, isTablet, isMobile]);

  const { active, chainId, deactivate, activate } = useWeb3React();
  usePageTracking();

  useEffect(() => {
    if (window.sessionStorage.getItem('@connect') === 'true') {
      activate(InjectedConnector);
    } else {
      deactivate();
    }
  }, []);

  return (
    <div
      className={`elysia ${isPc ? 'view-w' : isTablet ? 'view-t' : 'view-m'}`}>
      <Navigation />
      <ScrollToTop />
      <Switch>
        <Route
          exact
          path="/staking/LP"
          component={
            // active && chainId === envs.requiredChainId
            //   ? LPStaking
            //   : DisableWalletPage
            LPStaking
          }
        />
        <Route
          exact
          path="/staking/EL"
          component={
            // active && chainId === envs.requiredChainId
            //   ? StakingEL
            //   : DisableWalletPage
            StakingEL
          }
        />
        <Route
          exact
          path="/staking/ELFI"
          component={
            // active && chainId === envs.requiredChainId
            //   ? StakingELFI
            //   : DisableWalletPage
            StakingELFI
          }
        />
        <Route
          exact
          path="/"
          component={
            // active && chainId === envs.requiredChainId
            //   ? Dashboard
            //   : DisableWalletPage
            Dashboard
          }
        />
      </Switch>
      <Footer />
    </div>
  );
};

export default AppNavigator;
