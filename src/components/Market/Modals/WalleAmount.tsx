const WalletAmount: React.FC = () => {
  return (
    <div className="market_modal__amount">
      <div>
        <div>잔여 NFT 수량</div>
        <div>123,456</div>
      </div>
      <div>
        <div>지갑 잔액</div>
        <div>
          <div>
            123,456<span>ETH</span>
          </div>
          <div>
            123,456<span>USDC</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletAmount;
