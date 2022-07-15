const Approve: React.FC = () => {
  return (
    <div className="market_modal__approve">
      <h5>접근 권한을 승인해주세요!</h5>
      <div>
        <p>
          본 상품을 구매하기 위해서는 연결된 지갑에 해당 앱이 접근 할 수 있도록
          접근 권한을 승인해야 합니다.
        </p>
        <br />
        <p>
          <span>최초</span> 구매 시에만 지갑 소유주의 승인이 필요하며, 성공적으
          로 승인이 완료될 경우 승인 절차 없이 구매할 수 있습니다.
        </p>
      </div>
      <p>
        <span>*</span>이더리움 네트워크 이용 수수료가 발생합니다. 예상 가스비:
        0.1234ETH(≒ $123.xx)
      </p>
    </div>
  );
};

export default Approve;
