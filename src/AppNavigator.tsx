import React from 'react';
import {
  Switch,
  BrowserRouter as Router,
  Route,
} from "react-router-dom";

import Portfolio from './modules/pc/portfolio/Portfolio';
import Market from 'src/containers/Market';

import RepayDetail from './modules/pc/dashboard/borrowers/RepayDetail';
import AssetDetail from './modules/pc/portfolio/AssetDetail';

import Footer from './modules/pc/footer/Footer';
import Navigation from './modules/pc/component/Navigation';
import MarketDetail from './containers/MarketDetails';
import Dashboard from './containers/Dashboard';
import { useWeb3React } from '@web3-react/core';
import DisableWalletPage from './components/DisableWalletPage';

const AppNavigator: React.FC = () => {
  const { active } = useWeb3React();

  return (
    <div className="elysia">
      <Router>
        <Navigation />
        <Switch>
          <Route exact path="/dashboard" component={active ? Dashboard : DisableWalletPage} />
          <Route exact path="/portfolio" component={Portfolio} />
          <Route exact path="/asset_detail" component={AssetDetail} />
          <Route exact path="/repay_detail/:value" component={RepayDetail} />
          <Route exact path="/markets/:id" component={MarketDetail} />
          <Route path="/" component={Market} />
        </Switch>
        <Footer />
      </Router>
    </div>

  );
}

export default AppNavigator;