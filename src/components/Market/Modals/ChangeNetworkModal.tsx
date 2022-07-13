import MainnetType from 'src/enums/MainnetType';
import ModalHeader from './ModalHeader';
// eslint-disable-next-line import/order
import ETH from 'src/assets/images/eth_logo.svg';
import WalletButton from './WalletButton';
import WalletSection from './WalletSection';

interface Props {
  network: MainnetType;
}

const ChangeNetworkModal: React.FC<Props> = ({ network }) => {
  return (
    <div className="market_modal" style={{ display: 'block' }}>
      <div className="market_modal__wrapper">
        <ModalHeader title="네트워크 변경하기" />
        <WalletSection
          content={
            <p>
              채권 NFT를 구매하기 위해서는 이더리움 네트워크로 변경해야 합니다.
              <br />
              이더리움 네트워크로 변경하려면 아래 버튼을 클릭해주세요.
            </p>
          }
        />
        <WalletButton content="Ethereum" image={ETH} />
      </div>
    </div>
  );
};

export default ChangeNetworkModal;
