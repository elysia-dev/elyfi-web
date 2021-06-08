import '../../../css/style.scss';
import Navigation from '../../../component/Navigation';
import ServiceBackground from '../../images/service-background.png';
import TokenContext from '../../../../../contexts/TokenContext';
import WalletContext from '../../../../../contexts/WalletContext';
import { useContext } from 'react';
import TokenTypes from '../../../../../enums/TokenType';
import { useTranslation } from 'react-i18next';
import DepositToken from '../../component/DepositToken';
import MintedToken from '../../component/MintedToken';

const Investors = () => {
  const { t } = useTranslation();
  const { userType } = useContext(WalletContext)

  return (
    <>
      <section className="main" style={{ backgroundImage: `url(${ServiceBackground})` }}>
        <Navigation />
        <div className="main__title-wrapper">
          <h2 className="main__title-text">Dashboard</h2>
        </div>
      </section>
      <section className="tokens">
        <DepositToken 
          header={"DEPOSITED TOKENS IN ELYFI"}
        />
        <MintedToken 
          header={"MINTED TOKEN"}
        />
      </section>
    </>
  );
}

export default Investors;