import { useState, useEffect, useRef, useContext } from 'react';
import { useWeb3React } from '@web3-react/core';
import InjectedConnector from 'src/core/connectors/injectedConnector';
import mainnetConverter from 'src/utiles/mainnetConverter';
import { useTranslation } from 'react-i18next';
import Idle from 'src/assets/images/status__idle.png';
import Confirm from 'src/assets/images/status__confirm.png';
import Fail from 'src/assets/images/status__fail.png';
import TxContext from 'src/contexts/TxContext';

import envs from 'src/core/envs';
import TxStatus from 'src/enums/TxStatus';
import AccountModal from './AccountModal';

const Wallet = (props: any) => {
  const { account, activate, active, chainId } = useWeb3React();
  const [connected, setConnected] = useState<boolean>(false);
  const { t } = useTranslation();
  const [modal, setModal] = useState(false);
  const { txStatus, txWaiting, txNonce } = useContext(TxContext);

  const WalletRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setConnected(
      !!account &&
        (chainId === envs.requiredChainId ||
          envs.requiredNetwork === 'ganache'),
    );
  }, [account, chainId]);

  return (
    <>
      <AccountModal visible={modal} closeHandler={() => setModal(false)} />
      <div
        className={`navigation__wallet${
          connected ? '--connected' : ''
        } ${txStatus}`}
        ref={WalletRef}
        onClick={() => {
          if (!active) {
            activate(InjectedConnector).then(() => {
              window.sessionStorage.setItem('@connect', 'true');
            });
          }
          if (connected) {
            setModal(true);
          }
        }}>
        <div className="navigation__wallet__wrapper">
            {/* <img
              style={{
                display: !connected
                  ? 'none'
                  : txStatus !== TxStatus.PENDING
                  ? 'block'
                  : 'none',
              }}
              src={
                txWaiting === undefined
                  ? Idle
                  : txStatus === TxStatus.FAIL
                  ? Fail
                  : txStatus === TxStatus.CONFIRM
                  ? Confirm
                  : Idle
              }
              alt="status"
              className="navigation__status"
            />
            <div
              className="loader"
              style={{
                display: txStatus === TxStatus.PENDING ? 'block' : 'none',
              }}
            /> */}
          <div>
            <p
              className={`navigation__wallet__status${
                connected ? '--connected' : ''
              }`}>
              {!connected
                ? t('navigation.connect_wallet')
                : txStatus === TxStatus.PENDING
                ? 'Pending...'
                : txStatus === TxStatus.FAIL
                ? 'FAILED!'
                : txStatus === TxStatus.CONFIRM
                ? 'Confirmed!!'
                : `${account?.slice(0, 6)}....${account?.slice(-4)}`}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Wallet;
