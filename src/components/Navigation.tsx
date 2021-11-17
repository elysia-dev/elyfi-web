import { useState, useEffect } from 'react';
import { Link, NavLink, useParams } from 'react-router-dom';
import ElysiaLogo from 'src/assets/images/Elysia_Logo.png';
import { useTranslation } from 'react-i18next';
import InstallMetamask from './InstallMetamask';
import Wallet from './Wallet';

const Navigation = () => {
  const [hover, setHover] = useState(0);
  const { t } = useTranslation();
  const { lng } = useParams<{ lng: string }>();

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

  const navigationLink = () => {
    const navigationLinkArray = [
      ['/', t('navigation.deposit_withdraw')],
      [`/${lng}/governance`, "거버넌스"],
      [`/${lng}/staking/EL`, t('navigation.ELStake')],
      [`/${lng}/staking/ELFI`, t('navigation.ELFIStake')],
      [`/${lng}/staking/LP`, t('staking.token_staking', { stakedToken: 'LP' })]
    ]
    return (
      <div className="navigation__link__container">
        {navigationLinkArray.map((data, index) => {
          return (
            <NavLink
              to={data[0]}
              key={index}
              activeClassName="bold"
              exact>
              <div className="navigation__link__wrapper">
                <div
                  className="navigation__link"
                  onMouseEnter={() => setHover(index + 1)}
                  onMouseLeave={() => setHover(0)}>
                  {data[1].toUpperCase()}
                  <NavLink
                    to={data[0]}
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
            </NavLink>
          );
        })}
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
              <div className="navigation__wallet__container mobile-only">
                {window.ethereum?.isMetaMask ? <Wallet /> : <InstallMetamask />}
              </div>
            </div>
            {navigationLink()}
          </div>
          <div className="navigation__wallet__container pc-only">
            {window.ethereum?.isMetaMask ? <Wallet /> : <InstallMetamask />}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;
