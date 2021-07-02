import { FunctionComponent, useState } from 'react';
import { Link, useLocation } from 'react-router-dom'
import ElysiaLogo from 'src/assets/images/Elysia_Logo.png';
import ElysiaLogoBeta from 'src/assets/images/Elysia_Logo_Beta.png';
import InstallMetamask from './InstallMetamask';
import Wallet from './Wallet';
import { useEagerConnect } from 'src/hooks/connectHoots';
import { useWeb3React } from '@web3-react/core';
import { faucetTestERC20 } from 'src/utiles/contractHelpers';

// TODO
// Use NavLink for ActiveClass
const Navigation: FunctionComponent = () => {
  const triedEager = useEagerConnect()
  const [hover, setHover] = useState(0);
  const location = useLocation();
  const { library, account, chainId } = useWeb3React();

  return (
    <nav className="navigation">
      <div className="navigation__alert">
        <p>
          This website is an <span className="bold" style={{ color: "#00A7FF" }}>ELYFI beta version. </span>
          Please connect to the Kovan network, and you can get some test tokens by &nbsp;
          <span
            style={{
              color: "#00A7FF",
              textDecoration: "underline",
              cursor: "pointer"
            }}
            onClick={() => {
              if (account && chainId?.toString() === process.env.REACT_APP_REQUIRED_CHAIN_ID) {
                faucetTestERC20(account, library)
              } else {
                alert("Please connet to the Kovan network")
              }
            }}
          >
            creating a transaction!
          </span>
        </p>
      </div>
      <div className="navigation__container">
        <Link to="/">
          <div className="logo-wrapper" style={{ cursor: "pointer" }}>
            <img src={ElysiaLogo} className="elysia-logo" alt="Elysia_Logo" />
            <img src={ElysiaLogoBeta} className="elysia-logo-beta" alt="beta" />
          </div>
        </Link>
        <div className="navigation__link-wrapper">
          {
            [
              ["/dashboard", "DASHBOARD"],
              ["/portfolio", "PORTFOLIO"],
              ["/linkage_institution", "PARTNERS"]
            ].map((data, index) => {
              return (
                <Link to={data[0]} key={index}>
                  <div className="navigation__link__wrapper">
                    <div className={`navigation__link${location.pathname === data[0] ? " bold" : ""}`}
                      onMouseEnter={() => setHover(index + 1)}
                      onMouseLeave={() => setHover(0)}
                    >
                      {data[1]}
                      <div className={`navigation__link__under-line${hover === index + 1 ? " hover" : " blur"}`}
                        style={{
                          opacity: location.pathname === data[0] ? 1 : 0,
                          width: location.pathname === data[0] ? "100%" : 0,
                          left: location.pathname === data[0] ? 0 : -20
                        }}
                      />
                    </div>
                  </div>
                </Link>
              )
            })
          }
          {window.ethereum?.isMetaMask ? <Wallet triedEager={triedEager} /> : <InstallMetamask />}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;