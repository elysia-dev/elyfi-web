import Twitter from 'src/assets/images/footer/twitter.svg';
import Telegram from 'src/assets/images/footer/telegram.svg';
import Github from 'src/assets/images/footer/github.svg';
import Discord from 'src/assets/images/footer/discord.svg';
import LazyImage from 'src/utiles/lazyImage';
import { lazy, Suspense, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

const LanguageConverter = lazy(
  () => import('src/components/Footer/LanguageConverter'),
);

const Footer = (): JSX.Element => {
  const location = useLocation();
  const currentPage = useMemo(() => {
    return location.pathname.split('/')[3] === 'EL';
  }, [location]);

  return (
    <Suspense fallback={null}>
      <footer
        className="footer"
        style={{
          backgroundColor: currentPage
            ? 'rgba(247, 251, 255, 1)'
            : 'transparent',
        }}>
        <div>
          <div className="footer__right-container">
            <LanguageConverter />
            <div className="footer__link">
              {[
                [Twitter, 'https://twitter.com/Elysia_HQ'],
                [Telegram, 'https://t.me/elysia_official'],
                [Github, 'https://github.com/elysia-dev'],
                [Discord, 'https://discord.gg/d8zveNum7g'],
              ].map((data, index) => {
                return (
                  <a key={`footer_${index}`} href={data[1]}>
                    <LazyImage src={data[0]} name="logo-icons" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
        <h2>ⓒ 2021·2022 | ELYFI | All rights reserved.</h2>
      </footer>
    </Suspense>
  );
};

export default Footer;
