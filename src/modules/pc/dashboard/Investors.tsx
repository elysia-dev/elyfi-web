import 'src/stylesheets/style.scss';
import ServiceBackground from 'src/shared/images/service-background.png';
import TokenContext from 'src/contexts/TokenContext';
import { useWeb3React } from '@web3-react/core';
import { useContext } from 'react';
import TokenListing from './component/TokenListing';
import TableType from 'src/enums/TableType';
import DisableWalletPage from './DisableWalletPage';

const Investors = () => {
  const { depositToken, mintedToken } = useContext(TokenContext);
  const { active } = useWeb3React();

  if (!active) return <DisableWalletPage />

  return (
    <>
      <section className="dashboard main" style={{ backgroundImage: `url(${ServiceBackground})` }}>
        <div className="main__title-wrapper">
          <h2 className="main__title-text">Dashboard</h2>
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