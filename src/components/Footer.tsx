import WhiteLogo from 'src/assets/images/White-logo.png';
import FooterBackgroundImg from 'src/assets/images/footer.png';
import LanguageConverter from 'src/components/LanguageConverter';

const Footer = () => {
  return (
    <footer
      className="footer"
      style={{ backgroundImage: `url(${FooterBackgroundImg})` }}>
      <div className="footer__container">
        <img className="footer__white-logo" src={WhiteLogo} alt="Elysia" />
        <div className="footer__wrapper">
          <LanguageConverter />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
