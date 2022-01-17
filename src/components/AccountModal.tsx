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
import ModalHeader from './ModalHeader';

const AccountModal: React.FunctionComponent<{
  visible: boolean;
  closeHandler: () => void;
}> = ({ visible, closeHandler }) => {
  const { account, deactivate, chainId } = useWeb3React();
  const { t } = useTranslation();
  const { reset, txHash, txStatus, txType } = useContext(TxContext);

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
                <div />
                <p className="spoqa__bold">
                  {account?.slice(0, 8)}....{account?.slice(-6)}
                </p>
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
              href={`${envs.externalApiEndpoint.etherscanURI}/address/${account}`}
              target="_blank"
              className="link">
              <div>
                <img src={NewTab} alt="On Etherscan" />
                <p>{t('transaction.on_etherscan')}</p>
              </div>
            </a>
          </div>

          <div className="modal__account__status">
            <p className="modal__header__name spoqa__bold">
              {t('transaction.activity__title')}
            </p>

            <a
              href={
                txHash
                  ? `${envs.externalApiEndpoint.etherscanURI}/tx/${txHash}`
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
