import { BigNumber } from 'ethers';
import { useTranslation } from 'react-i18next';
import {
  formatCommaSmallFourDisits,
  formatCommaSmallZeroDisits,
} from 'src/utiles/formatters';

interface Amount {
  balances: {
    usdc: number;
    eth: number;
  };
  remainingNFT: number;
}

const WalletAmount: React.FC<Amount> = ({ balances, remainingNFT }) => {
  const { t } = useTranslation();

  return (
    <div className="market_modal__amount">
      <div>
        <div>{t('nftModal.purchaseModal.remainigNFT')}</div>
        <div>
          {formatCommaSmallZeroDisits(remainingNFT)} <span>NFT(s)</span>
        </div>
      </div>
      <div>
        <div>{t('nftModal.purchaseModal.wallet')}</div>
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
