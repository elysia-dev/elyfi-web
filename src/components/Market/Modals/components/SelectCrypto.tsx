import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ETH from 'src/assets/images/market/eth.svg';
import USDC from 'src/assets/images/USDC.png';

type Props = {
  setPurchaseType: React.Dispatch<React.SetStateAction<string>>;
  setSelectVisible: React.Dispatch<React.SetStateAction<boolean>>;
  selectVisible: boolean;
  purchaseType: string;
};

const SelectCrypto: React.FC<Props> = ({
  setPurchaseType,
  purchaseType,
  setSelectVisible,
  selectVisible,
}) => {
  const { t } = useTranslation();
  console.log(selectVisible);
  return (
    <div className="market_modal__crypto">
      <p>{t('nftModal.purchaseModal.paymentCrypto')}</p>
      <div
        onMouseLeave={() => {
          setSelectVisible(false);
        }}>
        <div
          onClick={() => {
            setSelectVisible((prev) => !prev);
          }}>
          <div
            style={{
              transform: selectVisible ? 'rotate(180deg)' : '',
            }}>
            <div></div>
            <div></div>
          </div>
          <img src={purchaseType === 'ETH' ? ETH : USDC} alt={'cryptoImage'} />
          {purchaseType === 'ETH' ? 'ETH' : 'USDC'}
        </div>
        <ul style={{ display: selectVisible ? 'block' : 'none' }}>
          {purchaseType === 'ETH' ? (
            <li
              onClick={() => {
                setPurchaseType('USDC');
                setSelectVisible(false);
              }}>
              <img src={USDC} alt={'cryptoImage'} />
              USDC
            </li>
          ) : (
            <li
              onClick={() => {
                setPurchaseType('ETH');
                setSelectVisible(false);
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
