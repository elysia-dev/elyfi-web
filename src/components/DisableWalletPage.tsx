
import 'src/stylesheets/style.scss';
import { useWeb3React } from '@web3-react/core';
import InjectedConnector from 'src/core/connectors/injectedConnector';
import MainBackground from 'src/assets/images/main-background.png';

const DisableWalletPage = () => {
  const { activate, active } = useWeb3React();

  const CopiedWallet = () => {
    return (
      active ?
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
            <p className={`navigation__wallet__status`}>Connect Wallet</p>
          </div>
        </div>
    )
  }

  return (
    <section className="dashboard--disable" style={{ backgroundImage: `url(${MainBackground})` }}>
      <div className="dashboard__content-container">
        <h1 className="dashboard__content--bold">
          DASHBOARD
        </h1>
        <p className="dashboard__content">
          Connect your wallet to continue
        </p>
        <div style={{ margin: "30px auto 0px", display: "inline-block" }}>
          {CopiedWallet()}
        </div>
      </div>
    </section>
  )
}

export default DisableWalletPage;