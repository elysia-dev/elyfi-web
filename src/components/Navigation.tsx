import { FunctionComponent, useState } from 'react';
import { Link } from 'react-router-dom'
import ElysiaLogo from 'src/assets/images/Elysia_Logo.png';
import ElysiaLogoBeta from 'src/assets/images/Elysia_Logo_Beta.png';
import InstallMetamask from './InstallMetamask';
import Wallet from './Wallet';
import { useEagerConnect } from 'src/hooks/connectHoots';

// TODO
// Use NavLink for ActiveClass
const Navigation: FunctionComponent = () => {
  const triedEager = useEagerConnect()
  const [hover, setHover] = useState(0);

  return (
    <nav className="navigation">
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
              ["/dashboard", "Dashboard"],
              ["/portfolio", "Money Pools's portfolio"],
            ].map((data, index) => {
              return (
                <Link to={data[0]} key={index}>
                  <div className="navigation__link__wrapper">
                    <div className="navigation__link"
                      onMouseEnter={() => setHover(index + 1)}
                      onMouseLeave={() => setHover(0)}
                    >
                      {data[1]}
                      <div className={`navigation__link__under-line${hover === index + 1 ? " hover" : " blur"}`} />
                    </div>
                  </div>
                </Link>
              )
            })
          }
          <a href='https://elyfi-docs.elysia.land'>
            <div className="navigation__link__wrapper">
              <div className="navigation__link"
                onMouseEnter={() => setHover(4)}
                onMouseLeave={() => setHover(0)}
              >
                Linkage Institutions
                <div className={`navigation__link__under-line${hover === 4 ? " hover" : " blur"}`} />
              </div>
            </div>
          </a>
          {window.ethereum?.isMetaMask ? <Wallet triedEager={triedEager} /> : <InstallMetamask />}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;