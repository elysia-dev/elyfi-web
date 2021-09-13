import { useState, useEffect, useRef, useContext, useCallback } from 'react';
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
import AccountModal from './AccountModal';

const Wallet = (props: any) => {
  const { account, activate, deactivate, active, chainId } = useWeb3React();
  const [connected, setConnected] = useState<boolean>(false);
  const { t } = useTranslation();
  const { library } = useWeb3React();
  const { waiting, wait } = useWatingTx();
  const [modal, setModal] = useState(false);

  const [count, setCount] = useState(0);

  const { initialTransaction, txState, txWaiting, ResetAllState } = useContext(TxContext);

  useEffect(() => {
    if ((window.localStorage.getItem("@txHash") === null)) {
      initialTransaction(txStatus.IDLE, false)
      return;
    }
    if (window.localStorage.getItem("@txLoad") === "true") {
      initialTransaction(txStatus.PENDING, true)
    }
    let timer = setTimeout(function getTx() {
      library?.getTransactionReceipt(window.localStorage.getItem("@txHash")).then((res: any) => {
        if (res && res.status === 1) {
          initialTransaction(txStatus.CONFIRM, false)
          window.localStorage.setItem("@txLoad", "false");
          window.localStorage.setItem("@txStatus", "CONFIRM");
        } else if (res && res.status !== 1) {
          initialTransaction(txStatus.FAIL, false)
          window.localStorage.setItem("@txLoad", "false");
          window.localStorage.setItem("@txStatus", "FAIL");
        } else {
          setCount(count + 1)
          timer = setTimeout(getTx, 5000);
        }
      }).catch((e: any) => {
        initialTransaction(txStatus.FAIL, false)
        window.localStorage.setItem("@txLoad", "false");
        window.localStorage.setItem("@txStatus", "FAIL");
        console.log(e)
      })
    }, 5000)

    console.log(count)

    return () => {
      clearTimeout(timer);
    }
  }, [count])

  useEffect(() => {
    if (window.localStorage.getItem("@txStatus") === "PENDING") {
      library?.getTransactionReceipt(window.localStorage.getItem("@txHash")).then((res: any) => {
        if (res && res.status === 1) {
          initialTransaction(txStatus.CONFIRM, false)
          window.localStorage.setItem("@txLoad", "false");
          window.localStorage.setItem("@txStatus", "CONFIRM");
        } else if (res && res.status !== 1) {
          initialTransaction(txStatus.FAIL, false)
          window.localStorage.setItem("@txLoad", "false");
          window.localStorage.setItem("@txStatus", "FAIL");
        }
      }).catch((e: any) => {
        initialTransaction(txStatus.FAIL, false)
        window.localStorage.setItem("@txLoad", "false");
        window.localStorage.setItem("@txStatus", "FAIL");
        console.log(e)
      })
    }
  })
  
  //   try {
  //     let code = await library?.getTransactionReceipt(window.localStorage.getItem("@txHash"))

  //     if (code && code.status === 1) {
  //       initialTransaction(txStatus.CONFIRM, false)
  //       window.localStorage.setItem("@txLoad", "false");
  //       window.localStorage.setItem("@txHash", "")
  //       window.localStorage.setItem("@txNonce", "");
  //       library?.getTransaction(window.localStorage.getItem("@txHash")).then((res: ContractTransaction) => 
  //       {
  //         wait(
  //           res as any, 
  //           () => {

  //           }
  //         )
  //       })
  //     }
  //     else if (code && code.status !== 1) {
  //       initialTransaction(txStatus.FAIL, false);
  //       window.localStorage.setItem("@txLoad", "false")
  //       window.localStorage.setItem("@txHash", "")
  //       window.localStorage.setItem("@txNonce", "")
  //     }
  //   } catch (e) { 
  //     console.log(e)
  //   }
  // }
  // useEffect(() => {
  //   if ((window.localStorage.getItem("@txHash") === "" || null)) {
  //     return;
  //   }
  //   console.log(window.localStorage.getItem("@txLoad"))
  //   console.log(window.localStorage.getItem("@txHash"))
  //   if (window.localStorage.getItem("@txLoad") === "true") {
  //     initialTransaction(txStatus.PENDING, true)
  //   }
  //   CatchRefresh();


  //   // library?.getTransaction(window.localStorage.getItem("@txHash")).then((res: ContractTransaction) => 
  //   //   {
  //   //     if (window.localStorage.getItem("@txLoad") === "true") {
  //   //       initialTransaction(txStatus.PENDING, true)
  //   //     }
  //   //     wait(
  //   //       res as any,
  //   //       () => {
  //   //         initialTransaction(txStatus.CONFIRM, false)
  //   //         window.localStorage.setItem("@txLoad", "false");
  //   //         window.localStorage.setItem("@txHash", "")
  //   //         window.localStorage.setItem("@txNonce", "");
  //   //       }
  //   //     )
  //   //   }
  //   // )
  // }, [])
  
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
      <AccountModal visible={modal} closeHandler={() => setModal(false)} />
      <div className={`navigation__wallet${connected ? "--connected" : ""} ${txState}`}
        ref={WalletRef}
        onClick={() => {
          if (!active) {
            activate(InjectedConnector).then(() => {
              window.sessionStorage.setItem("@connect", "ture");
            })
          }
          if (connected) {
            // handleHover();
            setModal(true);
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
              }
            </p>
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
              window.localStorage.removeItem("@txHash")
              window.localStorage.removeItem("@txNonce");
              window.localStorage.removeItem("@txStatus");
              window.localStorage.removeItem("@txTracking");
              ResetAllState();
            }}>
            {t("navigation.disconnect")}
          </p>
        </div>
      </div>
    </>
  );
}

export default Wallet;