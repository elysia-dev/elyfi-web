import 'src/stylesheets/style.scss';
import WhiteLogo from 'src/assets/images/White-logo.svg';
import Twitter from 'src/assets/images/twitter.svg';
import Telegram from 'src/assets/images/telegram@2x.png';
import Github from 'src/assets/images/github@2x.png';
import LanguageConverter from './LanguageConverter';
import FooterBackgroundImg from 'src/assets/images/footer.png';

const Footer = () => {
  return (
    <footer className="footer" style={{ backgroundImage: `url(${FooterBackgroundImg})` }}>
      <div className="footer__container">
        <img className="footer__white-logo" src={WhiteLogo} alt="Elysia" />
        <div className="footer__wrapper">
          <LanguageConverter />
          <hr className="footer-line" style={{ borderColor: "#00A7FF", width: 0, height: 30 }} />
          <div className="footer__logo-wrapper">
            <a href='https://twitter.com/Elysia_HQ' target='_blank' rel="noopener noreferrer">
              <img className="footer-logo" src={Twitter} alt="Twitter" />
            </a>
            <a href='https://t.me/elysia_official' target='_blank' rel="noopener noreferrer">
              <img className="footer-logo" src={Telegram} style={{ width: 22, height: 21 }} alt="Telegram" />
            </a>
            <a href='https://github.com/elysia-dev' target='_blank' rel="noopener noreferrer">
              <img className="footer-logo" src={Github} style={{ width: 22, height: 21 }} alt="Github" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}


export default Footer;