import { FunctionComponent } from 'react';

type Props = {
  modalVisible: boolean;
  closeModal: () => void;
};

const ChangeNetworkGuideModal: FunctionComponent<Props> = ({
  modalVisible,
  closeModal,
}) => {
  const isWalletConnet =
    window.sessionStorage.getItem('@walletConnect') === 'true';

  return (
    <div
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: '100%',
        height: '100vh',
        background: 'rgba(0,0,0,0.4)',
        display: modalVisible && isWalletConnet ? 'flex' : 'none',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
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
          <div className="close-button" onClick={() => closeModal()}>
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
      </div>
    </div>
  );
};

export default ChangeNetworkGuideModal;
