import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

interface Step {
  stepColor: boolean;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  currentStep: number;
}

const Step: React.FC<Step> = ({ stepColor, currentStep, setCurrentStep }) => {
  const { t } = useTranslation();

  return (
    <div className={`market_modal__step`}>
      <div
        onClick={() => setCurrentStep(1)}
        className={currentStep === 1 ? 'current' : 'prev'}>
        <p>
          <Trans>{t('nftModal.purchaseModal.stepOne')}</Trans>
        </p>
        <div
          className={currentStep === 1 ? 'current_polygon' : 'prev_polygon'}
        />
      </div>
      <div className={currentStep >= 2 ? 'current' : 'prev'}>
        <p>
          <Trans>{t('nftModal.purchaseModal.stepTwo')}</Trans>
        </p>
      </div>
    </div>
  );
};

export default Step;
