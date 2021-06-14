import '../css/style.scss';
import Navigation from '../component/Navigation';
import MainBackground from '../../../shared/images/main-background.png';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useWeb3React } from '@web3-react/core';
import InjectedConnector from '../../../core/connectors/injectedConnector';
import WalletContext from '../../../contexts/WalletContext';
import UserType from '../../../enums/UserType';
import Borrowers from './Borrowers';
import Investors from './Investors';
import Footer from '../footer/Footer';

const Dashboard = () => {
  const { t } = useTranslation();
  const { activate, active } = useWeb3React();
  const { userType } = useContext(WalletContext)

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
  const DisableWalletPage = () => {
    return (
      <section className="dashboard--disable" style={{ backgroundImage: `url(${MainBackground})` }}>
        <Navigation />
        <div className="dashboard__content-container">
          <h1 className="dashboard__content--bold">
            DASHBOARD
          </h1>
          <p className="dashboard__content">
            To get access to the dashboard page, please connect your wallet first!
          </p>
          <div style={{ margin: "30px auto 0px", display: "inline-block" }}>
            {CopiedWallet()}
          </div>
        </div>
      </section>
    )
  }

  return (
    <div className="elysia--pc">
      {!active ? 
        DisableWalletPage() 
        : 
        userType === UserType.Borrowers ?
          <Borrowers />
          :
          userType === UserType.Collateral ?
            <Investors />
            :
            <Investors />
        }
    </div>
  );
}

export default Dashboard;