import { useState, useEffect, useRef, useContext } from 'react';
import { useWeb3React } from '@web3-react/core';
import InjectedConnector from 'src/core/connectors/injectedConnector';
import mainnetConverter from 'src/utiles/mainnetConverter';
import { useTranslation } from 'react-i18next';
import Idle from "src/assets/images/status__idle.png";
import Confirm from "src/assets/images/status__confirm.png";
import Fail from "src/assets/images/status__fail.png";
import useWatingTx from 'src/hooks/useWaitingTx';
import TxContext from 'src/contexts/TxContext';

import envs from 'src/core/envs';
import txStatus from 'src/enums/txStatus';
import AccountModal from './AccountModal';

const Wallet = (props: any) => {
  const { account, activate, deactivate, active, chainId } = useWeb3React();
  const [connected, setConnected] = useState<boolean>(false);
  const { t } = useTranslation();
  const { library } = useWeb3React();
  const [modal, setModal] = useState(false);

  const [count, setCount] = useState(0);

  const { initTransaction, txState, txWaiting, reset } = useContext(TxContext);

  useEffect(() => {
    if ((window.localStorage.getItem("@txHash") === null)) {
      initTransaction(txStatus.IDLE, false)
      return;
    }
    if (window.localStorage.getItem("@txLoad") === "true") {
      initTransaction(txStatus.PENDING, true)
    }
    if (window.localStorage.getItem("@txStatus") === "CONFIRM" || window.localStorage.getItem("@txStatus") === "FAIL") {
      initTransaction(txStatus.IDLE, false)
    } else if (library && (window.localStorage.getItem("@txStatus") === "PENDING" || window.localStorage.getItem("@txStatus") === null)) {
      library.getTransactionReceipt(window.localStorage.getItem("@txHash")).then((res: any) => {
        if (res && res.status === 1) {
          initTransaction(txStatus.CONFIRM, false)
          window.localStorage.setItem("@txLoad", "false");
          window.localStorage.setItem("@txStatus", "CONFIRM");
        } else if (res && res.status !== 1) {
          initTransaction(txStatus.FAIL, false)
          window.localStorage.setItem("@txLoad", "false");
          window.localStorage.setItem("@txStatus", "FAIL");
        }
      }).catch((e: any) => {
        initTransaction(txStatus.FAIL, false)
        window.localStorage.setItem("@txLoad", "false");
        window.localStorage.setItem("@txStatus", "FAIL");
        console.log(e)
      })
    }
  }, [library])
  
  const WalletRef = useRef<HTMLDivElement>(null);

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
      </div>
    </>
  );
}

export default Wallet;