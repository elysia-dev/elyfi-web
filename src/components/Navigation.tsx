import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useParams } from 'react-router-dom';
import ElysiaLogo from 'src/assets/images/Elysia_Logo.png';
import { useTranslation } from 'react-i18next';
import NavigationType from 'src/enums/NavigationType';
import InstallMetamask from './InstallMetamask';
import Wallet from './Wallet';

const Navigation = () => {
  const [hover, setHover] = useState(0);
  const { t } = useTranslation();
  const { lng } = useParams<{ lng: string }>();
  const location = useLocation();

  const [scrolling, setScrolling] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);

  function setScrollTrigger () {
    function onScroll() {
      const currentPosition = window.pageYOffset;

      (currentPosition > scrollTop) ? 
        setScrolling(false) 
        : 
        setScrolling(true)

      setScrollTop(currentPosition <= 0 ? 0 : currentPosition);
    }
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }

  useEffect(() => {
    setScrollTrigger()
  }, [scrollTop]);

  

  const setNavigation = (data: string[], index: number) => {
    const innerNavigationContainer = () => {
      return (
        <div className="navigation__link__wrapper">
          <div
            className="navigation__link"
            onMouseEnter={() => setHover(index + 1)}
            onMouseLeave={() => setHover(0)}>
            {data[2].toUpperCase()}
            <NavLink
              to={data[1]}
              className={`navigation__link__under-line${
                hover === index + 1 ? ' hover' : ' blur'
              }`}
              style={{
                opacity: 0,
                width: 0,
                left: -20,
              }}
              activeStyle={{
                opacity: 1,
                width: '100%',
                left: 0,
              }}
              exact
            />
          </div>
        </div>
      )
    }
    const LNBNavigation = () => {
      const [clicked, setClick] = useState(false);

      return (
        <div onClick={() => setClick(!clicked)}>
          {innerNavigationContainer()}
        </div>
      )
    }
    const hrefNavigation = () => {
      return (
        <a href={data[1]}>
          {innerNavigationContainer()}
        </a>
      )
    }
    const linkNavigation = () => {
      return (
        <NavLink
          to={data[1]}
          key={index}
          activeClassName="bold"
          exact>
          {innerNavigationContainer()}
        </NavLink>
      )
    }
    return (
      data[0] === NavigationType.Link ?
      linkNavigation() :
      data[0] === NavigationType.Href ?
      hrefNavigation() :
      LNBNavigation()
    )
  }
  
  const navigationLink = () => {
    const navigationLinkArray = [
      [NavigationType.Link, `/${lng}/dashboard`, "Deposit"],
      [NavigationType.Link, `/${lng}/governance`, "Governance"],
      [NavigationType.LNB,  `/${lng}/staking`, "Staking"],
      [NavigationType.LNB,  'https://elyfi.world', "Docs"],
      [NavigationType.Link, `/${lng}/guide`, "Guide"],
      [NavigationType.Href, `/`, "Uniswap(ELFI)"]
      
      // [`/${lng}/staking/EL`, t('navigation.ELStake')],
      // [`/${lng}/staking/ELFI`, t('navigation.ELFIStake')],
      // [`/${lng}/staking/LP`, t('staking.token_staking', { stakedToken: 'LP' })]
    ]
    
    return (
      <div className="navigation__link__container">
        {navigationLinkArray.map((data, index) => {
          return (
            setNavigation(data, index)
          );
        })}
      </div>
    )
  }

  
  
  const setMediaQueryMetamask = (ref: "mobile" | "pc") => {
    return (
      <div className={`navigation__wallet__container ${ref === "mobile" ? "mobile-only" : "pc-only"}`}>
        {window.ethereum?.isMetaMask ? <Wallet /> : <InstallMetamask />}
      </div>
    )
  }

  return (
    <>
      <nav
        className="navigation"
        style={{ backgroundColor: scrollTop > 125 ? '#10101077' : '#101010' }}>
        
        <div className="navigation__container">
          <div className="navigation__wrapper">
            <div>
              <Link to="/">
                <div className="logo-wrapper" style={{ cursor: 'pointer' }}>
                  <img
                    src={ElysiaLogo}
                    className="elysia-logo"
                    alt="Elysia_Logo"
                  />
                </div>
              </Link>
              {setMediaQueryMetamask("mobile")}
            </div>
            {navigationLink()}
          </div>
          {setMediaQueryMetamask("pc")}
        </div>
        <div className="navigation__bottom">
          123
        </div>
      </nav>
    </>
  );
};

export default Navigation;
