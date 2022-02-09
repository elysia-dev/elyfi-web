import { useWeb3React } from '@web3-react/core';
import envs from 'src/core/envs';
import WalletConnectConnector from 'src/core/connectors/WalletConnector';
import injectedConnector from 'src/core/connectors/injectedConnector';
import { FunctionComponent, useContext, useEffect, useState } from 'react';
import MainnetContext from 'src/contexts/MainnetContext';
import metamask from 'src/assets/images/metamask.png';
import walletconnect from 'src/assets/images/walletconnect.png';

type Props = {
  selectWalletModalVisible: boolean;
  modalClose: () => void;
};

const SelectWalletModal: FunctionComponent<Props> = ({
  selectWalletModalVisible,
  modalClose,
}) => {
  const { activate, active } = useWeb3React();
  const [hoverColor, setHoverColor] = useState('#E6E6E6');

  const walletTest = new WalletConnectConnector({
    rpc: {
      1:
        process.env.NODE_ENV === 'development'
          ? 'https://elyfi-test.elyfi.world:8545'
          : process.env.REACT_APP_JSON_RPC || '',
      56: 'https://bsc-dataseed.binance.org/',
      97: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
    },
    bridge: 'https://bridge.walletconnect.org',
    qrcode: true,
    pollingInterval: 1200,
    preferredNetworkId: 1337,
    infuraId: envs.infuraAddress,
    qrcodeModalOptions: {
      mobileLinks: [
        'rainbow',
        'metamask',
        'argent',
        'trust',
        'imtoken',
        'pillar',
      ],
    },
  });

  useEffect(() => {
    if (active) {
      modalClose();
    }
  }, [active]);

  return (
    <div
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: '100%',
        height: '100vh',
        background: 'rgba(0,0,0,0.4)',
        display: selectWalletModalVisible ? 'flex' : 'none',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      //   onClick={() => modalClose()}
    >
      <div
        style={{
          background: '#ffffff',
          width: 418,
          height: 272.5,
          borderRadius: 5,
          boxShadow: '0px 3px 6px #00000029',
        }}>
        <div
          style={{
            paddingLeft: 25,
            paddingTop: 24.5,
            paddingRight: 23,
            paddingBottom: 22.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <div>지갑 연결하기</div>
          <div className="close-button" onClick={() => modalClose()}>
            <div className="close-button--1">
              <div className="close-button--2" />
            </div>
          </div>
        </div>
        <div
          style={{
            width: '100%',
            height: 1,
            border: '1px solid #F0F0F1',
          }}
        />
        <div
          style={{
            marginLeft: 25,
            marginTop: 24.5,
            marginRight: 23,
            marginBottom: 22.5,
            display: 'flex',
            alignItems: 'center',
            border: `1px solid ${hoverColor}`,
            width: 373.75,
            height: 55,
            borderRadius: 5,
            paddingTop: 15,
            paddingLeft: 36.5,
            paddingBottom: 13,
            cursor: 'pointer',
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
          <img
            style={{
              width: 28,
              height: 27,
              marginRight: 15,
            }}
            src={metamask}
            alt={metamask}
          />
          <div
            style={{
              fontSize: 15,
            }}>
            Metamask
          </div>
        </div>
        <div
          style={{
            marginLeft: 25,
            marginTop: 24.5,
            marginRight: 23,
            marginBottom: 22.5,
            display: 'flex',
            alignItems: 'center',
            border: `1px solid ${hoverColor}`,
            width: 373.75,
            height: 55,
            borderRadius: 5,
            paddingTop: 15,
            paddingLeft: 36.5,
            paddingBottom: 13,
            cursor: 'pointer',
          }}
          onClick={async () => {
            await activate(walletTest);
          }}
          onMouseEnter={() => {
            setHoverColor('#00BFFF');
          }}
          onMouseLeave={() => {
            setHoverColor('#E6E6E6');
          }}>
          <img
            style={{
              width: 28,
              height: 27,
              marginRight: 15,
            }}
            src={walletconnect}
            alt={walletconnect}
          />
          <div
            style={{
              fontSize: 15,
            }}>
            WalletConnect
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectWalletModal;
