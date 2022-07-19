import { Trans, useTranslation } from 'react-i18next';

type Props = {
  approveGasFeeInfo: {
    approveGasFee?: number;
    gasFeeToDollar: number;
  };
};

const Approve: React.FC<Props> = ({ approveGasFeeInfo }) => {
  const { t } = useTranslation();

  return (
    <div className="market_modal__approve">
      <h5>{t('nftModal.approve.0')}</h5>
      <div>
        <p>{t('nftModal.approve.1')}</p>
        <br />
        <p>
          <Trans>{t('nftModal.approve.2')}</Trans>
        </p>
        <br />
        <p>{t('nftModal.approve.3')}</p>
      </div>
      <p>
        <span>*</span>
        {t('nftModal.approve.4', {
          eth: approveGasFeeInfo.approveGasFee?.toFixed(4),
          dollar: approveGasFeeInfo.gasFeeToDollar?.toFixed(4),
        })}
      </p>
    </div>
  );
};

export default Approve;
