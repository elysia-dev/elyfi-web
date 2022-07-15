import { formatCommaSmallFourDisits } from 'src/utiles/formatters';

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
  return (
    <div className="market_modal__input">
      <section>
        <div onClick={() => max()}>최대</div>
        <input
          type="number"
          value={quantity}
          onChange={(e) => {
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
