import { Trans, useTranslation } from 'react-i18next';
import { formatCommaSmallFourDisits } from 'src/utiles/formatters';

type Props = {
  quantity: string;
  dollar: number;
  crypto: number | undefined;
  purchaseType: string;
  gasFeeInfo: {
    gasFee: number;
    gasFeeToDollar: number;
  };
};

const Confirm: React.FC<Props> = ({
  quantity,
  dollar,
  crypto,
  purchaseType,
  gasFeeInfo,
}) => {
  const { t } = useTranslation();
  return (
    <div className="market_modal__confirm">
      <h3>{t('nftModal.confirm.header')}</h3>
      <div>
        <div>{t('nftModal.confirm.purchaseQuantity')}</div>
        <div>{quantity}</div>
      </div>
      <div>
        <div>{t('nftModal.confirm.estimatedAmount')}</div>
        <div>
          <div>
            {crypto && formatCommaSmallFourDisits(crypto)}
            <span>{purchaseType}</span>
          </div>
          <div>≒ ${dollar}</div>
        </div>
      </div>
      <div>
        <h5>{t('nftModal.confirm.content.0')}</h5>
        <ul>
          <li>
            <Trans>{t('nftModal.confirm.content.1')}</Trans>
            <br />
            <span>
              {t('nftModal.confirm.content.2', {
                eth: gasFeeInfo.gasFee.toFixed(4),
                dollar: gasFeeInfo.gasFeeToDollar.toFixed(4),
              })}
            </span>
          </li>
          <li>{t('nftModal.confirm.content.3')}</li>
          <li>{t('nftModal.confirm.content.4')}</li>
          <li>{t('nftModal.confirm.content.5')}</li>
        </ul>
      </div>
    </div>
  );
};

export default Confirm;
