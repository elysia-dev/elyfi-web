import { useState, useEffect, useRef, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import TxContext from 'src/contexts/TxContext';
import Davatar from '@davatar/react';
import TxStatus from 'src/enums/TxStatus';
import { useENS } from 'src/hooks/useENS';
import AccountModal from 'src/components/AccountModal';
import MainnetContext from 'src/contexts/MainnetContext';
import MainnetError from 'src/assets/images/network_error.png';
import { Web3Context } from 'src/providers/Web3Provider';
import NetworkChangeModal from './NetworkChangeModal';

const Wallet = (props: any) => {
  const { activate, account, chainId, active } = useContext(Web3Context);
  const [connected, setConnected] = useState<boolean>(false);
  const { t } = useTranslation();
  const [accountModalVisible, setAccountModalVisible] = useState(false);
  const [networkChangeModalVisible, setNetworkChangeModalVisible] =
    useState(false);
  const { txStatus } = useContext(TxContext);

  const WalletRef = useRef<HTMLDivElement>(null);
  const { ensName, ensLoading } = useENS(account || '');
  const shortAddress = `${account?.slice(0, 6)}....${account?.slice(-4)}`;

  const { unsupportedChainid } = useContext(MainnetContext);

  useEffect(() => {
    setConnected(!!account);
  }, [account, chainId]);

  return (
    <>
      <AccountModal
        visible={accountModalVisible}
        closeHandler={() => setAccountModalVisible(false)}
      />
      <NetworkChangeModal
        visible={networkChangeModalVisible}
        closeHandler={() => setNetworkChangeModalVisible(false)}
      />
      <div
        className={`navigation__wallet${connected ? '--connected' : ''} ${
          unsupportedChainid ? 'unknown-chain' : txStatus
        }`}
        ref={WalletRef}
        onClick={async () => {
          if (!active) {
            await activate();
          }
          if (unsupportedChainid) {
            setNetworkChangeModalVisible(true);
          }
          if (connected && !unsupportedChainid) {
            setAccountModalVisible(true);
          }
        }}>
        {unsupportedChainid ? (
          <>
            <img src={MainnetError} />
            <h2 className="montserrat">Wrong Network</h2>
          </>
        ) : (
          <div className="navigation__wallet__wrapper">
            <div className="navigation__address">
              {ensLoading && account && connected && (
                <div className="navigation__davatar">
                  <Davatar
                    size={30}
                    address={account}
                    generatedAvatarType="jazzicon"
                  />
                </div>
              )}
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
                  : `${ensName || shortAddress}`}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Wallet;
