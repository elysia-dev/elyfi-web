import { Trans, useTranslation } from 'react-i18next';

interface Props {
  onClose: () => void;
  holdingNft: number;
  nftPerUsdc: number;
}

const InvestRewardModal: React.FC<Props> = ({ onClose }) => {
  const { t, i18n } = useTranslation();

  return (
    <>
      <div className="market_modal" style={{ display: 'block' }}>
        <div className="market_modal__wrapper">
          <header className={`market_modal__header `}>
            <h3>수익금 수령하기</h3>
            <div onClick={onClose}>
              <div></div>
              <div></div>
            </div>
          </header>
          <div className="market_modal__investment-reward">
            <section className="market_modal__investment-reward__burn">
              <b>나의 보유수량</b>
              <div>
                <b>
                  123,456<span>NFT(S)</span>
                </b>
              </div>
              <p>* 수익금 수령 시, 해당 NFT 전부 소각됩니다.</p>
            </section>
            <section className="market_modal__investment-reward__current">
              <div>
                <b>나의 수익금</b>
                <b>
                  123.34<span>USDC</span>
                </b>
              </div>
              <section>
                <div>
                  <p>상환금</p>
                  <p>
                    100<span>USDC</span>
                  </p>
                </div>
                <div>
                  <p>이벤트 보상</p>
                  <p>
                    100<span>USDC</span>
                  </p>
                </div>
              </section>
            </section>
          </div>
          <div className={`market_modal__investment-reward__button `}>
            <button>승인하기</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvestRewardModal;
