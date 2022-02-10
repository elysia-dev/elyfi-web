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
import { Web3Context } from 'src/providers/Web3Provider';
import NetworkChangeModal from './NetworkChangeModal';
import SelectWalletModal from './SelectWalletModal';

const Wallet = (props: any) => {
  const { account, chainId, active } = useWeb3React();
  const [connected, setConnected] = useState<boolean>(false);
  const { t } = useTranslation();
  const [accountModalVisible, setAccountModalVisible] = useState(false);
  const [selectWalletModalVisible, setSelectWalletModalVisible] =
    useState(false);
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
      <SelectWalletModal
        modalClose={() => {
          setSelectWalletModalVisible(false);
        }}
        isWrongNetwork={
          window.sessionStorage.getItem('@walletConnect') === 'true' && !active
        }
        selectWalletModalVisible={selectWalletModalVisible}
      />
      <div
        className={`navigation__wallet${
          connected
            ? '--connected'
            : window.sessionStorage.getItem('@walletConnect') === 'true' &&
              !active
            ? '--connected'
            : ''
        } ${
          unsupportedChainid
            ? 'unknown-chain'
            : window.sessionStorage.getItem('@walletConnect') === 'true' &&
              !active
            ? 'unknown-chain'
            : txStatus
        }`}
        ref={WalletRef}
        onClick={async () => {
          if (!account) {
            setSelectWalletModalVisible(true);
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
        ) : window.sessionStorage.getItem('@walletConnect') === 'true' &&
          !active ? (
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
