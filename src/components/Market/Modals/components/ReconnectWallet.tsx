import ModalHeader from './ModalHeader';
import WalletButton from './WalletButton';
import WalletSection from './WalletSection';

interface Props {
  modalClose: () => void;
  onClickHandler: () => void;
}

const ReconnectWallet: React.FC<Props> = ({ modalClose, onClickHandler }) => {
  return (
    <div className="market_modal">
      <div className="market_modal__wrapper">
        <ModalHeader title="네트워크 변경하기" modalClose={modalClose} />
        <WalletSection
          content={
            <>
              <p>
                채권 NFT를 구매하기 위해서는 이더리움 네트워크로 변경해야
                합니다. <br />
                연결한 지갑에서 이더리움 네트워크로 변경한 후에 지갑을 다시
                연결해주세요!
              </p>
              <p>
                (연결한 지갑이 이더리움 네트워크를 지원하는지 확인해주세요.)
              </p>
            </>
          }
        />
        <WalletButton
          content="지갑 다시 연결하기"
          onClickHandler={onClickHandler}
        />
      </div>
    </div>
  );
};

export default ReconnectWallet;
