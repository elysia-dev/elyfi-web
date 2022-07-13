const Confirm: React.FC = () => {
  return (
    <div className="market_modal__confirm">
      <h3>구매정보 확인</h3>
      <div>
        <div>구매 수량</div>
        <div>123,456</div>
      </div>
      <div>
        <div>예상 결제 금액</div>
        <div>
          <div>
            123,456<span>ETH</span>
          </div>
          <div>≒ $0.0</div>
        </div>
      </div>
      <div>
        <h5>꼭! 알아두세요</h5>
        <ul>
          <li>
            구매 요청을 할 경우, 이더리움 네트워크 이용 수수료가 발생합니다.
            <br />
            <span>예상 가스비: 0.1234ETH(≒ $123.xx)</span>
          </li>
          <li>
            이더(ETH)로 구매 요청할 경우, 요청 즉시 예상 결제 금액이 유니스
            왑에서 USDC로 교환되어 결제됩니다. 이더(ETH)의 가격은 실시간 으로
            변동하기 때문에 예상 결제 금액이 실제로 필요한 금액보다 적 을 수
            있습니다. 이 경우에 구매 요청이 거절될 수 있으며, 구매를 실 패한
            경우에도 이더리움 네트워크 이용 수수료가 발생합니다.
          </li>
          <li>
            USDC로 구매 요청할 경우에는 별다른 과정 없이 바로 구매가 가능
            합니다. 다만, 구매 요청 시점에 잔여 NFT 수량이 없을 경우 구매 요
            청이 거절될 수 있으며, 이러한 경우에도 이더리움 네트워크 이용 수
            수료가 발생합니다.
          </li>
          <li>
            최종 구매 전에 본 상품에 대한 유의사항을 다시 한 번 확인해주세요.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Confirm;
