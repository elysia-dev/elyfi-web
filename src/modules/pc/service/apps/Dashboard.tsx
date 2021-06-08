import '../../css/style.scss';
import Navigation from '../../component/Navigation';
import TokenListing from '../component/TokenListing';
import MainBackground from '../../../../shared/images/main-background.png';
import TokenContext from '../../../../contexts/TokenContext';
import { useContext } from 'react';
import TokenTypes from '../../../../enums/TokenType';
import { useTranslation } from 'react-i18next';
import { useEagerConnect } from '../../../../hooks/connectHoots';
import Wallet from '../../component/Wallet';
import { useWeb3React } from '@web3-react/core';
import InjectedConnector from '../../../../core/connectors/injectedConnector';
import WalletContext from '../../../../contexts/WalletContext';
import UserType from '../../../../enums/UserType';
import Borrowers from './Dashboard/Borrowers';
import Investors from './Dashboard/Investors';

const Dashboard = () => {
  const { tokenlist } = useContext(TokenContext);
  const { t } = useTranslation();
  const { account, activate, deactivate, error, active, connector, library, chainId } = useWeb3React();
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
      <section className="main--full" style={{ backgroundImage: `url(${MainBackground})` }}>
        <Navigation />
        <div className="main__content-container">
          <h1 className="main__content--bold">
            DASHBOARD
          </h1>
          <p className="main__content">
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
      <div className="dashboard">
        {!active ? 
          DisableWalletPage() 
          : 
          userType === UserType.Borrowers ?
            <Borrowers />
            :
            <Investors />
          }
      </div>
    </div>
  );
}

export default Dashboard;