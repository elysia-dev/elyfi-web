import React from 'react';
import './css/style.scss';
import {
  Route,
} from "react-router-dom";
import Footer from './footer/Footer';

type Props = {
  path: string,
  children: React.ReactNode
}

const RouteWithFooter = (props: Props) => {
  return (
    <Route path={props.path}>
      {props.children}
      <Footer />
    </Route>
  )
}

export default RouteWithFooter;