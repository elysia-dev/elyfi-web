import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useParams } from 'react-router-dom';
import ElysiaLogo from 'src/assets/images/Elysia_Logo.png';
import { useTranslation } from 'react-i18next';
import NavigationType from 'src/enums/NavigationType';
import InstallMetamask from './InstallMetamask';
import Wallet from './Wallet';

const Navigation = () => {
  const [hover, setHover] = useState(0);
  const [showLocalNavigation, setLocalNavigation] = useState(0);
  const [isLocalNavigationShowing, setLocalNavigationShowing] = useState(false);
  const { t } = useTranslation();
  const { lng } = useParams<{ lng: string }>();
  const location = useLocation();
  const navigationRef = useRef<HTMLDivElement>(null);
  const localNavigationRef = useRef<HTMLDivElement>(null);

  const [scrolling, setScrolling] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);

  const initialState = () => {
    setLocalNavigationShowing(false);
    setLocalNavigation(0)
    setHover(0)
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent): void {
      if (navigationRef.current && !navigationRef.current.contains(e.target as Node)) {
        initialState()
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [])

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

  const setMediaQueryMetamask = (ref: "mobile" | "pc") => {
    return (
      <div className={`navigation__wallet__container ${ref === "mobile" ? "mobile-only" : "pc-only"}`}>
        {window.ethereum?.isMetaMask ? <Wallet /> : <InstallMetamask />}
      </div>
    )
  }

  const setNavigation = (data: any, index: number) => {
    const innerNavigationContainer = () => {
      return (
        <div className="navigation__link__wrapper">
          <div
            className="navigation__link"
            onMouseEnter={() => setHover(index + 1)}
          >
            {data[2].toUpperCase()}
            <NavLink
              to={data[1]}
              className={`navigation__link__under-line${
                (hover || showLocalNavigation) === index + 1 ? ' hover' : ' blur'
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
      return (
        <div 
          onClick={() => {
            setLocalNavigationShowing(true)
            setLocalNavigation(index + 1)
          }}
          onMouseEnter={() => {
            isLocalNavigationShowing ? null : setLocalNavigation(index + 1)
          }}
        >
          {innerNavigationContainer()}
        </div>
      )
    }
    const hrefNavigation = () => {
      return (
        <a 
          href={data[1]} 
          target="_blank"
          onMouseEnter={() => {
            isLocalNavigationShowing ? null : setLocalNavigation(0)
          }}
        >
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
          exact
          onMouseEnter={() => {
            isLocalNavigationShowing ? null : setLocalNavigation(0)
          }}
          onClick={() => {
            setLocalNavigationShowing(false)
            setLocalNavigation(0)
          }}>
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
      [NavigationType.LNB,  '', "Docs"],
      [NavigationType.Link, `/${lng}/guide`, "Guide"],
      [NavigationType.Href, `https://info.uniswap.org/#/pools/0xbde484db131bd2ae80e44a57f865c1dfebb7e31f`, "Uniswap(ELFI)"]
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

  const localNavigation = () => {
    const stakingArray = [
      [`/${lng}/staking/EL`, t('navigation.ELStake')],
      [`/${lng}/staking/ELFI`, t('navigation.ELFIStake')],
      [`/${lng}/staking/LP`, t('staking.token_staking', { stakedToken: 'LP' })]
    ]
    const docsArray = [
      [`https://elysia.gitbook.io/elysia.finance/`, "ELYFI Docs"],
      [`/${lng}/governance`, "Governance FAQ"]
    ]
    const [boldIndex, setBoldIndex] = useState(0)
    const linkLocalNavigation = (data: string[], index: number) => {
      return (
        <NavLink
          to={data[0]}
          exact
          onMouseEnter={() => {
            setBoldIndex(index + 1)
          }}
          onMouseLeave={() => {
            setBoldIndex(0)
          }}
          onClick={() => {
            setLocalNavigationShowing(false)
            setLocalNavigation(0)
          }}>
          <p className={`${index + 1 === boldIndex ? "bold" : ""}`}>
            {data[1].toUpperCase()}
          </p>
        </NavLink>
      )
    }
    const hrefLocalNavigation = (data: string[], index: number) => {
      return (
        <a 
          href={data[0]} 
          target="_blank" 
          onMouseEnter={() => {
            setBoldIndex(index + 1)
          }}
          onMouseLeave={() => {
            setBoldIndex(0)
          }}
          onClick={() => {
            initialState()
          }}
        >
          <p className={`${index + 1 === boldIndex ? "bold" : ""}`}>
            {data[1].toUpperCase()}
          </p>
        </a>
      )
    }
    return (
      <div className="navigation__bottom" 
        ref={localNavigationRef}
        style={{
          backgroundColor: scrollTop > 125 ? '#10101077' : '#000000',
          display: (showLocalNavigation || isLocalNavigationShowing) ? "flex" : "none"
        }}
      >
        {
          (showLocalNavigation === 3 ? stakingArray :
          showLocalNavigation === 4 ? docsArray : [])
          .map((data, index) => {
            return (
              showLocalNavigation === 3 ? linkLocalNavigation(data, index) :
              showLocalNavigation === 4 ? hrefLocalNavigation(data, index) : undefined
            )
          })
        }
      </div>
    )
  }

  return (
    <>
      <nav
        className="navigation"
        style={{ backgroundColor: scrollTop > 125 ? '#10101077' : '#101010' }}
        ref={navigationRef}  
        onMouseLeave={() => {
          setHover(0)
          isLocalNavigationShowing ? null : setLocalNavigation(0)
        }}
      >
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
        {localNavigation()}
      </nav>
    </>
  );
};

export default Navigation;
