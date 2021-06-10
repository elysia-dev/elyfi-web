import '../css/style.scss';
import WhiteLogo from './images/White-logo.svg';
import Twitter from './images/twitter.svg';
import Telegram from './images/telegram.png';
import Github from './images/github.png';
import LanguageConverter from '../component/LanguageConverter';
import FooterBackgroundImg from './images/footer.png';

const Footer = () => {

  return (
    <footer className="footer" style={{ backgroundImage: `url(${FooterBackgroundImg})` }}>
      <div className="footer__container">
        <img className="footer__white-logo" src={WhiteLogo} alt="Elysia" />
        <div className="footer__wrapper">
          <LanguageConverter />
          <hr className="footer-line" style={{ borderColor: "#00A7FF", width: 0, height: 30 }} />
          <div className="footer__logo-wrapper">
            <a href='https://twitter.com/Elysia_HQ' target='_blank'>
              <img className="footer-logo" src={Twitter} />
            </a>
            <a href='https://t.me/elysia_official' target='_blank'>
              <img className="footer-logo" src={Telegram} style={{ width: 22, height: 22 }} />
            </a>
            <a href='https://github.com/elysia-dev' target='_blank'>
              <img className="footer-logo" src={Github} />
            </a>
          </div>
       </div>
      </div>
    </footer>
  )
}


export default Footer;