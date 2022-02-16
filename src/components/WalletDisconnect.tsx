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
      className="wallet_select_modal"
      style={{
        display: modalVisible ? 'flex' : 'none',
      }}>
      <div className="wallet_select_modal__content">
        <div>네트워크 에러</div>
        <div>
          엘리파이에서 {getMainnetType}를이용하기위해서는지갑에서해당
          네트워크로변경한후에지갑을다시연결해주세요!
        </div>
        <div>(연결한 지갑이해당네트워크를 지원하는 지갑인지확인해주세요.)</div>
        <div
          onClick={() => {
            window.sessionStorage.setItem('@connect', 'false');
            deactivate();
            modalClose();
            selectWalletModalVisible();
          }}>
          지갑 연결하기
        </div>
      </div>
    </div>
  );
};

export default WalletDisconnect;
