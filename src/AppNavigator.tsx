import { useEffect, useState } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
import ScrollToTop from 'src/hooks/ScrollToTop';
import usePageTracking from 'src/hooks/usePageTracking';
import InjectedConnector from 'src/core/connectors/injectedConnector';

import Dashboard from 'src/containers/Dashboard';
import { StakingEL, StakingELFI } from 'src/containers/Staking';
import Main from 'src/containers/Main';
import Governance from 'src/containers/Governance';

import 'src/stylesheet/public.scss';
import 'src/stylesheet/pc.scss';
// import 'src/stylesheet/tablet.scss';
import 'src/stylesheet/mobile.scss';
import Navigation from 'src/components/Navigation';
import Footer from 'src/components/Footer';
import getLocalLanauge from 'src/utiles/getLocalLanguage';
import LanguageProvider from 'src/providers/LanguageProvider';
import LPStaking from 'src/containers/LPStaking';
import RewardPlan from 'src/containers/RewardPlan';
import MarketDetail from 'src/containers/MarketDetails';
import PortfolioDetail from 'src/containers/PortfolioDetail';
import useMediaQueryType from 'src/hooks/useMediaQueryType';
import MediaQuery from 'src/enums/MediaQuery';

const AppNavigator: React.FC = () => {
  const [hamburgerBar, setHamburgerBar] = useState(false);
  const { value: mediaQuery } = useMediaQueryType();

  const { deactivate, activate } = useWeb3React();
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
      className={
        `elysia ${
          mediaQuery === MediaQuery.PC
            ? 'view-w'
            : mediaQuery === MediaQuery.Tablet
            ? 'view-t'
            : 'view-m'
        }`
        // "elysia"
      }
      style={{
        position: hamburgerBar ? 'fixed' : 'initial',
      }}>
      <ScrollToTop />
      <Switch>
        <Route path="/:lng">
          <LanguageProvider>
            <Navigation
              hamburgerBar={hamburgerBar}
              setHamburgerBar={setHamburgerBar}
            />
            <Route exact path="/:lng/staking/LP" component={LPStaking} />
            <Route exact path="/:lng/staking/EL" component={StakingEL} />
            <Route exact path="/:lng/staking/ELFI" component={StakingELFI} />
            <Route exact path="/:lng/deposit" component={Dashboard} />

            <Route exact path="/:lng/governance" component={Governance} />
            <Route
              exact
              path="/:lng/portfolio/:id"
              component={PortfolioDetail}
            />
            <Route
              exact
              path="/:lng/rewardplan/:stakingType"
              component={RewardPlan}
            />
            <Route exact path="/:lng/deposits/:id" component={MarketDetail} />
            <Route exact path="/:lng" component={Main} />
            <Footer />
          </LanguageProvider>
        </Route>
        <Route path="/" component={LanguageDetctionPage} />
      </Switch>
    </div>
  );
};

export default AppNavigator;
