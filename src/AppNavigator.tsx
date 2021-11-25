import { useEffect } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
import ScrollToTop from 'src/hooks/ScrollToTop';
import usePageTracking from 'src/hooks/usePageTracking';
import { useMediaQuery } from 'react-responsive';
import InjectedConnector from 'src/core/connectors/injectedConnector';

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
import LPStaking from './containers/LPStaking';
import RewardPlan from './containers/RewardPlan';
import MarketDetail from './containers/MarketDetails';
import PortfolioDetail from './containers/PortfolioDetail';

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
  const setMediaQuery = () => {
    isPc
      ? window.sessionStorage.setItem('@MediaQuery', 'PC')
      : isTablet
      ? window.sessionStorage.setItem('@MediaQuery', 'Tablet')
      : window.sessionStorage.setItem('@MediaQuery', 'Mobile');
  };
  useEffect(() => {
    setMediaQuery();
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
      className={`elysia ${isPc ? 'view-w' : isTablet ? 'view-t' : 'view-m'}`}>
      <ScrollToTop />
      <Switch>
        <Route path="/:lng">
          <LanguageProvider>
            <Navigation />
            {/* <Route
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
              path="/:lng/governanace"
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
            <Footer /> */}
          </LanguageProvider>
        </Route>
        <Route path="/" component={LanguageDetctionPage} />
        <Route exact path="/staking/LP" component={LPStaking} />
        <Route
          exact
          path="/deposits/portfolio/:id"
          component={PortfolioDetail}
        />
        <Route exact path="/rewardplan/:stakingType" component={RewardPlan} />
        <Route exact path="/staking/EL" component={StakingEL} />
        <Route exact path="/staking/ELFI" component={StakingELFI} />
        <Route exact path="/deposits/:id" component={MarketDetail} />
        <Route exact path="/" component={Dashboard} />
      </Switch>
    </div>
  );
};

export default AppNavigator;
