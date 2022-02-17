import { useWeb3React } from '@web3-react/core';
import { FunctionComponent, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import MainnetContext from 'src/contexts/MainnetContext';

type Props = {
  modalVisible: boolean;
  selectWalletModalVisible: () => void;
  modalClose: () => void;
};

const WalletDisconnect: FunctionComponent<Props> = ({
  modalVisible,
  selectWalletModalVisible,
  modalClose,
}) => {
  const { deactivate } = useWeb3React();
  const { t } = useTranslation();
  const { type: getMainnetType } = useContext(MainnetContext);

  return (
    <div
      className="change_network_modal"
      style={{
        display: modalVisible ? 'flex' : 'none',
      }}>
      <div className="change_network_modal__content">
        <div className="change_network_modal__content__header">
          <div>{t('modal.wallet_change_netwrok.title')}</div>
          <div className="close-button" onClick={() => modalClose()}>
            <div className="close-button--1">
              <div className="close-button--2" />
            </div>
          </div>
        </div>
        <div className="change_network_modal__content__line" />
        <div className="change_network_modal__content__guide">
          <div>
            {t('modal.wallet_change_netwrok.content', {
              network: getMainnetType,
            })}
          </div>
          <div>{t('modal.wallet_change_netwrok.subContent')}</div>
        </div>
        <div className="change_network_modal__content__line" />
        <div
          className="change_network_modal__content__button"
          onClick={() => {
            window.sessionStorage.setItem('@connect', 'false');
            deactivate();
            modalClose();
            selectWalletModalVisible();
          }}>
          {t('modal.wallet_change_netwrok.button')}
        </div>
      </div>
    </div>
  );
};

export default WalletDisconnect;
