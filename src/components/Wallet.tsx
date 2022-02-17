import { useState, useEffect, useRef, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useWeb3React } from '@web3-react/core';
import Davatar from '@davatar/react';
import envs from 'src/core/envs';
import TxContext from 'src/contexts/TxContext';
import TxStatus from 'src/enums/TxStatus';
import { useENS } from 'src/hooks/useENS';
import AccountModal from 'src/components/AccountModal';
import MainnetContext from 'src/contexts/MainnetContext';
import MainnetError from 'src/assets/images/network_error.png';
import useCurrentChain from 'src/hooks/useCurrentChain';
import { isMoblie, isWrongNetwork } from 'src/utiles/isWalletConnect';
import NetworkChangeModal from './NetworkChangeModal';
import SelectWalletModal from './SelectWalletModal';
import WalletDisconnect from './WalletDisconnect';

const Wallet = (): JSX.Element => {
  const { account, chainId, active } = useWeb3React();
  const [connected, setConnected] = useState<boolean>(false);

  const { t } = useTranslation();
  const [accountModalVisible, setAccountModalVisible] = useState(false);
  const [selectWalletModalVisible, setSelectWalletModalVisible] =
    useState(false);
  const [networkChangeModalVisible, setNetworkChangeModalVisible] =
    useState(false);
  const { txStatus } = useContext(TxContext);
  const [disconnectModalVisible, setDisconnectModalVisible] = useState(false);
  const WalletRef = useRef<HTMLDivElement>(null);
  const { ensName, ensLoading } = useENS(account || '');
  const shortAddress = `${account?.slice(0, 6)}....${account?.slice(-4)}`;
  const currentChain = useCurrentChain();
  const { unsupportedChainid, type: getMainnetType } =
    useContext(MainnetContext);

  const isWrongMainnet = isWrongNetwork(getMainnetType, currentChain?.name);

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
      <WalletDisconnect
        modalVisible={disconnectModalVisible}
        selectWalletModalVisible={() => setSelectWalletModalVisible(true)}
        modalClose={() => setDisconnectModalVisible(false)}
      />
      <SelectWalletModal
        modalClose={() => {
          setSelectWalletModalVisible(false);
        }}
        selectWalletModalVisible={selectWalletModalVisible}
      />
      <div
        className={`navigation__wallet${
          connected ? '--connected' : isWrongMainnet ? '--connected' : ''
        } ${unsupportedChainid || isWrongMainnet ? 'unknown-chain' : txStatus}`}
        ref={WalletRef}
        onClick={async () => {
          if (!account || isWrongMainnet) {
            isWrongMainnet
              ? setDisconnectModalVisible(true)
              : setSelectWalletModalVisible(true);
            return;
          }
          if (unsupportedChainid || isWrongMainnet) {
            if (isMoblie()) {
              setDisconnectModalVisible(true);
              return;
            }
            setNetworkChangeModalVisible(true);
          }
          if (connected && !unsupportedChainid) {
            setAccountModalVisible(true);
          }
        }}>
        {unsupportedChainid || isWrongMainnet ? (
          <>
            <img src={MainnetError} />
            <h2 className="montserrat">Wrong Network</h2>
          </>
        ) : isWrongMainnet ? (
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
