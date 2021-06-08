import '../../../css/style.scss';
import Navigation from '../../../component/Navigation';
import TokenListing from '../../component/TokenListing';
import ServiceBackground from '../../images/service-background.png'
import TokenContext from '../../../../../contexts/TokenContext';
import WalletContext from '../../../../../contexts/WalletContext';
import { useContext } from 'react';
import TokenTypes from '../../../../../enums/TokenType';
import { useTranslation } from 'react-i18next';

const Borrowers = () => {
  const { tokenlist } = useContext(TokenContext);
  const { t } = useTranslation();
  const { userType } = useContext(WalletContext)

  return (
    <div className="elysia--pc">
      <div className={`service`}>
        <section className="main" style={{ backgroundImage: `url(${ServiceBackground})` }}>
          <Navigation />
          <div className="main__title-wrapper">
            <h1 className="main__title-text">Dashboard</h1>
            <h1 className="main__title-text--blue">test string: {userType}</h1>
          </div>
        </section>
        <section className="tokens">
          <TokenListing 
            header={t("app.token")}
            tokenlist={tokenlist.filter((item) => {
              return item.type === TokenTypes.CRYPTO
            })}
          />
          <TokenListing
            header={t("app.asset-token")}
            tokenlist={tokenlist.filter((item) => {
              return item.type === TokenTypes.ASSETS
            })}
          />  
        </section>
      </div>
    </div>
  );
}

export default Borrowers;