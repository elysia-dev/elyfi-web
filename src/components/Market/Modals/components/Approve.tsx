import { useTranslation } from 'react-i18next';

const Approve: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="market_modal__approve">
      <h5>{t('nftModal.approve.0')}</h5>
      <div>
        <p>{t('nftModal.approve.1')}</p>
        <br />
        <p>
          <span>{t('nftModal.approve.2')}</span> {t('nftModal.approve.3')}
        </p>
      </div>
      <p>
        <span>*</span>
        {t('nftModal.approve.4', { eth: 123, dollar: 123 })}
      </p>
    </div>
  );
};

export default Approve;
