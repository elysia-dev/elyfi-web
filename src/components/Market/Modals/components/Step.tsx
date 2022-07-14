import { useState } from 'react';

interface Step {
  stepColor: boolean;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  currentStep: number;
}

const Step: React.FC<Step> = ({ stepColor, currentStep, setCurrentStep }) => {
  return (
    <div className={`market_modal__step`}>
      <div
        onClick={() => setCurrentStep(1)}
        className={currentStep === 1 ? 'current' : 'prev'}>
        <p>
          1단계
          <br />
          구매 수량 및 결제 코인 선택
        </p>
        <div
          className={currentStep === 1 ? 'current_polygon' : 'prev_polygon'}
        />
      </div>
      <div className={currentStep >= 2 ? 'current' : 'prev'}>
        <p>
          2단계
          <br /> 정보 확인 및 구매
        </p>
      </div>
    </div>
  );
};

export default Step;
