import { useWeb3React } from '@web3-react/core';
import injectedConnector from 'src/core/connectors/injectedConnector';
import { FunctionComponent, useState } from 'react';
import metamask from 'src/assets/images/metamask@2x.png';
import walletconnect from 'src/assets/images/walletconnect@2x.png';
import browserWallet from 'src/assets/images/browserWallet@2x.png';
import walletConnectConnector from 'src/utiles/walletConnectProvider';
import { ethers } from 'ethers';
import { isMoblie, setWalletConnect } from 'src/utiles/connectWallet';
import { useTranslation } from 'react-i18next';
import AppColors from 'src/enums/AppColors';

type Props = {
  selectWalletModalVisible: boolean;
  modalClose: () => void;
};

interface WindowWithEthereum extends Window {
  ethereum?: ethers.providers.Web3Provider;
}

const global: WindowWithEthereum = window as WindowWithEthereum;

const SelectWalletModal: FunctionComponent<Props> = ({
  selectWalletModalVisible,
  modalClose,
}) => {
  const { t } = useTranslation();
  const { activate } = useWeb3React();
  const [hoverColor, setHoverColor] = useState({
    metamask: AppColors.selectWalletBorderColor,
    walletconnect: AppColors.selectWalletBorderColor,
  });
  const walletConnectProvider = walletConnectConnector();

  const walletImg = isMoblie() ? browserWallet : metamask;

  return (
    <div
      className="wallet_select_modal"
      style={{
        display: selectWalletModalVisible ? 'flex' : 'none',
      }}>
      <div
        className="wallet_select_modal__content"
        style={{
          height:
            global.ethereum && typeof global.ethereum === 'object' ? 263 : 180,
        }}>
        <>
          <div className="wallet_select_modal__content__header">
            <div>{t('navigation.connect_wallet')}</div>
            <div className="close-button" onClick={() => modalClose()}>
              <div className="close-button--1">
                <div className="close-button--2" />
              </div>
            </div>
          </div>
          <div className="wallet_select_modal__content__line" />
          {global.ethereum && typeof global.ethereum === 'object' && (
            <div
              className="wallet_select_modal__content__wallet_btn"
              style={{
                border: `1px solid ${hoverColor.metamask}`,
              }}
              onClick={async () => {
                activate(injectedConnector)
                  .then((e) => {
                    setWalletConnect('metamask');
                    modalClose();
                  })
                  .catch((e) => {
                    console.error('Reject');
                  });
              }}
              onMouseEnter={() => {
                setHoverColor({
                  ...hoverColor,
                  metamask: AppColors.hoverColor,
                });
              }}
              onMouseLeave={() => {
                setHoverColor({
                  ...hoverColor,
                  metamask: AppColors.selectWalletBorderColor,
                });
              }}>
              <img src={walletImg} alt={walletImg} />
              <div
                style={{
                  fontSize: isMoblie() ? 12 : 15,
                }}>
                {isMoblie()
                  ? 'Browser Wallet\n(MetaMask / Trust Wallet / imToken)'
                  : 'Metamask'}
              </div>
            </div>
          )}
          <div
            className="wallet_select_modal__content__wallet_btn"
            style={{
              border: `1px solid ${hoverColor.walletconnect}`,
            }}
            onClick={async () => {
              await activate(walletConnectProvider);
              modalClose();
            }}
            onMouseEnter={() => {
              setHoverColor({
                ...hoverColor,
                walletconnect: AppColors.hoverColor,
              });
            }}
            onMouseLeave={() => {
              setHoverColor({
                ...hoverColor,
                walletconnect: AppColors.selectWalletBorderColor,
              });
            }}>
            <img src={walletconnect} alt={walletconnect} />
            <div
              style={{
                fontSize: isMoblie() ? 12 : 15,
              }}>
              WalletConnect
            </div>
          </div>
        </>
      </div>
    </div>
  );
};

export default SelectWalletModal;
