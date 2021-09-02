import { useState, useEffect, useRef } from 'react';
import { useWeb3React } from '@web3-react/core';
import InjectedConnector from 'src/core/connectors/injectedConnector';
import mainnetConverter from 'src/utiles/mainnetConverter';
import { useTranslation } from 'react-i18next';
import Idle from "src/assets/images/status__idle.png";
import Confirm from "src/assets/images/status__confirm.png";
import Fail from "src/assets/images/status__fail.png";
import Pending from "src/assets/images/status__pending.png";
import useWatingTx from 'src/hooks/useWaitingTx';

import envs from 'src/core/envs';
import txStatus from 'src/enums/txStatus';

const Wallet = (props: any) => {
  // console.log(props)
  const { account, activate, deactivate, active, chainId } = useWeb3React();
  const [connected, setConnected] = useState<boolean>(false);
  const { t } = useTranslation();
  
  const WalletRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const handleHover = () => {
    setVisible(!visible);
  };
  const handleOut = () => {
    setVisible(false);
  };

  const HandleClickOutside = (ref: any) => {
    useEffect(() => {
      function HandleClickOutside(e: any): void {
        if (ref.current && !ref.current.contains(e.target as Node)) {
          handleOut();
        }
      }
      document.addEventListener('mousedown', HandleClickOutside);
      return () => {
        document.removeEventListener('mousedown', HandleClickOutside);
      };
    }, [ref]);
  };

  HandleClickOutside(WalletRef);

  useEffect(() => {
    setConnected(!!account && chainId === envs.requiredChainId)
  }, [account, chainId])


  return (
    <>
      <div className={`navigation__wallet${connected ? "--connected" : ""} ${props?.txStatus}`}
        ref={WalletRef}
        onClick={() => {
          if (!active) {
            activate(InjectedConnector).then(() => {
              window.sessionStorage.setItem("@connect", "ture");
            })
          }
          if (connected) {
            handleHover();
          }
        }}>
        <div className="navigation__wallet__wrapper">
          <img 
            style={{ display: props?.txStatus !== txStatus.PENDING ? "block" : "none"}}
            src={
              props?.txWaiting === undefined ? 
                Idle
                : props?.txStatus === txStatus.FAIL ?
                  Fail
                  : props?.txStatus === txStatus.CONFIRM ?
                    Confirm
                    :
                    Idle // 크아악
            } 
            alt="status" 
            className="navigation__status" />
          <div className="loader" style={{ display: props?.txStatus === txStatus.PENDING ? "block" : "none"}} />
          <div>
            {connected && (
              <p className="navigation__wallet__mainnet">
                {props?.txWaiting !== undefined ? "Transaction" : mainnetConverter(chainId)}
              </p>
            )}
            <p className={`navigation__wallet__status${connected ? "--connected" : ""}`}>
              {!connected ? t("navigation.connect_wallet") : 
                props?.txStatus === txStatus.PENDING ?
                  "Pending..."
                  : props?.txStatus === txStatus.FAIL ? 
                    "FAILED!"
                    : props?.txStatus === txStatus.CONFIRM ? 
                      "Confirmed!!"
                      :
                      `${account?.slice(0, 6)}....${account?.slice(-4)}`
              }</p>
          </div>
        </div>
        <div className="navigation__wallet__sub-menu"
          style={{ display: visible ? "block" : "none" }}
        >
          <p className="navigation__wallet__sub-menu__item">
            {account}
          </p>
          <hr />
          <p className="navigation__wallet__sub-menu__item"
            onClick={() => {
              deactivate();
              window.sessionStorage.setItem("@connect", "false");
            }}>
            {t("navigation.disconnect")}
          </p>
        </div>
      </div>
    </>
  );
}

export default Wallet;