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
        </div>
      </div>
    </footer>
  )
}


export default Footer;