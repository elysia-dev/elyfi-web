import { BigNumber } from 'ethers';
import Token from 'src/enums/Token';

type DepositBalance = {
  loading: boolean;
  tokenName: Token.DAI | Token.USDT;
  value: BigNumber;
  incentive: BigNumber[];
  daiIncentiveRound1: BigNumber[];
  daiIncentiveRound2: BigNumber[];
  usdtIncentiveRound1: BigNumber[];
  usdtIncentiveRound2: BigNumber[];
  deposit: BigNumber;
  updatedAt: number;
};

export default DepositBalance;
