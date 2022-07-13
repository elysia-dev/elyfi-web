import Confirm from './Confirm';
import InputQuantity from './InputQuantity ';
import LoadingIndicator from './LoadingIndicator';
import ModalHeader from './ModalHeader';
import PurchaseButton from './PurchaseButton';
import SelectCrypto from './SelectCrypto';
import Step from './Step';
import WalletAmount from './WalleAmount';

const NFTPurchaseModal: React.FC = () => {
  return (
    <div className="market_modal">
      <div className="market_modal__wrapper">
        <ModalHeader title="채권 NFT" isPurchaseModal={true} />
        <Step stepColor={true} />
        {/* <InputQuantity />
        <SelectCrypto />
        <WalletAmount />
        <PurchaseButton content={'다음'} /> */}
        {/* <Confirm /> */}
        {/* <PurchaseButton content={'구매하기'} /> */}
        <LoadingIndicator />
        <PurchaseButton content={'구매요청 처리중'} isLoading={true} />
      </div>
    </div>
  );
};

export default NFTPurchaseModal;
