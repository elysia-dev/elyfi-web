import { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useWeb3React } from '@web3-react/core';
import Davatar from '@davatar/react';
import TxContext from 'src/contexts/TxContext';
import TxStatus from 'src/enums/TxStatus';
import { useENS } from 'src/hooks/useENS';
import AccountModal from 'src/components/Modal/AccountModal';
import MainnetContext from 'src/contexts/MainnetContext';
import MainnetError from 'src/assets/images/network_error.png';
import useCurrentChain from 'src/hooks/useCurrentChain';
import moment from 'moment';
import { getNFTContract } from 'src/clients/BalancesFetcher';
import { utils } from 'ethers';
import { isMoblie } from 'src/utiles/connectWallet';
import { isWrongNetwork } from 'src/utiles/isWrongNetwork';
import NetworkChangeModal from '../Modal/NetworkChangeModal';
import SelectWalletModal from '../Modal/SelectWalletModal';
import WalletDisconnect from '../Modal/WalletDisconnect';
import TwitterConfirmModal from '../Market/Modals/TwitterConfirmModal';
import TokenRewardModal from '../Market/Modals/TokenRewardModal';

const Wallet = (): JSX.Element => {
  const { account, chainId, library } = useWeb3React();
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
  const [modalType, setModalType] = useState('');
  const [purchasedNFT, setPurchasedNFT] = useState<number | undefined>();

  const isWrongMainnet = isWrongNetwork(getMainnetType, currentChain?.name);

  const endedTime = moment(
    '2022.08.04 20:00:00 +9:00',
    'YYYY.MM.DD hh:mm:ss Z',
  );

  useEffect(() => {
    setConnected(!!account);
  }, [account, chainId]);
  useEffect(() => {
    if (localStorage.getItem(`@eventclose${account}`) === account) {
      setModalType('twitter');
    }
  }, [account]);

  const getPurchasedNFT = useCallback(async () => {
    try {
      const nftContract = getNFTContract(library.getSigner());
      const count = await nftContract.balanceOf(account, 0);
      setPurchasedNFT(parseInt(utils.formatUnits(count, 0), 10));
    } catch (error) {
      console.log(error);
      setPurchasedNFT(0);
    }
  }, [library, account]);

  useEffect(() => {
    if (!account) return;
    getPurchasedNFT();
  }, [account]);

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
        isNavBtn={true}
      />
      <SelectWalletModal
        modalClose={() => {
          setSelectWalletModalVisible(false);
        }}
        selectWalletModalVisible={selectWalletModalVisible}
      />
      {modalType === 'twitter' ? (
        <TwitterConfirmModal
          endedTime={endedTime}
          onClose={() => {
            localStorage.setItem(
              `@eventclose${account}`,
              account ? account : '',
            );
            setModalType('');
          }}
          onSubmit={() => {
            localStorage.removeItem(`@event${account}`);
            localStorage.removeItem(`@eventclose${account}`);
            setModalType('tokenReward');
            window.open(
              'https://twitter.com/intent/retweet?tweet_id=1550052436622323712',
            );
          }}
          onDiscard={() => {
            localStorage.setItem(`@event${account}`, account ? account : '');
            localStorage.removeItem(`@eventclose${account}`);
            setModalType('');
          }}
        />
      ) : modalType === 'tokenReward' ? (
        <TokenRewardModal
          endedTime={endedTime}
          onClose={() => setModalType('')}
          tokenAmount={purchasedNFT ? (purchasedNFT * 10 * 0.01) / 0.01858 : 0}
          tokenName={'ELFI'}
        />
      ) : (
        <></>
      )}
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
