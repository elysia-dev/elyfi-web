import {
  useState,
  useEffect,
  useRef,
  useMemo,
  useContext,
  lazy,
  Suspense,
} from 'react';
import { Link, Outlet, useLocation, useParams } from 'react-router-dom';
import ElysiaLogo from 'src/assets/images/ELYFI_logo.svg';
import NavigationType from 'src/enums/NavigationType';
import {
  INavigation,
  ISubNavigation,
  navigationLink,
} from 'src/core/data/navigationLink';
import { useTranslation } from 'react-i18next';
import useSWR from 'swr';
import { BigNumber, constants } from 'ethers';
import envs from 'src/core/envs';
import ExternalLinkImage from 'src/assets/images/external_link.svg';
import logo_1st from 'src/assets/images/logo_1st.svg';
import TxStatus from 'src/enums/TxStatus';
import TxContext from 'src/contexts/TxContext';
import LanguageContext from 'src/contexts/LanguageContext';
import LanguageType from 'src/enums/LanguageType';
import reactGA from 'react-ga';
import Skeleton from 'react-loading-skeleton';
import PageEventType from 'src/enums/PageEventType';
import ButtonEventType from 'src/enums/ButtonEventType';

import useMediaQueryType from 'src/hooks/useMediaQueryType';
import MediaQuery from 'src/enums/MediaQuery';
import useCurrentRoute from 'src/hooks/useCurrnetRoute';
import useReserveData from 'src/hooks/useReserveData';

import Footer from 'src/components/Footer';
import { depositInfoFetcher } from 'src/clients/BalancesFetcher';
import { toPercent } from 'src/utiles/formatters';
import { reserveTokenData } from 'src/core/data/reserves';
import { pricesFetcher } from 'src/clients/Coingecko';
import priceMiddleware from 'src/middleware/priceMiddleware';
import Token from 'src/enums/Token';
import TokenColors from 'src/enums/TokenColors';
import useCalcMiningAPR from 'src/hooks/useCalcMiningAPR';
import ErrorModal from '../Modal/ErrorModal';

