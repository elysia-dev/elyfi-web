
import 'src/stylesheets/style.scss';
import { useWeb3React } from '@web3-react/core';
import InjectedConnector from 'src/core/connectors/injectedConnector';
import MainBackground from 'src/assets/images/main-background.png';
import { useTranslation } from 'react-i18next';
import envs from 'src/core/envs';
import WhiteLogo from 'src/assets/images/White-logo.svg';
import LanguageConverter from './LanguageConverter';

const DisableWalletPage = () => {
  const { activate, active, chainId } = useWeb3React();
  const { t } = useTranslation();
  const CopiedWallet = () => {
    return (
      active && chainId === envs.requiredChainId ?
        <div style={{ border: "2px solid #00BFFF", borderRadius: 5, padding: 20, width: 200 }}>
          <p style={{ color: "#FFFFFF", margin: 0 }}>
            Access Completed!<br />
            Please Reflash :)
          </p>
        </div>
        :
        <div className={`navigation__wallet`}
          onClick={() => {
            activate(InjectedConnector)
          }}
          style={{ margin: 0 }}
        >
          <div className="navigation__wallet__wrapper">
            <p className={`navigation__wallet__status`}>{t("navigation.connect_wallet")}</p>
          </div>
        </div>
    )
  }

  return (
    <section className="dashboard--disable" style={{ backgroundImage: `url(${MainBackground})` }}>
      <div className="dashboard__content-container">
        <h1 className="dashboard__content--bold">
          {t("navigation.dashboard")}
        </h1>
        <p className="dashboard__content">
          {t("dashboard.disable_content--1")}
        </p>
        <p className="dashboard__content">
          {`${envs.requiredNetwork} network is required`}
        </p>
        <div style={{ margin: "30px auto 0px", display: "inline-block" }}>
          {CopiedWallet()}
        </div>
      </div>
      <footer className="footer footer--dashboard">
        <div className="footer__container">
          <img className="footer__white-logo" src={WhiteLogo} alt="Elysia" />
          <div className="footer__wrapper">
            <LanguageConverter />
          </div>
        </div>
      </footer>
    </section>
  )
}

export default DisableWalletPage;