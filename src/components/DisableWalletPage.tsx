
import 'src/stylesheets/style.scss';
import { useWeb3React } from '@web3-react/core';
import InjectedConnector from 'src/core/connectors/injectedConnector';
import MainBackground from 'src/assets/images/main-background.png';
import { useTranslation } from 'react-i18next';
import envs from 'src/core/envs';

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
            activate(InjectedConnector).then(() => {
              window.sessionStorage.setItem("@connect", "ture");
            })
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
          {t("dashboard.disable_content--1")}
        </h1>
        <div style={{ margin: "30px auto 0px", display: "inline-block" }}>
          {CopiedWallet()}
        </div>
      </div>
    </section>
  )
}

export default DisableWalletPage;