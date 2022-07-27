import { Trans, useTranslation } from 'react-i18next';
import { formatCommaSmallTwoDisits } from 'src/utiles/formatters';

interface Props {
  onClose: () => void;
  holdingNft: number;
  usdcPerNft: number;
  eventReward: number;
  nftInterest: number;
  onSubmit: () => void;
}

const InvestRewardModal: React.FC<Props> = ({
  onClose,
  holdingNft,
  usdcPerNft,
  eventReward,
  nftInterest,
  onSubmit,
}) => {
  const { t, i18n } = useTranslation();

  return (
    <>
      <div className="market_modal" style={{ display: 'block' }}>
        <div className="market_modal__wrapper">
          <header className={`market_modal__header `}>
            <h3>{t('nftModal.reward.title')}</h3>
            <div onClick={onClose}>
              <div></div>
              <div></div>
            </div>
          </header>
          <div className="market_modal__investment-reward">
            <section className="market_modal__investment-reward__burn">
              <b>{t('nftModal.reward.currentHolding')}</b>
              <div>
                <b>
                  {formatCommaSmallTwoDisits(holdingNft)}
                  <span>NFT(S)</span>
                </b>
              </div>
              <p>{t('nftModal.reward.content')}</p>
            </section>
            <section className="market_modal__investment-reward__current">
              <div>
                <b>{t('nftModal.reward.currentReward')}</b>
                <b>
                  {formatCommaSmallTwoDisits(
                    holdingNft * (usdcPerNft + nftInterest) + eventReward,
                  )}
                  <span>USDC</span>
                </b>
              </div>
              <section>
                <div>
                  <p>{t('nftModal.reward.repayment')}</p>
                  <p>
                    {formatCommaSmallTwoDisits(
                      holdingNft * (usdcPerNft + nftInterest),
                    )}
                    <span>USDC</span>
                  </p>
                </div>
                <div>
                  <p>{t('nftModal.reward.eventReward')}</p>
                  <p>
                    {formatCommaSmallTwoDisits(eventReward)}
                    <span>USDC</span>
                  </p>
                </div>
              </section>
            </section>
          </div>
          <div className={`market_modal__investment-reward__button `}>
            <button onClick={onSubmit}>{t('nftModal.reward.claim')}</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvestRewardModal;
