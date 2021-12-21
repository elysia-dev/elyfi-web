import { useState, useEffect, useRef, useMemo, useContext } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import ElysiaLogo from 'src/assets/images/Elysia_Logo.png';
import NavigationType from 'src/enums/NavigationType';
import Wallet from 'src/components/Wallet';
import InstallMetamask from 'src/components/InstallMetamask';
import {
  INavigation,
  ISubNavigation,
  navigationLink,
} from 'src/core/data/navigationLink';
import { useTranslation } from 'react-i18next';
import ExternalLinkImage from 'src/assets/images/external_link.png';
import TxStatus from 'src/enums/TxStatus';
import TxContext from 'src/contexts/TxContext';
import ErrorModal from './ErrorModal';

const InitialNavigation: INavigation[] = [
  {
    id: 0,
    type: NavigationType.Link,
    location: '/',
    i18nKeyword: '',
  },
];

const Navigation: React.FunctionComponent<{
  hamburgerBar: boolean;
  setHamburgerBar: (value: React.SetStateAction<boolean>) => void;
}> = ({ hamburgerBar, setHamburgerBar }) => {
  // Hover Value
  const [globalNavHover, setGlobalNavHover] = useState(0);

  // Type.LNB Dropdown Nav Seleted
  const [selectedLocalNavIndex, setSelectedLocalNavIndex] = useState(0);

  const navigationRef = useRef<HTMLDivElement>(null);
  const localNavigationRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const { txStatus, error } = useContext(TxContext);
  const { lng } = useParams<{ lng: string }>();

  const location = useLocation();

  const [scrolling, setScrolling] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);

  const getLNBData = navigationLink.filter(
    (nav) => nav.type === NavigationType.LNB,
  );

  const currentPage = useMemo(() => {
    const getPath = navigationLink.filter(
      (nav) => location.pathname.split('/')[2] === nav.location.split('/')[1],
    );
    return getPath.length === 0 ? InitialNavigation : getPath;
  }, [location]);

  const getHoveredLNBData = useMemo(() => {
    return getLNBData.filter((subNav) => subNav.id === globalNavHover);
  }, [globalNavHover]);

  const isBold = (_index: number) => {
    return currentPage[0].id === _index + 1
      ? true
      : (globalNavHover || selectedLocalNavIndex) === _index + 1
      ? true
      : false;
  };

  function setScrollTrigger() {
    function onScroll() {
      const currentPosition = window.pageYOffset;

      currentPosition > scrollTop ? setScrolling(false) : setScrolling(true);
      setScrollTop(currentPosition <= 0 ? 0 : currentPosition);
    }
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }

  const initialNavigationState = () => {
    setSelectedLocalNavIndex(0);
    setGlobalNavHover(0);
  };

  const setMediaQueryMetamask = (ref: 'mobile' | 'pc') => {
    return (
      <div
        className={`navigation__wallet__container ${
          ref === 'mobile' ? 'mobile-only' : 'pc-only'
        }`}
        onMouseEnter={() => {
          setGlobalNavHover(0);
          setSelectedLocalNavIndex(0);
        }}>
        {window.ethereum?.isMetaMask ? <Wallet /> : <InstallMetamask />}
      </div>
    );
  };

  const localNavInnerContainer = (
    _data: ISubNavigation,
    isExternalLink: boolean,
  ) => {
    return (
      <Link
        to={{
          pathname: !isExternalLink
            ? `/${lng + _data.location}`
            : _data.location,
        }}
        target={isExternalLink ? '_blank' : undefined}
        onMouseEnter={() => {
          setSelectedLocalNavIndex(0);
        }}
        onClick={() => {
          initialNavigationState();
        }}
        className="navigation__bottom__link">
        <div className="navigation__link">
          <p>{t(_data.i18nKeyword).toUpperCase()}</p>
          {isExternalLink && <img src={ExternalLinkImage} />}
        </div>
      </Link>
    );
  };

  const globalNavInnerContainer = (_data: INavigation, _index: number) => {
    return (
      <div className="navigation__link__wrapper">
        <div
          className="navigation__link"
          onMouseEnter={() => {
            setGlobalNavHover(_index + 1);
          }}
          style={{
            color: scrollTop > 125 ? '#000000' : '#000000',
          }}>
          {t(_data.i18nKeyword).toUpperCase()}
          <div
            className={`navigation__link__under-line${
              isBold(_index) ? ' hover' : ' blur'
            }`}
            style={{
              opacity: isBold(_index) ? 1 : 0,
              width: isBold(_index) ? '100%' : 0,
              left: isBold(_index) ? 0 : -20,
            }}>
            <div
              className="navigation__bottom"
              ref={localNavigationRef}
              style={{
                backgroundColor:
                  scrollTop > 125
                    ? '#FFFFFF'
                    : // 'transparent',
                      '#FFFFFF',
                display:
                  isBold(_index) && globalNavHover === _index + 1
                    ? 'flex'
                    : 'none',
                borderTop:
                  scrollTop > 125 ? '1px solid #e6e6e6' : '1px solid #e6e6e6',
                borderBottom:
                  scrollTop > 125 ? '1px solid #e6e6e6' : '1px solid #e6e6e6',
              }}>
              {getHoveredLNBData.map((getData) => {
                return getData.subNavigation!.map((subData) => {
                  return localNavInnerContainer(
                    subData,
                    subData.type === NavigationType.Link ? false : true,
                  );
                });
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const linkNavigation = (
    _data: INavigation | ISubNavigation,
    _index: number,
    isExternalLink?: boolean,
  ) => {
    return (
      <Link
        to={!isExternalLink ? `/${lng + _data.location}` : _data.location}
        target={isExternalLink ? '_blank' : undefined}
        onMouseEnter={() => {
          setGlobalNavHover(_index + 1);

          setSelectedLocalNavIndex(0);
        }}
        onClick={() => {
          initialNavigationState();
        }}>
        {globalNavInnerContainer(_data as INavigation, _index)}
      </Link>
    );
  };

  const setNavigation = (data: INavigation, index: number) => {
    const LNBNavigation = () => {
      return (
        <div
          onMouseEnter={() => {
            setSelectedLocalNavIndex(index + 1);
          }}>
          {globalNavInnerContainer(data, index)}
        </div>
      );
    };

    return data.type === NavigationType.Link
      ? linkNavigation(data, index, false)
      : data.type === NavigationType.Href
      ? linkNavigation(data, index, true)
      : LNBNavigation();
  };

  const setNavigationLink = () => {
    return (
      <div className="navigation__link__container">
        {navigationLink.map((data, index) => {
          return setNavigation(data, index);
        })}
      </div>
    );
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent): void {
      if (
        navigationRef.current &&
        !navigationRef.current.contains(e.target as Node)
      ) {
        initialNavigationState();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setScrollTrigger();
  }, [scrollTop]);
  return (
    <>
      {txStatus === TxStatus.FAIL && error && <ErrorModal error={error} />}
      <nav
        className={`navigation`}
        style={{
          backgroundColor: scrollTop > 125 ? '#FFFFFF' : '#FFFFFF',
          height: hamburgerBar ? '100vh' : 'auto',
        }}
        ref={navigationRef}
        onMouseLeave={() => {
          setGlobalNavHover(0);
          setSelectedLocalNavIndex(0);
        }}>
        <div className="navigation__container">
          <div className="navigation__wrapper">
            <div>
              <Link
                to={`/${lng}`}
                onMouseEnter={() => {
                  setGlobalNavHover(0);
                  setSelectedLocalNavIndex(0);
                }}>
                <div className="logo-wrapper" style={{ cursor: 'pointer' }}>
                  <img
                    src={ElysiaLogo}
                    className="elysia-logo"
                    alt="Elysia_Logo"
                  />
                </div>
              </Link>
            </div>
            {setNavigationLink()}
            <div
              className={`navigation__hamburger ${
                hamburgerBar && 'active'
              } mobile-only`}
              onClick={() => {
                setHamburgerBar(!hamburgerBar);
              }}>
              <i />
              <i />
              <i />
            </div>
          </div>
          {setMediaQueryMetamask('pc')}
        </div>
        {hamburgerBar &&
          navigationLink.map((data) => {
            return (
              <div>
                <p>{data.i18nKeyword}</p>
              </div>
            );
          })}
      </nav>
      <div className="navigation__margin" />
    </>
  );
};

export default Navigation;
