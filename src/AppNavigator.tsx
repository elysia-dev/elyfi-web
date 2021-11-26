import { useEffect, useState } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
import DisableWalletPage from 'src/components/DisableWalletPage';
import ScrollToTop from 'src/hooks/ScrollToTop';
import envs from 'src/core/envs';
import usePageTracking from 'src/hooks/usePageTracking';
import { useMediaQuery } from 'react-responsive';
import InjectedConnector from 'src/core/connectors/injectedConnector';

import LPStaking from 'src/containers/LPStaking';
import Dashboard from 'src/containers/Dashboard';
import { StakingEL, StakingELFI } from 'src/containers/Staking';
import Main from 'src/containers/Main';
import Guide from 'src/containers/Guide';
import Governance from 'src/containers/Governance';

import 'src/stylesheet/public.scss';
import 'src/stylesheet/pc.scss';
import 'src/stylesheet/tablet.scss';
import 'src/stylesheet/mobile.scss';
import Navigation from 'src/components/Navigation';
import Footer from 'src/components/Footer';
import getLocalLanauge from 'src/utiles/getLocalLanguage';
import LanguageProvider from 'src/providers/LanguageProvider';
import DarkmodeModal from 'src/components/DarkmodeButton';

const AppNavigator: React.FC = () => {
  const [isDarkmodeActivated, setDarkModeActivated] = useState(false);
  const setDarkMode = () => {
    setDarkModeActivated(!isDarkmodeActivated);
    window.sessionStorage.getItem('@isDarkMode') === 'true' ?
      window.sessionStorage.setItem('@isDarkMode', 'false') :
      window.sessionStorage.setItem('@isDarkMode', 'true')
  }
  useEffect(() => {
    window.sessionStorage.getItem('@isDarkMode') === 'true' ? setDarkModeActivated(true) : setDarkModeActivated(false)
  }, [])

  const isPc = useMediaQuery({
    query: '(min-width: 1190px)',
  });
  const isTablet = useMediaQuery({
    query: '(min-width: 768px) and (max-width: 1189px)',
  });
  const isMobile = useMediaQuery({
    query: '(max-width: 767px)',
  });
  const setMediaQuery = () => {
    isPc
      ? window.sessionStorage.setItem('@MediaQuery', 'PC')
      : isTablet
      ? window.sessionStorage.setItem('@MediaQuery', 'Tablet')
      : window.sessionStorage.setItem('@MediaQuery', 'Mobile');
  }
  useEffect(() => {
    setMediaQuery()
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

  const LanguageDetctionPage = () => {
    const history = useHistory();
  
    useEffect(() => {
      history.replace(`/${getLocalLanauge()}`);
    }, []);
  
    return <></>;
  };

  return (
    <div
      className={`elysia ${isPc ? 'view-w' : isTablet ? 'view-t' : 'view-m'} ${isDarkmodeActivated ? "dark" : "light"}`}>
      <ScrollToTop />
      <Switch>
        <Route path="/:lng">
          <LanguageProvider>
            <Navigation />
            {/* <DarkmodeModal 
              isDarkmode={isDarkmodeActivated}
              setDarkMode={() => setDarkMode()}
            /> */}
            <Route
              exact
              path="/:lng/staking/LP"
              component={
                active && chainId === envs.requiredChainId
                  ? LPStaking
                  : DisableWalletPage
              }
            />
            <Route
              exact
              path="/:lng/staking/EL"
              component={
                active && chainId === envs.requiredChainId
                  ? StakingEL
                  : DisableWalletPage
              }
            />
            <Route
              exact
              path="/:lng/staking/ELFI"
              component={
                active && chainId === envs.requiredChainId
                  ? StakingELFI
                  : DisableWalletPage
              }
            />
            <Route
              exact
              path="/:lng/dashboard"
              component={
                Dashboard
              }
            />
            <Route
              exact
              path="/:lng/guide"
              component={
                Guide
              }
            />
            <Route
              exact
              path="/:lng/governance"
              component={
                Governance
              }
            />
            <Route
              exact
              path="/:lng"
              component={
                Main
              }
            />
            <Footer />
          </LanguageProvider>
        </Route>
        <Route path="/" component={LanguageDetctionPage} />
      </Switch>
    </div>
  );
};

export default AppNavigator;
