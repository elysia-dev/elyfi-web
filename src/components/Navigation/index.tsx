import { useState, useEffect, useRef, useMemo, useContext } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import ElysiaLogo from 'src/assets/images/Elysia_Logo.png';
import NavigationType from 'src/enums/NavigationType';
import Wallet from 'src/components/Navigation/Wallet';
import {
  INavigation,
  ISubNavigation,
  navigationLink,
} from 'src/core/data/navigationLink';
import { useTranslation } from 'react-i18next';
import ExternalLinkImage from 'src/assets/images/external_link.png';
import TxStatus from 'src/enums/TxStatus';
import TxContext from 'src/contexts/TxContext';
import LanguageContext from 'src/contexts/LanguageContext';
import LanguageType from 'src/enums/LanguageType';
import reactGA from 'react-ga';
import PageEventType from 'src/enums/PageEventType';
import ButtonEventType from 'src/enums/ButtonEventType';

import useMediaQueryType from 'src/hooks/useMediaQueryType';
import MediaQuery from 'src/enums/MediaQuery';
import MainnetSwitch from 'src/components/Navigation/MainnetSwitch';

import ErrorModal from '../Modal/ErrorModal';

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
  const { value: mediaQuery } = useMediaQueryType();

  const location = useLocation();

  const [scrolling, setScrolling] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);

  const [mainNetwork, setMainNetwork] = useState(false);

  const getLNBData = navigationLink.filter(
    (nav) => nav.type === NavigationType.LNB,
  );

  const currentPage = useMemo(() => {
    const getPath = navigationLink.filter(
      (nav) => location.pathname.split('/')[2] === nav.location.split('/')[1],
    );
    return getPath.length === 0 ? InitialNavigation : getPath;
  }, [location]);


  const { setLanguage } = useContext(LanguageContext);

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
        <Wallet />
      </div>
    );
  };

  const localNavInnerContainer = (
    _data: ISubNavigation,
    isExternalLink: boolean,
    index: number,
  ) => {
    return (
      <Link
        key={`nav_${index}`}
        to={{
          pathname: !isExternalLink
            ? `/${lng + _data.location}`
            : t(_data.location),
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

  const globalNavInnerContainer = (
    _data: INavigation,
    _index: number,
    isExternalLink?: boolean,
  ) => {
    return (
      <div key={_index} className="navigation__link__wrapper">
        <div
          className="navigation__link"
          onMouseEnter={() => {
            setGlobalNavHover(_index + 1);
          }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <div
              style={{
                marginRight: 8,
              }}>
              <p style={{ cursor: 'pointer' }}>
                {t(_data.i18nKeyword).toUpperCase()}
              </p>
            </div>
            {!['navigation.dashboard', 'navigation.governance'].includes(
              _data.i18nKeyword.toLowerCase(),
            ) && <div className="navigation__arrow" style={{ transform: isBold(_index) && globalNavHover === _index + 1 ? `rotate(135deg)` : `rotate(-45deg) translateX(-2px) translateY(2px)`}} />}
          </div>
          <div>
            <div
              className={`navigation__bottom ${isBold(_index) && globalNavHover === _index + 1 ? "" : " disabled"}`}
              ref={localNavigationRef}
            >
              {isExternalLink &&
                _data.subNavigation && (
                  getLNBData.filter((data) => {
                    return data.id === _data.id
                  }).map((__data) => {
                    return __data.subNavigation!.map((subData, index) => {
                      return localNavInnerContainer(
                        subData,
                        subData.type === NavigationType.Link ? false : true,
                        index,
                      );
                    })
                  })
                )
              }
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
    return isExternalLink ? (
      <div
        key={`linkNavigation_${_index}`}
        onMouseEnter={() => {
          setGlobalNavHover(_index + 1);

          setSelectedLocalNavIndex(0);
        }}
        onClick={() => {
          if (_index === 0) {
            reactGA.event({
              category: PageEventType.MoveToInternalPage,
              action: ButtonEventType.DepositButtonOnTop,
            });
          }
        }}>
        {globalNavInnerContainer(_data as INavigation, _index, isExternalLink)}
      </div>
    ) : (
      <Link
        key={_index}
        to={{
          pathname:
            _data.type === NavigationType.Link
              ? `/${lng + _data.location}`
              : t(_data.location),
        }}
        target={isExternalLink ? '_blank' : undefined}
        onMouseEnter={() => {
          setGlobalNavHover(_index + 1);

          setSelectedLocalNavIndex(0);
        }}
        onClick={() => {
          if (_index === 0) {
            reactGA.event({
              category: PageEventType.MoveToInternalPage,
              action: ButtonEventType.DepositButtonOnTop,
            });
          }
          initialNavigationState();
        }}>
        {globalNavInnerContainer(_data as INavigation, _index)}
      </Link>
    );
  };

  const setNavigationLink = () => {
    return (
      <div className="navigation__link__container">
        {navigationLink.map((data, index) => {
          return data.type === NavigationType.Link
            ? linkNavigation(data, index, false)
            : linkNavigation(data, index, true);
        })}
      </div>
    );
  };

  const mobileHamburgerBar = () => {
    return (
      <div className="navigation__hamburger__content">
        {navigationLink.map((data) => {
          return data.type === NavigationType.LNB ? (
            <>
              <div
                className="navigation__hamburger__lnb"
                onClick={() => {
                  selectedLocalNavIndex === data.id
                    ? setSelectedLocalNavIndex(0)
                    : setSelectedLocalNavIndex(data.id);
                }}>
                <p>{t(data.i18nKeyword).toUpperCase()}</p>
                <div
                  style={{
                    transform:
                      selectedLocalNavIndex === data.id
                        ? `rotate(-45deg)`
                        : `rotate(135deg)`,
                    top: selectedLocalNavIndex === data.id ? 3 : -3,
                  }}
                />
              </div>
              <div
                className="navigation__hamburger__lnb__sub-navigation__container"
                style={{
                  display: selectedLocalNavIndex === data.id ? 'block' : 'none',
                }}>
                <div className="navigation__hamburger__lnb__sub-navigation__wrapper">
                  {data.subNavigation!.map((_data, index) => {
                    return (
                      <Link
                        key={`hamburgerBar_${index}`}
                        to={{
                          pathname:
                            _data.type === NavigationType.Link
                              ? `/${lng + _data.location}`
                              : t(_data.location),
                        }}
                        target={
                          _data.type === NavigationType.Href
                            ? '_blank'
                            : undefined
                        }
                        onClick={() => {
                          if (index === 0) {
                            reactGA.event({
                              category: PageEventType.MoveToInternalPage,
                              action: ButtonEventType.DepositButtonOnTop,
                            });
                          }
                          setHamburgerBar(false);
                        }}>
                        <div>
                          <p>{t(_data.i18nKeyword).toUpperCase()}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <Link
              to={{
                pathname: `/${lng + data.location}`,
              }}
              onClick={() => {
                setHamburgerBar(false);
              }}>
              <div>
                <p>{t(data.i18nKeyword).toUpperCase()}</p>
              </div>
            </Link>
          );
        })}
        <section className="navigation__hamburger__footer">
          <div className="navigation__hamburger__footer__lang">
            <p
              className={lng === LanguageType.KO ? `active` : ``}
              onClick={() => {
                setLanguage(LanguageType.KO);
              }}>
              KOR
            </p>
            <p
              className={lng === LanguageType.EN ? `active` : ``}
              onClick={() => {
                setLanguage(LanguageType.EN);
              }}>
              ENG
            </p>
          </div>
          <div>{setMediaQueryMetamask('mobile')}</div>
        </section>
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
        setMainNetwork(false);
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
      {txStatus === TxStatus.FAIL && error && error !== "MetaMask Tx Signature: User denied transaction signature." && <ErrorModal error={error} />}
      <nav
        className={`navigation`}
        style={{
          height: hamburgerBar ? '100%' : 'auto',
          overflowY:
            mediaQuery === MediaQuery.PC
              ? 'initial'
              : !mainNetwork
              ? 'scroll'
              : hamburgerBar
              ? 'scroll'
              : 'initial',
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
                  setHamburgerBar(false);
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
            {mediaQuery === MediaQuery.Mobile && (
              <MainnetSwitch
                mainNetwork={mainNetwork}
                setMainNetwork={setMainNetwork}
              />
            )}
            <div
              className={`navigation__hamburger__button ${
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
          <div className="navigation__mainnet">
            {mediaQuery === MediaQuery.PC && (
              <MainnetSwitch
                mainNetwork={mainNetwork}
                setMainNetwork={setMainNetwork}
              />
            )}
            {setMediaQueryMetamask('pc')}
          </div>
        </div>
        {hamburgerBar && mobileHamburgerBar()}
      </nav>
      <div className="navigation__margin" />
    </>
  );
};

export default Navigation;
