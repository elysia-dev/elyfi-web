import { useEffect, useState, lazy, Suspense } from 'react';
import { lazily } from 'react-lazily';
import { Route, Routes } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
import ScrollToTop from 'src/hooks/ScrollToTop';
import usePageTracking from 'src/hooks/usePageTracking';
import InjectedConnector from 'src/core/connectors/injectedConnector';

const Dashboard = lazy(() => import('src/components/Deposit'));
const Main = lazy(() => import('src/components/Main'));
const Governance = lazy(() => import('src/components/Governance'));
const { StakingEL, StakingELFI } = lazily(
  () => import('src/components/Staking'),
);
const LPStaking = lazy(() => import('src/components/LpStaking'));
const RewardPlan = lazy(() => import('src/components/RewardPlan'));
const MarketDetail = lazy(() => import('src/components/LiquidiryDetails'));
const PortfolioDetail = lazy(() => import('src/components/Portfolio'));

import 'src/stylesheet/public.scss';
import 'src/stylesheet/pc.scss';
import 'src/stylesheet/mobile.scss';

const Navigation = lazy(() => import('src/components/Navigation'));
const Footer = lazy(() => import('src/components/Footer'));

import getLocalLanauge from 'src/utiles/getLocalLanguage';
import useMediaQueryType from 'src/hooks/useMediaQueryType';
import MediaQuery from 'src/enums/MediaQuery';
import { isMetamask, isWalletConnector } from './utiles/connectWallet';
import walletConnectConnector from './utiles/walletConnectProvider';
import useNavigator from './hooks/useNavigator';

const walletConnectProvider = walletConnectConnector();

const AppNavigator: React.FC = () => {
  const [hamburgerBar, setHamburgerBar] = useState(false);
  const { value: mediaQuery } = useMediaQueryType();

  const { deactivate, activate } = useWeb3React();

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
    const navigate = useNavigator();

    useEffect(() => {
      navigate(`/${getLocalLanauge()}`);
    }, []);

    return <></>;
  };

  const nullFallbackArea = (): JSX.Element => {
    return <div style={{ width: '100vw', height: '100vh' }} />;
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
      <Routes>
        <Route
          path=":lng"
          element={
            <Suspense fallback={nullFallbackArea()}>
              <Navigation
                hamburgerBar={hamburgerBar}
                setHamburgerBar={setHamburgerBar}
              />
            </Suspense>
          }>
          <Route
            index
            element={
              <Suspense fallback={nullFallbackArea()}>
                <Main />
              </Suspense>
            }
          />
          <Route path="staking">
            <Route
              path="LP"
              element={
                <Suspense fallback={nullFallbackArea()}>
                  <LPStaking />
                </Suspense>
              }
            />
            <Route
              path="EL"
              element={
                <Suspense fallback={nullFallbackArea()}>
                  <StakingEL />
                </Suspense>
              }
            />
            <Route
              path="ELFI"
              element={
                <Suspense fallback={nullFallbackArea()}>
                  <StakingELFI />
                </Suspense>
              }
            />
          </Route>
          <Route
            path="deposit"
            element={
              <Suspense fallback={nullFallbackArea()}>
                <Dashboard />
              </Suspense>
            }
          />
          <Route path="deposit">
            <Route
              path=":id"
              element={
                <Suspense fallback={nullFallbackArea()}>
                  <MarketDetail />
                </Suspense>
              }
            />
          </Route>
          <Route
            path="governance"
            element={
              <Suspense fallback={nullFallbackArea()}>
                <Governance />
              </Suspense>
            }
          />
          <Route path="portfolio">
            <Route
              path=":id"
              element={
                <Suspense fallback={nullFallbackArea()}>
                  <PortfolioDetail />
                </Suspense>
              }
            />
          </Route>
          <Route path="rewardplan">
            <Route
              path=":stakingType"
              element={
                <Suspense fallback={nullFallbackArea()}>
                  <RewardPlan />
                </Suspense>
              }
            />
          </Route>
        </Route>
      </Routes>
      {/* <Route path="/:lng">
          <LanguageProvider>
            <Suspense fallback={nullFallbackArea()}>
              <Navigation
                hamburgerBar={hamburgerBar}
                setHamburgerBar={setHamburgerBar}
              />
            </Suspense>
            <Suspense fallback={nullFallbackArea()}>
            <Route path="staking">
            <Route path="LP" element={<LPStaking />} />
            <Route path="EL" element={<StakingEL />} />
            <Route path="ELFI" element={<StakingELFI />} />
          </Route>
            </Suspense>
            <Suspense fallback={nullFallbackArea()}>
              <Route exact path="/:lng/governance" component={Governance} />
            </Suspense>
            <Suspense fallback={nullFallbackArea()}>
              <Route
                exact
                path="/:lng/portfolio/:id"
                component={PortfolioDetail}
              />
            </Suspense>
            <Suspense fallback={nullFallbackArea()}>
              <Route
                exact
                path="/:lng/rewardplan/:stakingType"
                component={RewardPlan}
              />
            </Suspense>
            <Suspense fallback={nullFallbackArea()}>
              <Route exact path="/:lng/deposit/:id" component={MarketDetail} />
            </Suspense>
            <Suspense fallback={nullFallbackArea()}>
              <Route exact path="/:lng/deposit" component={Dashboard} />
            </Suspense>
            <Suspense fallback={nullFallbackArea()}>
              <Route exact path="/:lng" component={Main} />
            </Suspense>
            <Suspense fallback={nullFallbackArea()}>
              <Footer />
            </Suspense>
          </LanguageProvider>
        </Route> */}
      {/* <Route path="/" element={<LanguageDetctionPage />} /> */}
    </div>
  );
};

export default AppNavigator;
