import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
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
import getLocalLanauge from 'src/utiles/getLocalLanguage';
import LPStaking from 'src/containers/LPStaking';
import RewardPlan from 'src/containers/RewardPlan';
import MarketDetail from 'src/containers/MarketDetails';
import PortfolioDetail from 'src/containers/PortfolioDetail';
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
          path="/:lng"
          element={
            <Navigation
              hamburgerBar={hamburgerBar}
              setHamburgerBar={setHamburgerBar}
            />
          }>
          <Route index element={<Main />} />
          <Route path="staking">
            <Route path="LP" element={<LPStaking />} />
            <Route path="EL" element={<StakingEL />} />
            <Route path="ELFI" element={<StakingELFI />} />
          </Route>
          <Route path="deposit" element={<Dashboard />} />
          <Route path="governance" element={<Governance />} />
          <Route path="portfolio">
            <Route path=":id" element={<PortfolioDetail />} />
          </Route>
          <Route path="rewardplan">
            <Route path=":stakingType" element={<RewardPlan />} />
          </Route>
          <Route path="deposits">
            <Route path=":id" element={<MarketDetail />} />
          </Route>
        </Route>
        {/* <Route path="/" element={<LanguageDetctionPage />} /> */}
      </Routes>
    </div>
  );
};

export default AppNavigator;
