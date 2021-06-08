import '../../css/style.scss';
import Navigation from '../../component/Navigation';
import TokenListing from '../component/TokenListing';
import ServiceBackground from '../images/service-background.png'
import TokenContext from '../../../../contexts/TokenContext';
import { useContext } from 'react';
import TokenTypes from '../../../../enums/TokenType';
import { useTranslation } from 'react-i18next';

const Buy = () => {
  const { tokenlist } = useContext(TokenContext);
  const { t } = useTranslation();

  return (
    <div className="elysia--pc">
      <div className={`service`}>
        <section className="main" style={{ backgroundImage: `url(${ServiceBackground})` }}>
          <Navigation />
          <div className="main__title-wrapper">
            <h1 className="main__title-text">Total Market Size</h1>
            <h1 className="main__title-text--blue">$ 223,456,789</h1>
            <h1 className="main__title-text">This is Buy Page</h1>
            <h1 className="main__title-text">are you Collateral or User? When you log in first time, you will be Redirect to Here!</h1>
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

export default Buy;