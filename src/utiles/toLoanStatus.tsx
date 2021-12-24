import ABTokenState from 'src/enums/ABTokenState';
import LoanStatus from 'src/enums/LoanStatus';

const toLoanStatus = (abTokenState: ABTokenState): LoanStatus => {
  switch (abTokenState) {
    case ABTokenState.Collateralized:
    case ABTokenState.Matured:
      return LoanStatus.ToBeRepayed;
    case ABTokenState.Redeemed:
      return LoanStatus.RepaymentComplete;
    case ABTokenState.NotPerformed:
      return LoanStatus.LiquidationProgress;
    default:
      return LoanStatus.Default;
  }
};

export default toLoanStatus;
