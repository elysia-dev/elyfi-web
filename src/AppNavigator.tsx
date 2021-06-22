import React, { useContext } from 'react';
import {
  Switch,
  BrowserRouter as Router,
  Route,
} from "react-router-dom";

import Portfolio from './modules/pc/portfolio/Portfolio';
import Market from 'src/containers/Market';

import UserType from './enums/UserType';
import Borrowers from './modules/pc/dashboard/borrowers/Repay';
import Investors from './modules/pc/dashboard/Investors';
import DisableWalletPage from './modules/pc/dashboard/DisableWalletPage';

import RepayDetail from './modules/pc/dashboard/borrowers/RepayDetail';
import AssetDetail from './modules/pc/portfolio/AssetDetail';

import { useWeb3React } from '@web3-react/core';
import WalletContext from './contexts/WalletContext';
import Footer from './modules/pc/footer/Footer';
import Navigation from './modules/pc/component/Navigation';

const AppNavigator: React.FC = () => {
  const { userType } = useContext(WalletContext);
  const { active } = useWeb3React();
  const DashboardHandler = () => {
    return (
      !active ?
        <DisableWalletPage />
        :
        userType === UserType.Borrowers ?
          <Borrowers />
          :
          userType === UserType.Collateral ?
            <Investors />
            :
            <Investors />
    )
  }

  return (
    <div className="elysia">
      <Router>
        <Navigation />
        <Switch>
          <Route exact path="/dashboard">
            {DashboardHandler()}
          </Route>
          <Route exact path="/portfolio" component={Portfolio} />
          <Route exact path="/asset_detail" component={AssetDetail} />
          <Route exact path="/repay_detail/:value" component={RepayDetail} />
          <Route path="/" component={Market} />
        </Switch>
        <Footer />
      </Router>
    </div>

  );
}

export default AppNavigator;