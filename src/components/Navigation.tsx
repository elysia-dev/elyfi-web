import { FunctionComponent, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom'
import ElysiaLogo from 'src/assets/images/Elysia_Logo.png';
import ElysiaLogoBeta from 'src/assets/images/Elysia_Logo_Beta.png';
import InstallMetamask from './InstallMetamask';
import Wallet from './Wallet';
import { useEagerConnect } from 'src/hooks/connectHoots';
import { useTranslation } from 'react-i18next';
// import { useWeb3React } from '@web3-react/core';
// import { faucetTestERC20 } from 'src/utiles/contractHelpers';
// import envs from 'src/core/envs';

// TODO
// Use NavLink for ActiveClass
const Navigation: FunctionComponent = () => {
  const triedEager = useEagerConnect()
  const [hover, setHover] = useState(0);
  const [innerHover, setInnerHover] = useState(0);
  const location = useLocation();
  const { t, i18n } = useTranslation();
  // const { library, account, chainId } = useWeb3React();

  const CheckLocation = (loc: string, index: number) => {
    if (location.pathname.split('/')[1] === loc) {
      return true;
    } else if (index === 0 && location.pathname.split('/')[1] === "staking") {
      return true;
    } else {
      return false
    }
  }

  const [scrolling, setScrolling] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);

  useEffect(() => {
    function onScroll() {
      let currentPosition = window.pageYOffset;
      if (currentPosition > scrollTop) {
        setScrolling(false);
      } else {
        setScrolling(true);
      }
      setScrollTop(currentPosition <= 0 ? 0 : currentPosition);
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [scrollTop]);

  return (
    <nav className="navigation" style={{ opacity: scrollTop > 125 ? 0.7 : 1 }}>
      {/* <div className="navigation__alert" style={{ height: scrollTop > 125 ? 0 : 40, top: scrollTop > 125 ? -40 : 0 }}>
        <div className="navigation__alert__container" style={{ height: scrollTop > 125 ? 0 : 40 }}>
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
      </div> */}
      <div className="navigation__container">
        <a href="https://defi.elysia.land/" rel="noopener noreferrer">
          <div className="logo-wrapper" style={{ cursor: "pointer" }}>
            <img src={ElysiaLogo} className="elysia-logo" alt="Elysia_Logo" />
          </div>
        </a>
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
                    <div className={`navigation__link${CheckLocation(data[0].slice(1), index) ? " bold" : ""}`}
                      onMouseEnter={() => setHover(index + 1)}
                      onMouseLeave={() => setHover(0)}
                    >
                      {data[1]}
                      <div className={`navigation__link__under-line${hover === index + 1 ? " hover" : " blur"}`}
                        style={{
                          opacity: CheckLocation(data[0].slice(1), index) ? 1 : 0,
                          width: CheckLocation(data[0].slice(1), index) ? "100%" : 0,
                          left: CheckLocation(data[0].slice(1), index) ? 0 : -20
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
      <div className="navigation__dashboard__container"
        style={{ display: hover === 1 ? "block" : "none" }}
        onMouseEnter={() => setHover(1)}
        onMouseLeave={() => setHover(0)}
      >
        <div className="navigation__dashboard__wrapper">
        {
          [
            ["/", "DEPOSIT / WITHDRAW"],
            ["/staking", "STAKING"]
          ].map((data, index) => {
            return (
              <Link to={data[0]} key={index}>
                <div className={`navigation__dashboard__link${location.pathname.split('/')[1] === data[0].slice(1) ? " bold" : ""}`}
                  onMouseEnter={() => setInnerHover(index + 1)}
                  onMouseLeave={() => setInnerHover(0)}
                >
                  {data[1]}
                  <div className={`navigation__link__under-line${innerHover === index + 1 ? " hover" : " blur"}`}
                    style={{
                      opacity: location.pathname.split('/')[1] === data[0].slice(1) ? 1 : 0,
                      width: location.pathname.split('/')[1] === data[0].slice(1) ? "100%" : 0,
                      left: location.pathname.split('/')[1] === data[0].slice(1) ? 0 : -20
                    }}
                  />
                </div>
              </Link>
            )
          })
        }
        </div>
      </div>
    </nav>
  );
}

export default Navigation;