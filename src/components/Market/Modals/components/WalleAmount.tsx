import { BigNumber } from 'ethers';
import { formatCommaSmallFourDisits } from 'src/utiles/formatters';

interface Amount {
  balances: {
    usdc: number;
    eth: number;
  };
}

const WalletAmount: React.FC<Amount> = ({ balances }) => {
  return (
    <div className="market_modal__amount">
      <div>
        <div>잔여 NFT 수량</div>
        <div>123,456</div>
      </div>
      <div>
        <div>지갑 잔액</div>
        <div>
          <div>
            {formatCommaSmallFourDisits(balances.eth)}
            <span>ETH</span>
          </div>
          <div>
            {formatCommaSmallFourDisits(balances.usdc)}
            <span>USDC</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletAmount;