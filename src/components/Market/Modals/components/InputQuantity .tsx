import { formatCommaSmallFourDisits } from 'src/utiles/formatters';
import { NumberLiteralType } from 'typescript';

interface Props {
  setQuantity: React.Dispatch<React.SetStateAction<string>>;
  quantity: string;
  dollar: number;
  crypto: number | undefined;
  purchaseType: string;
}

const InputQuantity: React.FC<Props> = ({
  setQuantity,
  quantity,
  dollar,
  crypto,
  purchaseType,
}) => {
  return (
    <div className="market_modal__input">
      <section>
        <div>최대</div>
        <input
          type="number"
          value={quantity}
          onChange={(e) => {
            console.log(e.target.value);
            if (!e.target.value) {
              setQuantity('0');
              return;
            }
            if (e.target.value.includes('.')) return;
            if (e.target.value.length >= 2 && e.target.value[0] === '0') {
              setQuantity(e.target.value.substring(1));
              return;
            }
            setQuantity(e.target.value);
          }}
        />
      </section>
      <p>
        {crypto && formatCommaSmallFourDisits(crypto)} {purchaseType} ≒ $
        {dollar}
      </p>
    </div>
  );
};
export default InputQuantity;
