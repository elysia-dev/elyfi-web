interface Step {
  stepColor: boolean;
}

const Step: React.FC<Step> = ({ stepColor }) => {
  return (
    <div className="market_modal__step">
      <div>
        <p>
          1단계
          <br />
          구매 수량 및 결제 코인 선택
        </p>
      </div>
      <div>
        <p>
          2단계
          <br /> 정보 확인 및 구매
        </p>
      </div>
    </div>
  );
};

export default Step;
