import { FunctionComponent, useContext, useState } from 'react';
import { useLocation, Link, useHistory } from 'react-router-dom'
import ElysiaLogo from '../../../shared/images/Elysia_Logo.png';
import ElysiaLogoBeta from '../../../shared/images/Elysia_Logo_Beta.png';
import InstallMetamask from './InstallMetamask';
import Wallet from './Wallet';
import { useEagerConnect } from '../../../hooks/connectHoots';
import PageContext from '../../../contexts/PageContext';
import { ServicePage } from '../../../enums/pageEnum';
import WalletContext from '../../../contexts/WalletContext';
import UserType from '../../../enums/UserType';

const Navigation: FunctionComponent = () => {
  const location = useLocation();
  const triedEager = useEagerConnect()
  const [visible, setVisible] = useState(false);
  const { setPage, page } = useContext(PageContext);
  const { userType } = useContext(WalletContext)
  const history = useHistory();
  const handleHover = () => {
    setVisible(true);
  };
  const handleOut = () => {
    setVisible(false);
  };
  const LNB = () => {
    const checkService = (page: ServicePage) => {
      if(location.pathname !== "/service") {
        history.push('/service');
      }
      setPage(page)
    }
    return (
      <div 
        onMouseEnter={handleHover} 
        onMouseLeave={handleOut}
        style={{ paddingTop: 20, paddingBottom: 20 }} 
      >
        <li style={{ position: "relative" }}>
          <p className="navigation__link" 
            style={{ 
              fontFamily: location.pathname === "/service" ? "Montserrat-bold" : "Montserrat",
              }}
            onClick={() => checkService(UserType.Collateral ? ServicePage.Borrow : ServicePage.Deposit)}>
            APP
          </p>
          <ul className="navigation__sub-menu" style={{ display: visible ? "block" : "none" }}>
            {userType === UserType.Collateral && (
              <>
                <li className="navigation__sub-menu__item"
                  onClick={() => checkService(ServicePage.Borrow)}
                  style={{ 
                    color: page === ServicePage.Borrow ? "#3679b5" : "#000000",
                    fontFamily: page === ServicePage.Borrow ? "Montserrat-bold" : "Montserrat",
                  }}>
                  Go to Borrow
                </li>
                <li className="navigation__sub-menu__item" 
                  onClick={() => checkService(ServicePage.Buy)}
                  style={{ 
                    color: page === ServicePage.Buy ? "#3679b5" : "#000000",
                    fontFamily: page === ServicePage.Buy ? "Montserrat-bold" : "Montserrat",
                  }}>
                  Go to Buy
                </li>
              </>
            )}
            <li className="navigation__sub-menu__item" 
              onClick={() => checkService(ServicePage.Deposit)}
              style={{ 
                color: page === ServicePage.Deposit ? "#3679b5" : "#000000",
                fontFamily: page === ServicePage.Deposit ? "Montserrat-bold" : "Montserrat",
              }}>
              Go to Deposit
            </li>
            <li className="navigation__sub-menu__item" 
              onClick={() =>  checkService(ServicePage.Dashboard)}
              style={{ 
                color: page === ServicePage.Dashboard ? "#3679b5" : "#000000",
                fontFamily: page === ServicePage.Dashboard ? "Montserrat-bold" : "Montserrat",
              }}>
              Dashboard
            </li>
            <li className="navigation__sub-menu__item" 
              onClick={() =>  checkService(ServicePage.MoneyPool)}
              style={{ 
                color: page === ServicePage.MoneyPool ? "#3679b5" : "#000000",
                fontFamily: page === ServicePage.MoneyPool ? "Montserrat-bold" : "Montserrat",
              }}>
              Money pool's Portfolio
            </li>
            <li className="navigation__sub-menu__item" 
              onClick={() =>  checkService(ServicePage.MoneyPool)}
              style={{ 
                color: page === ServicePage.MoneyPool ? "#3679b5" : "#000000",
                fontFamily: page === ServicePage.MoneyPool ? "Montserrat-bold" : "Montserrat",
              }}>
              Profile of Linkage Institutions
            </li>
          </ul>
        </li>
      </div>
    )
  }
  return (
    <nav className="navigation">
      <Link to="/">
        <div className="logo-wrapper">
          <img src={ElysiaLogo} className="elysia-logo" alt="Elysia_Logo" />
          <img src={ElysiaLogoBeta} className="elysia-logo-beta" alt="beta" />
        </div>
      </Link>
      <div className="navigation__link-wrapper">
        <Link to="/">
          <p className={"navigation__link"} style={{ fontFamily: location.pathname === "/" ? "Montserrat-bold" : "Montserrat" }}>
            MAIN
          </p>
        </Link>
        <a href='https://elyfi-docs.elysia.land'>
          <p className="navigation__link">
            DOCS
          </p>
        </a>
        <LNB />
        {window.ethereum?.isMetaMask ? <Wallet triedEager={triedEager}/> : <InstallMetamask />}
      </div>
    </nav>
  );
}

export default Navigation;