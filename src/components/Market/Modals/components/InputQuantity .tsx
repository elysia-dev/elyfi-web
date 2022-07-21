import { useTranslation } from 'react-i18next';
import {
  formatCommaSmallFourDisits,
  formatCommaSmallZeroDisits,
} from 'src/utiles/formatters';

interface Props {
  setQuantity: React.Dispatch<React.SetStateAction<string>>;
  quantity: string;
  dollar: number;
  crypto: number | undefined;
  purchaseType: string;
  max: () => void;
}

const InputQuantity: React.FC<Props> = ({
  setQuantity,
  quantity,
  dollar,
  crypto,
  purchaseType,
  max,
}) => {
  const { t } = useTranslation();

  return (
    <div className="market_modal__input">
      <section>
        <div onClick={() => max()}>
          <p>{t('nftModal.purchaseModal.max')}</p>
        </div>
        <input
          type="string"
          value={
            quantity === '' ? '' : formatCommaSmallZeroDisits(Number(quantity))
          }
          placeholder={'0'}
          onChange={(e) => {
            const regex = new RegExp(/[^0-9,]/g);
            if (regex.test(e.target.value)) {
              return;
            }
            if (!e.target.value) {
              setQuantity('0');
              return;
            }
            if (e.target.value.length >= 2 && e.target.value[0] === '0') {
              setQuantity(e.target.value.split(',').join(''));
              return;
            }
            setQuantity(e.target.value.split(',').join(''));
          }}
        />
      </section>
      <p>
        {crypto && formatCommaSmallFourDisits(crypto)} {purchaseType} ≒ $
        {formatCommaSmallZeroDisits(dollar)}
      </p>
    </div>
  );
};
export default InputQuantity;
