import { useWeb3React } from '@web3-react/core';
import { useTranslation } from 'react-i18next';
import ModalHeader from 'src/components/ModalHeader';
import InjectedConnector from 'src/core/connectors/injectedConnector';

const WrongMainnetModal: React.FunctionComponent<{
  visible: boolean;
  onClose: () => void;
}> = ({ visible, onClose }) => {
  const { t } = useTranslation();
  return (
    <div
      className="modal modal__wrong-mainnet"
      style={{ display: visible ? 'block' : 'none' }}>
      <div className="modal__container">
        <ModalHeader
          title={"잘못된 네트워크"}
          onClose={onClose}
        />
        <div className="modal__connect__content">
          <p>현재 연결한 지갑이 ELYFI 에서 제공하지 않는 네트워크로 연결돼 있습니다. Ethereum 또는 BSC 네트워크로 변경해주세요!</p>
        </div>
        <div
          className={`modal__button`}
          onClick={onClose}>
          <p>
            ㅇㅋ
          </p>
        </div>
      </div>
    </div>
  );
};

export default WrongMainnetModal;
