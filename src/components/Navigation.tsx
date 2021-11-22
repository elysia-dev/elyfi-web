import { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import ElysiaLogo from 'src/assets/images/Elysia_Logo.png';
import NavigationType from 'src/enums/NavigationType';
import Wallet from 'src/components/Wallet';
import InstallMetamask from 'src/components/InstallMetamask';
import { INavigation, ISubNavigation, navigationLink } from 'src/core/data/navigationLink'
import { useTranslation } from 'react-i18next';

const InitialNavigation: INavigation[] = [
  {
    id: 0,
    type: NavigationType.Link,
    location: "/",
    i18nKeyword: ""
  }
]

const Navigation = () => {
  // Hover Value
  const [globalNavHover, setGlobalNavHover] = useState(0);
  const [localNavHover, setLocalNavHover] = useState(0);

  // Type.LNB Dropdown Nav Seleted
  const [selectedLocalNavIndex, setSelectedLocalNavIndex] = useState(0);
  const [isLocalNavPinned, setLocalNavPinned] = useState(false);

  const navigationRef = useRef<HTMLDivElement>(null);
  const localNavigationRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const { lng } = useParams<{ lng: string }>();

  const location = useLocation();

  const [scrolling, setScrolling] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);

  const initialNavigationState = () => {
    setLocalNavPinned(false);
    setSelectedLocalNavIndex(0)
    setGlobalNavHover(0)
    setLocalNavHover(0)
  }
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
  const setMediaQueryMetamask = (ref: "mobile" | "pc") => {
    return (
      <div className={`navigation__wallet__container ${ref === "mobile" ? "mobile-only" : "pc-only"}`} 
        onMouseEnter={() => {
          setGlobalNavHover(0)
          setLocalNavHover(0)
          isLocalNavPinned ? null : setSelectedLocalNavIndex(0)
        }}
      >
        {window.ethereum?.isMetaMask ? <Wallet /> : <InstallMetamask />}
      </div>
    )
  }

  const currentPage = useMemo(() => {
    const getPath = navigationLink.filter(
      (nav) => location.pathname.split('/')[2] === nav.location.split('/')[1]
    )
    return getPath.length === 0 ? 
      InitialNavigation : 
      getPath
  }, [location])

  const getLNBData = navigationLink.filter((nav) => nav.type === NavigationType.LNB);
  const getHoveredLNBData = useMemo(() => {
    return getLNBData.filter(
      (subNav) => subNav.id === globalNavHover
    )
  }, [globalNavHover])

  const isBold = (_index: number) => {
    return currentPage[0].id === _index + 1 ? true :
      (globalNavHover || selectedLocalNavIndex) === _index + 1 ? true : 
      false
  }

  const globalNavInnerContainer = (_data: INavigation, _index: number) => {
    return (
      <div className="navigation__link__wrapper">
        <div
          className="navigation__link"
          onMouseEnter={() => {
            setGlobalNavHover(_index + 1)
          }}
        >
          {t(_data.i18nKeyword).toUpperCase()}
          <div
            className={`navigation__link__under-line${isBold(_index) ? ' hover' : ' blur'
            }`}
            style={{
              opacity: isBold(_index) ? 1 : 0,
              width: isBold(_index) ? "100%" : 0,
              left: isBold(_index) ? 0 : -20,
            }}/>
        </div>
      </div>
    )
  }
  
  const getLocalCurrentPath = (_data: ISubNavigation, _index: number) => {
    if (localNavHover === _index + 1) return true;
    if (currentPage[0].subNavigation !== undefined) {
      const arr = currentPage[0].subNavigation.filter((subNav) => {
        return subNav.location === `/${location.pathname.split('/')[2]}/${location.pathname.split('/')[3]}`
      })
      return arr[0].location === _data.location ? true : 
      false
    } return false; 
  }
  const localNavInnerContainer = (_data: ISubNavigation, _index: number) => {
    return (
      <div className="navigation__link__wrapper">
        <div
          className="navigation__link"
          onMouseEnter={() => {
            setLocalNavHover(_index + 1)
          }}
        >
          {t(_data.i18nKeyword).toUpperCase()}
          <div
            className={`navigation__link__under-line${getLocalCurrentPath(_data, _index) ? ' hover' : ' blur'
            }`}
            style={{
              opacity: getLocalCurrentPath(_data, _index) ? 1 : 0,
              width: getLocalCurrentPath(_data, _index) ? "100%" : 0,
              left: getLocalCurrentPath(_data, _index) ? 0 : -20,
            }}/>
        </div>
      </div>
    )
  }

  const linkNavigation = (_data: INavigation | ISubNavigation, navPosition: "global" | "local", _index: number, isExternalLink?: boolean) => {
    return (
      <a 
        href={
          !isExternalLink ?
          `/${lng + _data.location}` :
          isExternalLink ?
          _data.location :
          undefined
        }
        target={
          isExternalLink ? "_blank" : undefined
        }
        onMouseEnter={() => {
          navPosition === "global" ? 
            setGlobalNavHover(_index + 1) : 
            setLocalNavHover(_index + 1)
          
          navPosition === "global" ?
            isLocalNavPinned ?
              null :
              setSelectedLocalNavIndex(0)
            :
            null
        }}
        onClick={() => {
          initialNavigationState()
        }}
      >
        {
          navPosition === "global" ? 
          globalNavInnerContainer(_data as INavigation, _index) :
          navPosition === "local" ?
          localNavInnerContainer(_data as ISubNavigation, _index) :
          undefined
        }
      </a>
    )
  }


  const setNavigation = (data: INavigation, index: number) => {
    const LNBNavigation = () => {
      return (
        <div 
          onClick={() => {
            setLocalNavPinned(true)
            setSelectedLocalNavIndex(index + 1)
          }}
          onMouseEnter={() => {
            setLocalNavHover(0);
            setSelectedLocalNavIndex(index + 1)
          }}
        >
          {globalNavInnerContainer(data, index)}
        </div>
      )
    }
    
    return (
      data.type === NavigationType.Link ?
      linkNavigation(data, "global", index, false) :
      data.type === NavigationType.Href ?
      linkNavigation(data, "global", index, true) :
      LNBNavigation()
    )
  }
  
  const setNavigationLink = () => {
    return (
      <div className="navigation__link__container pc-only tablet-only">
        {navigationLink.map((data, index) => {
          return (
            setNavigation(data, index)
          );
        })}
      </div>
    )
  }

  const localNavigation = () => {
    return (
      <div className="navigation__bottom" 
        ref={localNavigationRef}
        style={{
          backgroundColor: scrollTop > 125 ? '#10101077' : '#000000',
          display: (selectedLocalNavIndex || isLocalNavPinned) ? "flex" : "none"
        }}
      >
        {
          getHoveredLNBData.map((getData) => {
            return getData.subNavigation!.map((subData, index) => {
              return linkNavigation(subData, "local", index, false)
            })
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
          setGlobalNavHover(0)
          setLocalNavHover(0)
          isLocalNavPinned ? null : setSelectedLocalNavIndex(0)
        }}
      >
        <div className="navigation__container">
          <div className="navigation__wrapper">
            <div>
              <Link to={`/${lng}`} onMouseEnter={() => {
                setGlobalNavHover(0)
                setLocalNavHover(0)
                isLocalNavPinned ? null : setSelectedLocalNavIndex(0)
              }}>
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
