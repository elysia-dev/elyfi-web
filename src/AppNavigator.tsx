import React, { useContext } from 'react';
import {
  Switch,
  Route,
  BrowserRouter as Router,
} from "react-router-dom";

import RouteWithFooter from './modules/pc/RouteWithFooter';
import Portfolio from './modules/pc/portfolio/Portfolio';
import Dashboard from './modules/pc/dashboard/Dashboard';

import UserType from './enums/UserType';
import Borrowers from './modules/pc/dashboard/borrowers/Repay';
import Investors from './modules/pc/dashboard/Investors';
import DisableWalletPage from './modules/pc/dashboard/DisableWalletPage';

import RepayDetail from './modules/pc/dashboard/borrowers/RepayDetail';
import AssetDetail from './modules/pc/portfolio/AssetDetail';

import { useWeb3React } from '@web3-react/core';
import WalletContext from './contexts/WalletContext';

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
        <Switch>
          <RouteWithFooter path="/portfolio">
            <Portfolio />
          </RouteWithFooter>
          <RouteWithFooter path="/repay_detail/:value">
            <RepayDetail />
          </RouteWithFooter>
          <RouteWithFooter path="/repay_detail">
            <RepayDetail />
          </RouteWithFooter>
          <RouteWithFooter path="/asset_detail">
            <AssetDetail />
          </RouteWithFooter>
          <RouteWithFooter path="/">
            {DashboardHandler()}
          </RouteWithFooter>
        </Switch>
      </Router>
    </div>
    
  );
}

export default AppNavigator;