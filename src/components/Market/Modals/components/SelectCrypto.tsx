import { useState } from 'react';
import ETH from 'src/assets/images/market/eth.svg';
import USDC from 'src/assets/images/USDC.png';

type Props = {
  setPurchaseType: React.Dispatch<React.SetStateAction<string>>;
  purchaseType: string;
};

const SelectCrypto: React.FC<Props> = ({ setPurchaseType, purchaseType }) => {
  const [selectVisible, setSelectVisible] = useState(false);

  return (
    <div className="market_modal__crypto">
      <p>결제 코인</p>
      <div>
        <div
          onClick={() => {
            setSelectVisible((prev) => !prev);
          }}>
          <div>
            <div></div>
            <div></div>
          </div>
          <img
            src={purchaseType === 'ETH' ? ETH : USDC}
            alt={'cryptoImage'}
            width={28}
            height={28}
          />
          {purchaseType === 'ETH' ? 'ETH' : 'USDC'}
        </div>
        <ul style={{ display: selectVisible ? 'block' : 'none' }}>
          {purchaseType === 'ETH' ? (
            <li
              onClick={() => {
                setPurchaseType('USDC');
                setSelectVisible((prev) => !prev);
              }}>
              <img src={USDC} alt={'cryptoImage'} width={28} height={28} />
              USDC
            </li>
          ) : (
            <li
              onClick={() => {
                setPurchaseType('ETH');
                setSelectVisible((prev) => !prev);
              }}>
              <img src={ETH} alt={'cryptoImage'} />
              ETH
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default SelectCrypto;
