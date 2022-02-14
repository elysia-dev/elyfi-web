import { useWeb3React } from '@web3-react/core';
import { FunctionComponent } from 'react';

type Props = {
  modalVisible: boolean;
  //   isWrongNetwork: boolean;
  modalClose: () => void;
};

const WalletDisconnect: FunctionComponent<Props> = ({
  modalVisible,
  modalClose,
}) => {
  const { deactivate } = useWeb3React();

  return (
    <div
      className="wallet_select_modal"
      style={{
        display: modalVisible ? 'flex' : 'none',
      }}>
      <div className="wallet_select_modal__content">
        <div
          onClick={() => {
            window.sessionStorage.setItem('@connect', 'false');
            deactivate();
            modalClose();
          }}>
          연결끊기
        </div>
      </div>
    </div>
  );
};

export default WalletDisconnect;
