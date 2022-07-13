import ETH from 'src/assets/images/market/eth.svg';

const SelectCrypto: React.FC = () => {
  return (
    <div className="market_modal__crypto">
      <p>결제 코인</p>
      <div>
        <div>
          <div>
            <div></div>
            <div></div>
          </div>
          <img src={ETH} alt={'cryptoImage'} />
          ETH
        </div>
        <ul style={{ display: 'none' }}>
          <li>
            {' '}
            <img src={ETH} alt={'cryptoImage'} />
            ETH
          </li>
          <li>
            {' '}
            <img src={ETH} alt={'cryptoImage'} />
            USDC
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SelectCrypto;
