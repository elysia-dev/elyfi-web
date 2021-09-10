import { useState, useEffect, useRef, useContext } from 'react';
import { useWeb3React } from '@web3-react/core';
import InjectedConnector from 'src/core/connectors/injectedConnector';
import mainnetConverter from 'src/utiles/mainnetConverter';
import { useTranslation } from 'react-i18next';
import Idle from "src/assets/images/status__idle.png";
import Confirm from "src/assets/images/status__confirm.png";
import Fail from "src/assets/images/status__fail.png";
import Pending from "src/assets/images/status__pending.png";
import useWatingTx from 'src/hooks/useWaitingTx';
import TxContext from 'src/contexts/TxContext';
import { ContractTransaction,  } from "ethers";

import envs from 'src/core/envs';
import txStatus from 'src/enums/txStatus';

const Wallet = (props: any) => {
  const { account, activate, deactivate, active, chainId } = useWeb3React();
  const [connected, setConnected] = useState<boolean>(false);
  const { t } = useTranslation();
  const { library } = useWeb3React();
  const { waiting, wait } = useWatingTx();

  const { initialTransaction, txState, txWaiting } = useContext(TxContext);

  useEffect(() => {
    async function CatchRefresh() {
      if ((window.localStorage.getItem("@txHash") === "" || null)) {
        return;
      }
      const res = await library?.getTransaction(window.localStorage.getItem("@txHash")).then(
        (res: ContractTransaction) => {
          wait(
            res as any, 
            () => {
              initialTransaction(txStatus.CONFIRM, false)
              window.localStorage.setItem("@txLoad", "false");
              window.localStorage.setItem("@txHash", "")
              window.localStorage.setItem("@txNonce", "");
            }
          )
        }
      )
      if (window.localStorage.getItem("@txLoad") === "true") {
        initialTransaction(txStatus.PENDING, true)
      }
      

      // library?.getTransaction(window.localStorage.getItem("@txHash")).then((res: ContractTransaction) => 
      //   {
      //     if (window.localStorage.getItem("@txLoad") === "true") {
      //       initialTransaction(txStatus.PENDING, true)
      //     }
      //     wait(
      //       res as any,
      //       () => {
      //         initialTransaction(txStatus.CONFIRM, false)
      //         window.localStorage.setItem("@txLoad", "false");
      //         window.localStorage.setItem("@txHash", "")
      //         window.localStorage.setItem("@txNonce", "");
      //       }
      //     )
      //   }
      // )
    }
    CatchRefresh();
  }, [])
  
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
      <div className={`navigation__wallet${connected ? "--connected" : ""} ${txState}`}
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
            style={{ display: !connected ? "none" : txState !== txStatus.PENDING ? "block" : "none"}}
            src={
              txWaiting === undefined ? 
                Idle
                : txState === txStatus.FAIL ?
                  Fail
                  : txState === txStatus.CONFIRM ?
                    Confirm
                    :
                    Idle
            } 
            alt="status" 
            className="navigation__status" />
          <div className="loader" style={{ display: txState === txStatus.PENDING ? "block" : "none"}} />
          <div>
            {connected && (
              <p className="navigation__wallet__mainnet">
                {txState === (txStatus.PENDING || txStatus.CONFIRM) ? `Transaction ${window.localStorage.getItem("@txNonce")}` : mainnetConverter(chainId)}
              </p>
            )}
            <p className={`navigation__wallet__status${connected ? "--connected" : ""}`}>
              {!connected ? t("navigation.connect_wallet") : 
                txState === txStatus.PENDING ?
                  "Pending..."
                  : txState === txStatus.FAIL ? 
                    "FAILED!"
                    : txState === txStatus.CONFIRM ? 
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