const LazyImage = lazy(() => import('src/utiles/lazyImage'));
const MainnetSwitch = lazy(
  () => import('src/components/Navigation/MainnetSwitch'),
);
const Wallet = lazy(() => import('src/components/Navigation/Wallet'));

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
  const { data: depositInfo } = useSWR(
    [{ eth: envs.dataPipeline.eth, bsc: envs.dataPipeline.bsc }],
    {
      fetcher: depositInfoFetcher(),
    },
  );
  const { data: priceData } = useSWR(
    envs.externalApiEndpoint.coingackoURL,
    pricesFetcher,
    {
      use: [priceMiddleware],
    },
  );

  // Type.LNB Dropdown Nav Seleted
  const [selectedLocalNavIndex, setSelectedLocalNavIndex] = useState(0);
  const { calcMiningAPR } = useCalcMiningAPR();

  const navigationRef = useRef<HTMLDivElement>(null);
  const localNavigationRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const { txStatus, error } = useContext(TxContext);
  const { lng } = useParams<{ lng: string }>();
  const { value: mediaQuery } = useMediaQueryType();
  const currentRoute = useCurrentRoute();
  const headerAPR = useRef<HTMLDivElement>(null);

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

  const tokens: {
    name: Token.BUSD | Token.DAI | Token.USDT | Token.USDC;
    color: string;
  }[] = [
    { name: Token.DAI, color: TokenColors.DAI },
    { name: Token.USDT, color: TokenColors.USDT },
    { name: Token.USDC, color: TokenColors.USDC },
    { name: Token.BUSD, color: TokenColors.BUSD },
  ];

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

  useEffect(() => {
    if (mediaQuery !== MediaQuery.Mobile || !headerAPR.current || !depositInfo)
      return;
    let a = 0;
    const animation = () => {
      if (!headerAPR.current) return;
      if (a < -200) {
        a = 100;
      }
      headerAPR.current.style.transform = `translateX(${a}%)`;
      a += -0.3;
      requestAnimationFrame(animation);
    };

    if (mediaQuery !== MediaQuery.Mobile) {
      headerAPR.current.style.transform = `translateX(0%)`;
      return;
    }
    animation();
  }, [headerAPR.current, depositInfo, mediaQuery]);

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
      <>
        {isExternalLink ? (
          <a
            key={`nav_${index}`}
            href={t(_data.location)}
            target="_blank"
            onMouseEnter={() => {
              setSelectedLocalNavIndex(0);
            }}
            onClick={() => {
              initialNavigationState();
            }}
            className="navigation__bottom__link">
            <div className="navigation__link">
              <p>{t(_data.i18nKeyword).toUpperCase()}</p>
              <img src={ExternalLinkImage} />
            </div>
          </a>
        ) : (
          <Link
            key={`nav_${index}`}
            to={{
              pathname: `/${lng + _data.location}`,
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
            </div>
          </Link>
        )}
      </>
    );
  };

  const globalNavInnerContainer = (
    _data: INavigation,
    _index: number,
    isExternalLink?: boolean,
  ) => {
    return (
      <div key={_index} className="navigation__link__wrapper">
        <div className="navigation__link">
          <p
            onMouseEnter={() => {
              setGlobalNavHover(_index + 1);
            }}
            className={_data.isBeta ? 'beta' : ''}
            style={{
              cursor: 'pointer',
              fontWeight: currentRoute === _index ? 'bold' : undefined,
            }}>
            {t(_data.i18nKeyword).toUpperCase()}
            {![
              'navigation.dashboard',
              'navigation.governance',
              'navigation.faq',
              'navigation.market',
            ].includes(_data.i18nKeyword.toLowerCase()) && (
              <span
                className="navigation__arrow"
                style={{
                  transform:
                    isBold(_index) && globalNavHover === _index + 1
                      ? `rotate(-45deg) translateX(-2px) translateY(2px)`
                      : `rotate(135deg)`,
                  borderWidth: currentRoute === _index ? '2px' : undefined,
                }}
              />
            )}
          </p>
          <div>
            <div
              className={`navigation__bottom ${
                isBold(_index) && globalNavHover === _index + 1
                  ? ''
                  : ' disabled'
              }`}
              ref={localNavigationRef}>
              {isExternalLink &&
                _data.subNavigation &&
                getLNBData
                  .filter((data) => {
                    return data.id === _data.id;
                  })
                  .map((__data) => {
                    return __data.subNavigation!.map((subData, index) => {
                      return localNavInnerContainer(
                        subData,
                        subData.type === NavigationType.Link ? false : true,
                        index,
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
          pathname: `/${lng + _data.location}`,
        }}
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

  const setExternalLink = (
    _data: INavigation | ISubNavigation,
    _index: number,
  ) => {
    return (
      <a
        key={_index}
        href={lng === 'en' ? `${_data.location}/en` : _data.location}
        target="_blank"
        rel="noopener noreferrer"
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
        {globalNavInnerContainer(_data as INavigation, _index)}
      </a>
    );
  };

  const setNavigationLink = () => {
    return (
      <div className="navigation__link__container">
        {navigationLink.map((data, index) => {
          if (data.type === NavigationType.ExternalLink) {
            return setExternalLink(data, index);
          }
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
        {navigationLink.map((data, index) => {
          return data.type === NavigationType.LNB ? (
            <>
              <div
                key={`hamburgerBar_${index}`}
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
                    return _data.type === NavigationType.Link ? (
                      <Link
                        key={`hamburgerBar_${index}`}
                        to={{
                          pathname: `/${lng + _data.location}`,
                        }}
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
                    ) : (
                      <a
                        key={`hamburgerBar_${index}`}
                        href={t(_data.location)}
                        target="_blank"
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
                      </a>
                    );
                  })}
                </div>
              </div>
            </>
          ) : data.type === NavigationType.ExternalLink ? (
            <a
              key={`hamburgerBar_${index}`}
              href={t(data.location)}
              target="_blank"
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
                <p>{t(data.i18nKeyword).toUpperCase()}</p>
              </div>
            </a>
          ) : (
            <Link
              key={`hamburgerBar_${index}`}
              to={{
                pathname: `/${lng + data.location}`,
              }}
              onClick={() => {
                setHamburgerBar(false);
              }}>
              <div className={data.isBeta ? 'mobile-beta' : ''}>
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
      {txStatus === TxStatus.FAIL &&
        error &&
        error !==
          'MetaMask Tx Signature: User denied transaction signature.' && (
          <ErrorModal error={error} />
        )}
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
        <Suspense
          fallback={
            <div
              style={{
                height: mediaQuery === MediaQuery.PC ? 100 : 60,
                borderBottom: '1px solid #f0f0f1',
              }}
            />
          }>
          <header className="navigation__apy">
            <div ref={headerAPR}>
              {tokens.map((token) => {
                return (
                  <>
                    <h3
                      style={{
                        color: token.color,
                      }}>
                      {token.name} :
                    </h3>
                    <p>
                      &nbsp;
                      {depositInfo ? (
                        toPercent(
                          depositInfo?.find(
                            (info) =>
                              info.tokenName ===
                              reserveTokenData[token.name].name,
                          )?.depositAPY || constants.Zero,
                        )
                      ) : (
                        <Skeleton width={40} height-={40} />
                      )}{' '}
                      ({t('navigation.mining')} :
                      {depositInfo ? (
                        toPercent(
                          calcMiningAPR(
                            priceData?.elfiPrice || 0,
                            BigNumber.from(
                              depositInfo?.find(
                                (info) =>
                                  info.tokenName ===
                                  reserveTokenData[token.name].name,
                              )?.totalLTokenSupply || constants.Zero,
                            ),
                            reserveTokenData[token.name].decimals,
                          ) || constants.Zero,
                        )
                      ) : (
                        <Skeleton width={40} height-={40} />
                      )}
                      )
                    </p>
                  </>
                );
              })}
            </div>
          </header>
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
                    <LazyImage src={ElysiaLogo} name="elysia-logo" />
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
        </Suspense>
      </nav>
      <div className="navigation__margin" />
      <Outlet />
      <Footer />
    </>
  );
};

export default Navigation;
