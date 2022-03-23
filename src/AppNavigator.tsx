import { useEffect, useState, lazy, Suspense } from 'react';
import { lazily } from 'react-lazily';
import { Switch, Route, useHistory } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
import ScrollToTop from 'src/hooks/ScrollToTop';
import usePageTracking from 'src/hooks/usePageTracking';
import InjectedConnector from 'src/core/connectors/injectedConnector';

const Dashboard = lazy(() => import('src/containers/Dashboard'))
const Main = lazy(() => import('src/containers/Main'))
const Governance = lazy(() => import('src/containers/Governance'))
const { StakingEL, StakingELFI } = lazily(() => import('src/containers/Staking'));
const LPStaking = lazy(() => import('src/containers/LPStaking'));
const RewardPlan = lazy(() => import('src/containers/RewardPlan'));
const MarketDetail = lazy(() => import('src/containers/MarketDetails'));
const PortfolioDetail = lazy(() => import('src/containers/PortfolioDetail'));

import 'src/stylesheet/public.scss';
import 'src/stylesheet/pc.scss';
import 'src/stylesheet/mobile.scss';

const Navigation = lazy(() => import('src/components/Navigation'))
const Footer = lazy(() => import('src/components/Footer'))

import getLocalLanauge from 'src/utiles/getLocalLanguage';
import LanguageProvider from 'src/providers/LanguageProvider';
import useMediaQueryType from 'src/hooks/useMediaQueryType';
import MediaQuery from 'src/enums/MediaQuery';
import { isMetamask, isWalletConnector } from './utiles/connectWallet';
import walletConnectConnector from './utiles/walletConnectProvider';

const walletConnectProvider = walletConnectConnector();

const AppNavigator: React.FC = () => {
  const [hamburgerBar, setHamburgerBar] = useState(false);
  const { value: mediaQuery } = useMediaQueryType();

  const { deactivate, activate, library } = useWeb3React();

  usePageTracking();

  useEffect(() => {
    if (isWalletConnector()) {
      activate(walletConnectProvider);
      return;
    }
    if (isMetamask()) {
      activate(InjectedConnector);
      // return;
    } else {
      deactivate();
      window.sessionStorage.removeItem('@network');
    }
    // deactivate();
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
              <Suspense fallback={null}>
                <Navigation
                  hamburgerBar={hamburgerBar}
                  setHamburgerBar={setHamburgerBar}
                />
              </Suspense>
              <Suspense fallback={null}>
                <Route exact path="/:lng/staking/LP" component={LPStaking} />
              </Suspense>
              <Suspense fallback={null}>
                <Route exact path="/:lng/staking/EL" component={StakingEL} />
                <Route exact path="/:lng/staking/ELFI" component={StakingELFI} />
              </Suspense>
              <Suspense fallback={null}>
                <Route exact path="/:lng/governance" component={Governance} />
              </Suspense>
              <Suspense fallback={null}>
                <Route
                  exact
                  path="/:lng/portfolio/:id"
                  component={PortfolioDetail}
                />
              </Suspense>
              <Suspense fallback={null}>
                <Route
                  exact
                  path="/:lng/rewardplan/:stakingType"
                  component={RewardPlan}
                />
              </Suspense>
              <Suspense fallback={null}>
                <Route exact path="/:lng/deposit/:id" component={MarketDetail} />
              </Suspense>
              <Suspense fallback={null}>
                <Route exact path="/:lng/deposit" component={Dashboard} />
              </Suspense>
              <Suspense fallback={null}>
                <Route exact path="/:lng" component={Main} />
              </Suspense>
              <Suspense fallback={null}>
                <Footer />
              </Suspense>
          </LanguageProvider>
        </Route>
        <Route path="/" component={LanguageDetctionPage} />
      </Switch>
    </div>
  );
};

export default AppNavigator;