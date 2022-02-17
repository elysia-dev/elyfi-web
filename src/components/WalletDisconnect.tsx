import { useWeb3React } from '@web3-react/core';
import { FunctionComponent, useContext } from 'react';
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
  const { type: getMainnetType } = useContext(MainnetContext);

  return (
    <div
      className="change_network_modal"
      style={{
        display: modalVisible ? 'flex' : 'none',
      }}>
      <div className="change_network_modal__content">
        <div className="change_network_modal__content__header">
          <div>네트워크 변경하기</div>
          <div className="close-button" onClick={() => modalClose()}>
            <div className="close-button--1">
              <div className="close-button--2" />
            </div>
          </div>
        </div>
        <div className="change_network_modal__content__line" />
        <div className="change_network_modal__content__guide">
          <div>
            엘리파이에서 {getMainnetType}를 이용하기 위해서{'\n'}
            지갑에서 해당 네트워크로 변경한 후에 지갑을 다시 연결해주세요!
          </div>
          <div>
            (연결한 지갑이해당네트워크를 지원하는 지갑인지확인해주세요.)
          </div>
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
          지갑 다시 연결하기
        </div>
      </div>
    </div>
  );
};

export default WalletDisconnect;
