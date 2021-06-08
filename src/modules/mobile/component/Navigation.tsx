import { FunctionComponent, useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom'
import ElysiaLogo from '../../../shared/images/Elysia_Logo.png';
import ElysiaLogoBeta from '../../../shared/images/Elysia_Logo_Beta.png';
import '../css/styleM.scss';

const Navigation: FunctionComponent = () => {
  const location = useLocation();
  /* 현재 스크롤값을 실시간으로 계산해 상단 GNB를 변환시킬 함수입니다 */
  const [scrolling, setScrolling] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const [getHeight, setHeight] = useState(0);
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
    setHeight(document.getElementById('main')?.clientHeight!);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [scrollTop]);

  return (
    <nav className="navigation" style={{ backgroundColor: `${scrollTop >= 100 ? "#000030" : "transparent"}` }}> 
      <Link to="/">
        <div className="logo-wrapper">
          <img src={ElysiaLogo} className="elysia-logo" alt="Elysia_Logo" />
          <img src={ElysiaLogoBeta} className="elysia-logo-beta" alt="beta" />
        </div>
      </Link>
      <div className="navigation__link-wrapper">
        <Link to="/">
          <p className={"navigation__link"} style={{ fontFamily: location.pathname === "/" ? "Montserrat-bold" : "Montserrat" }}>
            MAIN
          </p>
        </Link>
        <Link to="/service">
          <p className="navigation__link" style={{ fontFamily: location.pathname === "/service" ? "Montserrat-bold" : "Montserrat" }}>
            APP
          </p>
        </Link>
        <a href='https://elyfi-docs.elysia.land'>
          <p className="navigation__link">
            DOCS
          </p>
        </a>
      </div>
    </nav>
  );
}

export default Navigation;