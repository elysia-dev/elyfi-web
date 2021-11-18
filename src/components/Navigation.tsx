import { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ElysiaLogo from 'src/assets/images/Elysia_Logo.png';
import NavigationType from 'src/enums/NavigationType';
import Wallet from 'src/components/Wallet';
import InstallMetamask from 'src/components/InstallMetamask';
import { INavigation, navigationLink } from 'src/core/data/navigationLink'
import { useTranslation } from 'react-i18next';


const Navigation = () => {
  const [hover, setHover] = useState(0);
  const [showLocalNavigation, setLocalNavigation] = useState(0);
  const [isLocalNavigationShowing, setLocalNavigationShowing] = useState(false);
  const navigationRef = useRef<HTMLDivElement>(null);
  const localNavigationRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  const location = useLocation();

  const [GNBBoldIndex, setGNBBoldIndex] = useState(0)

  const [LNBBoldIndex, setLNBBoldIndex] = useState(0)

  const [scrolling, setScrolling] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);

  const initialNavigationState = () => {
    setLocalNavigationShowing(false);
    setLocalNavigation(0)
    setHover(0)
    setGNBBoldIndex(0)
    setLNBBoldIndex(0)
  }
  const setMediaQueryMetamask = (ref: "mobile" | "pc") => {
    return (
      <div className={`navigation__wallet__container ${ref === "mobile" ? "mobile-only" : "pc-only"}`}>
        {window.ethereum?.isMetaMask ? <Wallet /> : <InstallMetamask />}
      </div>
    )
  }

  const currentPage = useMemo(() => {
    return navigationLink.filter(
      (nav) => location.pathname.split('/')[2] === nav.location.split('/')[1]
    )
  }, [location])

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

  const setNavigation = (data: INavigation, index: number) => {
    const innerNavigationContainer = (_data: INavigation, _index?: number) => {
      return (
        <div className="navigation__link__wrapper">
          <div
            className="navigation__link"
            onMouseEnter={() => setHover(index + 1)}
          >
            {t(_data.i18nKeyword).toUpperCase()}
            <div
              className={`navigation__link__under-line${
                (hover || showLocalNavigation) === index + 1 ? ' hover' : ' blur'
              }`}
              style={{
                opacity: (hover || showLocalNavigation) === index + 1 ? 1 : 0,
                width: (hover || showLocalNavigation) === index + 1 ? "100%" : 0,
                left: (hover || showLocalNavigation) === index + 1 ? 0 : -20,
              }}/>
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
          {innerNavigationContainer(data)}
        </div>
      )
    }
    const linkNavigation = (_data: INavigation, navPosition: "global" | "local", isExternalLink?: boolean) => {
      return (
        <a 
          href={_data.location}
          onMouseEnter={() => {
            navPosition === "global" ? setGNBBoldIndex(index + 1) : setLNBBoldIndex(index + 1)
            isLocalNavigationShowing ? null : setLocalNavigation(0)
          }}
          onMouseLeave={() => {
            
          }}
          onClick={() => {
            initialNavigationState()
          }}
        >
          {innerNavigationContainer(data)}
        </a>
      )
    }
    return (
      data.type === NavigationType.Link ?
      linkNavigation(data, "global", false) :
      data.type === NavigationType.Href ?
      linkNavigation(data, "global", true) :
      LNBNavigation()
    )
  }
  
  const setNavigationLink = () => {
    return (
      <div className="navigation__link__container">
        {navigationLink.map((data, index) => {
          return (
            setNavigation(data, index)
          );
        })}
      </div>
    )
  }

  const localNavigation = () => {
    // To do : 스테이킹 뒤 주소 값을 아예 파라미터로 넘겨주기
    const hrefLocalNavigation = (data: INavigation) => {
      return (
        <a 
          href={data.location}
          onMouseEnter={() => {
            // setBoldIndex(index + 1)
          }}
          onMouseLeave={() => {
            // setBoldIndex(0)
          }}
          onClick={() => {
            initialNavigationState()
          }}
        >
          <p className={`${data.id === 1 ? "bold" : ""}`}>
            {data.i18nKeyword.toUpperCase()}
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
          navigationLink.filter((nav) => 
            nav.type === NavigationType.LNB
          ).map((data) => {
            return (
              hrefLocalNavigation(data)
            )
          })
        }
      </div>
    )
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent): void {
      if (navigationRef.current && !navigationRef.current.contains(e.target as Node)) {
        initialNavigationState()
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [])
  
  useEffect(() => {
    setScrollTrigger()
  }, [scrollTop]);

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
            {setNavigationLink()}
          </div>
          {setMediaQueryMetamask("pc")}
        </div>
        {localNavigation()}
      </nav>
    </>
  );
};

export default Navigation;
