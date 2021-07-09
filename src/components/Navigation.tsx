import { FunctionComponent, useState } from 'react';
import { Link, useLocation } from 'react-router-dom'
import ElysiaLogo from 'src/assets/images/Elysia_Logo.png';
import ElysiaLogoBeta from 'src/assets/images/Elysia_Logo_Beta.png';
import InstallMetamask from './InstallMetamask';
import Wallet from './Wallet';
import { useEagerConnect } from 'src/hooks/connectHoots';
import { useTranslation } from 'react-i18next';
import { useWeb3React } from '@web3-react/core';
import { faucetTestERC20 } from 'src/utiles/contractHelpers';
import envs from 'src/core/envs';

// TODO
// Use NavLink for ActiveClass
const Navigation: FunctionComponent = () => {
  const triedEager = useEagerConnect()
  const [hover, setHover] = useState(0);
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { library, account, chainId } = useWeb3React();
  console.log(location.pathname.split('/')[1])
  return (
    <nav className="navigation">
      <div className="navigation__alert">
        <div className="navigation__alert__container">
          <p className="spoqa">
            This website is for <span className="spoqa__bold" style={{ color: "#00A7FF" }}>ELYFI beta version only. </span>
            Please connect to the {envs.requiredNetwork} network! You may get some test tokens&nbsp;
            <span
              className="spoqa__bold"
              style={{
                color: "#00A7FF",
                textDecoration: "underline",
                cursor: "pointer"
              }}
              onClick={() => {
                if (account && chainId === envs.requiredChainId) {
                  faucetTestERC20(account, library)
                } else {
                  alert(`Please connet to the ${envs.requiredNetwork} network`)
                }
              }}
            >
              here!
            </span>
          </p>
          <div className="navigation__alert__wrapper">
            <Link to="/bounty">
              <p className="bold">Bounty</p>
            </Link>
            <Link to="/guide">
              <p className="bold">Guide</p>
            </Link>
          </div>
        </div>
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
              ["/", t("navigation.dashboard")],
              ["/portfolio", t("navigation.portfolio")],
              ["/linkage_institution", t("navigation.partners")]
            ].map((data, index) => {
              return (
                <Link to={data[0]} key={index}>
                  <div className="navigation__link__wrapper">
                    <div className={`navigation__link${location.pathname.split('/')[1] === data[0].slice(1) ? " bold" : ""}`}
                      onMouseEnter={() => setHover(index + 1)}
                      onMouseLeave={() => setHover(0)}
                    >
                      {data[1]}
                      <div className={`navigation__link__under-line${hover === index + 1 ? " hover" : " blur"}`}
                        style={{
                          opacity: location.pathname.split('/')[1] === data[0].slice(1) ? 1 : 0,
                          width: location.pathname.split('/')[1] === data[0].slice(1) ? "100%" : 0,
                          left: location.pathname.split('/')[1] === data[0].slice(1) ? 0 : -20
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