import '../css/style.scss';
import React, { FunctionComponent, useState } from 'react';
import { useContext } from 'react';
import { ServicePage } from '../../../enums/pageEnum';
import Borrow from './apps/Borrow';
import Buy from './apps/Buy';
import Dashboard from './apps/Dashboard';
import Deposit from './apps/Deposit';
import MoneyPool from './apps/MoneyPool';
import PageContext from '../../../contexts/PageContext';

export const Service: FunctionComponent = () => {
  const { page } = useContext(PageContext)
  
  const InitialRouteType = () => {
    switch (page) {
      case ServicePage.Deposit:
        return <Deposit />
      case ServicePage.Borrow:
        return <Borrow />
      case ServicePage.Dashboard:
        return <Dashboard />
      case ServicePage.Buy:
        return <Buy />
      case ServicePage.MoneyPool:
        return <MoneyPool />
      default:
        return <Deposit />
    }
  }

  return (
    InitialRouteType()
  );
}

export default Service;