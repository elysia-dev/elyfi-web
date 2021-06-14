import '../css/styleM.scss';
import Navigation from '../component/Navigation';
import TokenListing from './component/TokenListing';
import ServiceBackground from './images/service-background.png'
import { useMediaQuery } from 'react-responsive';
import TokenContext from '../../../contexts/TokenContext';
import { useContext } from 'react';
import TokenTypes from '../../../enums/TokenType';
import { useTranslation } from 'react-i18next';
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import InjectedConnector from '../../../core/connectors/injectedConnector';
import { useHistory } from 'react-router-dom';
import { useEagerConnect, useInactiveListener } from '../../../hooks/connectHoots';


const Service = (props: any) => {
  const { account, activate, deactivate, error } = useWeb3React();
  const [connected, setConnected] = useState<boolean>(false);
  // const { tokenlist } = useContext(TokenContext);
  const { t } = useTranslation();

  // const context = useWeb3React()
  // const { connector, library, chainId, account, activate, deactivate, active, error } = context


  // const [activatingConnector, setActivatingConnector] = React.useState()

  // const activating = InjectedConnector === activatingConnector
  // const connected = InjectedConnector === connector
  // const disabled = !props.triedEager || !!activatingConnector || !!error

  // useInactiveListener(!props.triedEager || !!activatingConnector)

  // let isDisconnect = !error && chainId
  // const buttonText = isDisconnect ? 'Disconnect' : (activating ? 'Connectting' : 'Connect' )


  // React.useEffect(() => {
  //   if (activatingConnector && activatingConnector === connector) {
  //     setActivatingConnector(undefined)
  //   }
  //   console.log(isDisconnect)
  // }, [activatingConnector, connector])




  // const connectWallet = () => {
  //   activate(InjectedConnector);
  // };

  // useEffect(() => {
  //   connectWallet();
  //   return () => {
  //     deactivate();
  //   };
  // }, []);

  useEffect(() => {
    setConnected(!!account)
  },[account])

  return (
    <div className="elysia--mobile">
      <div className={`service`}>
        <section className="main" style={{ backgroundImage: `url(${ServiceBackground})` }}>
          <Navigation />
          <div className="main__title-wrapper">
            <h1 className="main__title-text">{t("app.title")}</h1>
            <h1 className="main__title-text--blue">{t("app.coming-soon")}</h1>
            <p className="main__subtitle-text">{t("app.title-content")}</p>
          </div>
        </section>
        <section className="tokens">
        <button onClick={() => {
          console.log(error)
        }} />
        <button
          onClick={() => {
            if (!connected) {
              activate(InjectedConnector)
            } else {
              deactivate()
            }
          }}
          className="ConnectButton"
          disabled={connected !== false}
          style={{
            backgroundColor: '#3679B5',
            borderRadius: 10,
            borderWidth: 0,
            width: '100%',
            height: 50,
          }}
        >
          <p style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}>
            {connected ? t('Register.Connected') : t('Register.Connect')}
          </p>
        </button>
          {/* <TokenListing
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
          /> */}
        </section>
      </div>
    </div>
  );
}

export default Service;