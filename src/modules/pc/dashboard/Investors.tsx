import '../css/style.scss';
import Navigation from '../component/Navigation';
import ServiceBackground from '../../../shared/images/service-background.png';
import TokenContext from '../../../contexts/TokenContext';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import TokenListing from './component/TokenListing';
import TableType from '../../../enums/TableType';

const Investors = () => {
  const { t } = useTranslation();
  const { depositToken, mintedToken } = useContext(TokenContext);

  return (
    <>
      <section className="dashboard" style={{ backgroundImage: `url(${ServiceBackground})` }}>
        <Navigation />
        <div className="dashboard__title-wrapper">
          <h2 className="dashboard__title-text">Dashboard</h2>
        </div>
      </section>
      <section className="tokens">
        <TokenListing 
          header={"DEPOSITED TOKENS IN ELYFI"}
          type={TableType.Deposit}
          token={depositToken}
        />
        <TokenListing 
          header={"MINTED TOKEN"}
          type={TableType.Minted}
          token={mintedToken}
        />
      </section>
    </>
  );
}

export default Investors;