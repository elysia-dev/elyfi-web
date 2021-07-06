import 'src/stylesheets/style.scss';
import WhiteLogo from 'src/assets/images/White-logo.svg';
import LanguageConverter from './LanguageConverter';
import FooterBackgroundImg from 'src/assets/images/footer.png';
import { useLocation } from 'react-router';
import { useWeb3React } from '@web3-react/core';
import envs from 'src/core/envs';

const Footer = () => {
  const location = useLocation();
  const { active, chainId } = useWeb3React();
  if (location.pathname === "/dashboard" && !active && chainId !== envs.requiredChainId) {
    return (<></>);
  }

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