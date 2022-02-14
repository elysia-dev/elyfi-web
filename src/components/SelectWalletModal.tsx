import { useWeb3React } from '@web3-react/core';
import injectedConnector from 'src/core/connectors/injectedConnector';
import { FunctionComponent, useEffect, useState } from 'react';
import metamask from 'src/assets/images/metamask.png';
import walletconnect from 'src/assets/images/walletconnect.png';
import walletConnectConnector from 'src/utiles/walletConnector';
import { ethers } from 'ethers';

type Props = {
  selectWalletModalVisible: boolean;
  modalClose: () => void;
};

interface WindowWithEthereum extends Window {
  ethereum?: ethers.providers.Web3Provider;
}

const SelectWalletModal: FunctionComponent<Props> = ({
  selectWalletModalVisible,
  modalClose,
}) => {
  const { activate, active, deactivate } = useWeb3React();
  const [hoverColor, setHoverColor] = useState('#E6E6E6');
  const global: WindowWithEthereum = window as WindowWithEthereum;

  const walletConnectProvider = walletConnectConnector();

  useEffect(() => {
    if (active) {
      modalClose();
    }
  }, [active]);

  return (
    <div
      className="wallet_select_modal"
      style={{
        display: selectWalletModalVisible ? 'flex' : 'none',
      }}>
      <div className="wallet_select_modal__content">
        <>
          <div className="wallet_select_modal__content__header">
            <div>지갑 연결하기</div>
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
                border: `1px solid ${hoverColor}`,
              }}
              onClick={async () => {
                activate(injectedConnector)
                  .then((e) => {
                    window.sessionStorage.setItem('@connect', 'true');
                  })
                  .catch((e) => {
                    console.error('Reject');
                  });
              }}
              onMouseEnter={() => {
                setHoverColor('#00BFFF');
              }}
              onMouseLeave={() => {
                setHoverColor('#E6E6E6');
              }}>
              <img src={metamask} alt={metamask} />
              <div
                style={{
                  fontSize: 15,
                }}>
                Metamask
              </div>
            </div>
          )}
          <div
            className="wallet_select_modal__content__wallet_btn"
            style={{
              border: `1px solid ${hoverColor}`,
            }}
            onClick={async () => {
              await activate(walletConnectProvider);
              modalClose();
            }}
            onMouseEnter={() => {
              setHoverColor('#00BFFF');
            }}
            onMouseLeave={() => {
              setHoverColor('#E6E6E6');
            }}>
            <img src={walletconnect} alt={walletconnect} />
            <div
              style={{
                fontSize: 15,
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
