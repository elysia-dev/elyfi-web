import { useState, useEffect, useRef } from 'react';
import { useWeb3React } from '@web3-react/core';
import InjectedConnector from 'src/core/connectors/injectedConnector';
import mainnetConverter from 'src/utiles/mainnetConverter';

type Account = string | null | undefined;

let throttle_flag = false;
const throttle = (func: () => void, delay: number) => {
  if (!throttle_flag) {
    func();
    throttle_flag = true;
    setTimeout(() => {
      throttle_flag = false;
    }, delay);
  }
};

const Wallet = (props: any) => {
  const { account, activate, deactivate, error, active, connector, library, chainId } = useWeb3React();
  const [connected, setConnected] = useState<boolean>(false);
  const [userAccount, setUserAccount] = useState<Account>(undefined);

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

  const LNB = () => {
    return (
      <ul className="navigation__wallet__sub-menu"
        style={{ display: visible ? "block" : "none" }}
      >
        <li className="navigation__wallet__sub-menu__item">
          {account}
        </li>
        <li className="navigation__wallet__sub-menu__item"
          onClick={() => {
            deactivate();
          }}>
          Disconnect
        </li>
      </ul>
    )
  }

  useEffect(() => {
    setConnected(!!account)
  }, [account])

  useEffect(() => {
    if (account) {
      throttle(() => setUserAccount(account), 500);
    }
  }, [account]);

  return (
    <>
      <div className={`navigation__wallet${connected ? "--connected" : ""}`}
        ref={WalletRef}
        onClick={() => {
          if (!active) {
            activate(InjectedConnector)
          }
          if (connected) {
            handleHover();
          }
        }}>
        <div className="navigation__wallet__wrapper">
          {connected && (
            <p className="navigation__wallet__mainnet">{mainnetConverter(chainId)}</p>
          )}
          <p className={`navigation__wallet__status${connected ? "--connected" : ""}`}>{connected ? `${account?.slice(0, 6)}....${account?.slice(-4)}` : "Connect Wallet"}</p>
        </div>
        <LNB />
      </div>
    </>
  );
}

export default Wallet;