import { useEffect, useState, lazy, Suspense } from 'react';
import { lazily } from 'react-lazily';
import { Switch, Route, useHistory } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
import ScrollToTop from 'src/hooks/ScrollToTop';
import usePageTracking from 'src/hooks/usePageTracking';
import InjectedConnector from 'src/core/connectors/injectedConnector';

const Dashboard = lazy(() => import('src/components/Deposit'))
const Main = lazy(() => import('src/components/Main'))
const Governance = lazy(() => import('src/components/Governance'))
const { StakingEL, StakingELFI } = lazily(() => import('src/components/Staking'));
const LPStaking = lazy(() => import('src/components/LpStaking'));
const RewardPlan = lazy(() => import('src/components/RewardPlan'));
const MarketDetail = lazy(() => import('src/components/LiquidiryDetails'));
const PortfolioDetail = lazy(() => import('src/components/Portfolio'));

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
              <Suspense fallback={<>Loading...</>}>
                <Navigation
                  hamburgerBar={hamburgerBar}
                  setHamburgerBar={setHamburgerBar}
                />
              </Suspense>
              <Suspense fallback={<>Loading...</>}>
                <Route exact path="/:lng/staking/LP" component={LPStaking} />
              </Suspense>
              <Suspense fallback={<>Loading...</>}>
                <Route exact path="/:lng/staking/EL" component={StakingEL} />
                <Route exact path="/:lng/staking/ELFI" component={StakingELFI} />
              </Suspense>
              <Suspense fallback={<>Loading...</>}>
                <Route exact path="/:lng/governance" component={Governance} />
              </Suspense>
              <Suspense fallback={<>Loading...</>}>
                <Route
                  exact
                  path="/:lng/portfolio/:id"
                  component={PortfolioDetail}
                />
              </Suspense>
              <Suspense fallback={<>Loading...</>}>
                <Route
                  exact
                  path="/:lng/rewardplan/:stakingType"
                  component={RewardPlan}
                />
              </Suspense>
              <Suspense fallback={<>Loading...</>}>
                <Route exact path="/:lng/deposit/:id" component={MarketDetail} />
              </Suspense>
              <Suspense fallback={<>Loading...</>}>
                <Route exact path="/:lng/deposit" component={Dashboard} />
              </Suspense>
              <Suspense fallback={<>Loading...</>}>
                <Route exact path="/:lng" component={Main} />
              </Suspense>
              <Suspense fallback={<>Loading...</>}>
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
