import 'src/stylesheets/style.scss';
import ServiceBackground from 'src/shared/images/service-background.png';
import TokenContext from 'src/contexts/TokenContext';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import TokenListing from './component/TokenListing';
import TableType from 'src/enums/TableType';
import { useQuery } from '@apollo/client';
import { GetAllReserves } from 'src/queries/__generated__/GetAllReserves';
import { GET_ALL_RESERVES } from 'src/queries/getReserves';

const Investors = () => {
  const { t } = useTranslation();
  const { depositToken, mintedToken } = useContext(TokenContext);
  const {
    loading: isReservesLoading,
    data: reserveConnection,
    error,
  } = useQuery<GetAllReserves>(
    GET_ALL_RESERVES
  )

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