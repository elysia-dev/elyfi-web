import { useWeb3React } from '@web3-react/core';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import mainnetConverter from 'src/utiles/mainnetConverter';
import TxContext from 'src/contexts/TxContext';
import Fail from 'src/assets/images/status__fail.png';
import Confirm from 'src/assets/images/status__confirm.png';
import NewTab from 'src/assets/images/new_tab.png';
import Copy from 'src/assets/images/copy.svg';
import envs from 'src/core/envs';
import TxStatus from 'src/enums/TxStatus';
import Davatar from '@davatar/react';
import ModalHeader from 'src/components/Modal/ModalHeader';
import { useENS } from 'src/hooks/useENS';
import MainnetContext from 'src/contexts/MainnetContext';
import MainnetType from 'src/enums/MainnetType';
import useMediaQueryType from 'src/hooks/useMediaQueryType';
import MediaQuery from 'src/enums/MediaQuery';
import { setWalletConnect } from 'src/utiles/connectWallet';
import { ImportTokenData, IImportTokens } from 'src/core/data/importTokens';
import MetamaskIcon from 'src/assets/images/metamask@2x.png';

const AccountModal: React.FunctionComponent<{
  visible: boolean;
  closeHandler: () => void;
}> = ({ visible, closeHandler }) => {
  const { account, deactivate, chainId } = useWeb3React();
  const { t } = useTranslation();
  const { reset, txHash, txStatus, txType } = useContext(TxContext);
  const { type: getMainnetType } = useContext(MainnetContext);
  const { ensName, ensLoading } = useENS(account || '');
  const shortAddress = `${account?.slice(0, 8)}....${account?.slice(-6)}`;
  const { value: mediaQuery } = useMediaQueryType();

  const AddressCopy = (data: string) => {
    if (!document.queryCommandSupported('copy')) {
      return alert('This browser does not support the copy function.');
    }
    const area = document.createElement('textarea');
    area.value = data;
    document.body.appendChild(area);
    area.select();
    document.execCommand('copy');
    document.body.removeChild(area);
    alert('Copied!!');
  };

  const addELFIToken = async (data: IImportTokens) => {
    try {
      await window.ethereum?.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address:
              getMainnetType === MainnetType.Ethereum
                ? data.mainnet.Ethereum.address
                : data.mainnet.BSC.address,
            symbol: data.symbol,
            decimals: data.decimals,
            image: data.image,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="modal"
      style={{ display: visible ? 'block' : 'none', opacity: 1 }}>
      <div className="modal__container">
        <ModalHeader
          title={t('transaction.account')}
          onClose={() => closeHandler()}
        />
        <div className="modal__account">
          <div className="modal__account__mainnet-info">
            <div>
              <p>{mainnetConverter(chainId)}</p>
              <div>
                <div className="navigation__davatar">
                  {ensLoading && account && (
                    <Davatar
                      size={mediaQuery === MediaQuery.PC ? 14 : 9}
                      address={account}
                      generatedAvatarType="jazzicon"
                    />
                  )}
                </div>
                <p className="bold">{ensName || shortAddress}</p>
              </div>
            </div>
            <div
              onClick={() => {
                deactivate();
                window.localStorage.removeItem('wallet');
                window.sessionStorage.removeItem('@network');
                reset();
                closeHandler();
                setWalletConnect('');
              }}>
              <p>{t('navigation.disconnect')}</p>
            </div>
          </div>
          <div className="modal__account__mainnet-info__button">
            <div onClick={() => AddressCopy(account!)}>
              <img src={Copy} alt="Copy Address" />
              <p>{t('transaction.copy_address')}</p>
            </div>
            <a
              href={`${
                getMainnetType === MainnetType.Ethereum
                  ? envs.externalApiEndpoint.etherscanURI
                  : envs.externalApiEndpoint.bscscanURI
              }/address/${account}`}
              target="_blank"
              className="link">
              <div>
                <img src={NewTab} alt="On View" />
                <p>
                  {getMainnetType === MainnetType.Ethereum
                    ? t('transaction.on_etherscan')
                    : t('transaction.on_bscscan')}
                </p>
              </div>
            </a>
          </div>
          <div className="modal__account__add-tokens">
            <h2>{t('modal.account.addToken')}</h2>
            <div>
              {ImportTokenData.map((data, index) => {
                const currnetAddress =
                  getMainnetType === MainnetType.Ethereum
                    ? data.mainnet.Ethereum.address
                    : data.mainnet.BSC.address;
                return (
                  <div key={index}>
                    <div>
                      <img src={data.image} />
                      <p>{data.symbol}</p>
                    </div>
                    <p>{`${currnetAddress.slice(
                      0,
                      8,
                    )}....${currnetAddress.slice(-8)}`}</p>
                    <div>
                      <div>
                        <img
                          title="주소 복사하기"
                          className="copy-image"
                          src={Copy}
                          onClick={() => AddressCopy(currnetAddress)}
                          style={{ cursor: 'pointer' }}
                        />
                      </div>
                      <div>
                        <img
                          title="메타마스크에 토큰 추가"
                          className="metamask-image"
                          src={MetamaskIcon}
                          style={{ cursor: 'pointer' }}
                          onClick={() => addELFIToken(data)}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="modal__account__status">
            <p className="modal__header__name spoqa__bold">
              {t('transaction.activity__title')}
            </p>

            <a
              href={
                txHash
                  ? `${
                      getMainnetType === MainnetType.Ethereum
                        ? envs.externalApiEndpoint.etherscanURI
                        : envs.externalApiEndpoint.bscscanURI
                    }/tx/${txHash}`
                  : undefined
              }
              target="_blank"
              className={txHash ? '' : 'disable'}>
              <div>
                <p className="spoqa__bold">
                  {t(
                    `transaction.${
                      txStatus !== TxStatus.IDLE ? txType : 'Idle'
                    }`,
                  )}
                </p>
                <div>
                  <img
                    style={{
                      display:
                        txStatus === TxStatus.IDLE ||
                        txStatus === TxStatus.PENDING
                          ? 'none'
                          : 'block',
                    }}
                    src={
                      txStatus === TxStatus.FAIL
                        ? Fail
                        : txStatus === TxStatus.CONFIRM
                        ? Confirm
                        : Fail
                    }
                    alt="status"
                  />
                  <div
                    className="lds-spinner"
                    style={{
                      display: txStatus === TxStatus.PENDING ? 'block' : 'none',
                    }}>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                  <p
                    className="spoqa__bold"
                    style={{
                      display: txStatus === TxStatus.IDLE ? 'none' : 'block',
                    }}>
                    {txStatus === TxStatus.FAIL
                      ? 'FAILED!'
                      : txStatus === TxStatus.CONFIRM
                      ? 'Confirmed!'
                      : txStatus === TxStatus.PENDING
                      ? 'Pending..'
                      : ''}
                  </p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountModal;
