import { useWeb3React } from '@web3-react/core';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import mainnetConverter from 'src/utiles/mainnetConverter';
import TxContext from 'src/contexts/TxContext';
import Fail from 'src/assets/images/status__fail.png';
import Confirm from 'src/assets/images/status__confirm.png';
import NewTab from 'src/assets/images/new_tab.png';
import Copy from 'src/assets/images/copy.png';
import envs from 'src/core/envs';
import TxStatus from 'src/enums/TxStatus';
import Davatar from '@davatar/react';
import ModalHeader from 'src/components/ModalHeader';
import { useENS } from 'src/hooks/useENS';
import MainnetContext from 'src/contexts/MainnetContext';
import MainnetType from 'src/enums/MainnetType';
import useMediaQueryType from 'src/hooks/useMediaQueryType';
import MediaQuery from 'src/enums/MediaQuery';

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

  const addELFIToken = async (data: string[]) => {
    try {
      await window.ethereum?.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: data[3],
            symbol: data[1],
            decimals: data[2],
            image: data[0],
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
                reset();
                closeHandler();
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
                  ? envs.etherscanURI
                  : envs.bscscanURI
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
          {/* <div className="modal__account__add-tokens">
            <h2>
              토큰 불러오기
            </h2>
            <div>
              {
                tokenDataArray.map((data, index) => {
                  return (
                    <div key={index} onClick={() => addELFIToken(data)}>
                      <img src={data[0]} />
                      <p>
                        {data[1]}
                      </p>
                    </div>
                  )
                })
              }
            </div>
          </div> */}
          <div className="modal__account__status">
            <p className="modal__header__name spoqa__bold">
              {t('transaction.activity__title')}
            </p>

            <a
              href={
                txHash
                  ? `${
                      getMainnetType === MainnetType.Ethereum
                        ? envs.etherscanURI
                        : envs.bscscanURI
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
