import 'src/stylesheets/style.scss';
import WhiteLogo from 'src/assets/images/White-logo.png';
import LanguageConverter from './LanguageConverter';
import FooterBackgroundImg from 'src/assets/images/footer.png';

const Footer = () => {
  return (
    <footer className="footer" style={{ backgroundImage: `url(${FooterBackgroundImg})` }}>
      <div className="footer__container">
        <img className="footer__white-logo" src={WhiteLogo} alt="Elysia" />
        <p className="footer__content">Audited by Haetchi Labs</p>
        <div className="footer__wrapper">
          <LanguageConverter />
        </div>
      </div>
    </footer>
  )
}


export default Footer;