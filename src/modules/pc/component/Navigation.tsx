import { FunctionComponent, useContext, useEffect, useState } from 'react';
import { useLocation, Link, useHistory } from 'react-router-dom'
import ElysiaLogo from '../../../shared/images/Elysia_Logo.png';
import ElysiaLogoBeta from '../../../shared/images/Elysia_Logo_Beta.png';
import InstallMetamask from './InstallMetamask';
import Wallet from './Wallet';
import { useEagerConnect } from '../../../hooks/connectHoots';
import PageContext from '../../../contexts/PageContext';
import WalletContext from '../../../contexts/WalletContext';
import UserType from '../../../enums/UserType';

const Navigation: FunctionComponent = () => {
  const location = useLocation();
  const triedEager = useEagerConnect()
  const [visible, setVisible] = useState(false);
  const { setPage, page } = useContext(PageContext);
  const { userType } = useContext(WalletContext)
  const history = useHistory();
  const [hover, setHover] = useState(0);

  useEffect(() => {
    console.log(userType)
  },[])

  const CollateralPage = () => {
    return (
      <div className="navigation__dashboard__container"
        style={{ display: hover === 1 ? "block" : "none" }}
        onMouseEnter={() => setHover(1)}
        onMouseLeave={() => setHover(0)}
      >
        <div className="navigation__dashboard__wrapper">
          <p className="navigation__dashboard__link">
            Borrow
          </p>
          <p className="navigation__dashboard__link">
            NPL market
          </p>
          <p className="navigation__dashboard__link">
            Deposit / Withdraw
          </p>
          <p className="navigation__dashboard__link">
            Repayment Statement
          </p>
        </div>
      </div>
    )
  }
  const BorrowerPage = () => {
    return (
      <div className="navigation__dashboard__container"
        style={{ display: hover === 1 ? "block" : "none" }}
        onMouseEnter={() => setHover(1)}
        onMouseLeave={() => setHover(0)}
      >
        <div className="navigation__dashboard__wrapper">
          <p className="navigation__dashboard__link">
            Dashboard
          </p>
          <p className="navigation__dashboard__link">
            Deposit / Withdraw
          </p>
        </div>
      </div>
    )
  }
  return (
    <nav className="navigation">
      <div className="navigation__container">
        <Link to="/">
          <div className="logo-wrapper">
            <img src={ElysiaLogo} className="elysia-logo" alt="Elysia_Logo" />
            <img src={ElysiaLogoBeta} className="elysia-logo-beta" alt="beta" />
          </div>
        </Link>
        <div className="navigation__link-wrapper">
          <Link to="/">
            <div className="navigation__link__wrapper">
              <p className="navigation__link" 
                onMouseEnter={() => setHover(1)}
                onMouseLeave={() => setHover(0)}
              >
                Dashboard
                <div className={`navigation__link__under-line${hover === 1 ? " hover" : " blur"}`} />
              </p>
            </div>
          </Link>
          <Link to="/portfolio">
            <div className="navigation__link__wrapper">
              <p className="navigation__link" 
                onMouseEnter={() => setHover(2)}
                onMouseLeave={() => setHover(0)}
              >
                Money Pool’s portfolio
                <div className={`navigation__link__under-line${hover === 2 ? " hover" : " blur"}`} />
              </p>
            </div>
          </Link>
          <a href='https://elyfi-docs.elysia.land'>
            <div className="navigation__link__wrapper">
              <p className="navigation__link" 
                onMouseEnter={() => setHover(3)}
                onMouseLeave={() => setHover(0)}
              >
                Linkage Institutions
                <div className={`navigation__link__under-line${hover === 3 ? " hover" : " blur"}`} />
              </p>
            </div>
          </a>
          {window.ethereum?.isMetaMask ? <Wallet triedEager={triedEager}/> : <InstallMetamask />}
        </div>
      </div>
      {userType === UserType.Borrowers 
        ? 
        <BorrowerPage />
        : userType === UserType.Collateral
          ?
          <CollateralPage />
          :
          ""
       }
    </nav>
  );
}

export default Navigation;