import { BigNumber } from 'ethers';
import {
  BUSDPerDayOnELFIStakingPool,
  DAIPerDayOnELFIStakingPool,
  ELFIPerDayOnELStakingPool,
} from 'src/core/data/stakings';
import Token from 'src/enums/Token';

export const rewardPerDayByToken = (
  stakedToken: string,
  mainnet: string,
): BigNumber => {
  switch (stakedToken) {
    case 'ELFI':
      if (mainnet === 'BSC') {
        return BUSDPerDayOnELFIStakingPool;
      }
      return DAIPerDayOnELFIStakingPool;
    case 'EL':
    default:
      return ELFIPerDayOnELStakingPool;
  }
};

export const countValue = (
  start: number | number[],
  end: number | number[],
  idx: number,
): {
  start: number;
  end: number;
} => {
  return {
    start: typeof start === 'number' ? start : start[idx],
    end: typeof end === 'number' ? end : end[idx],
  };
};

export const rewardToken = (
  stakedToken: string,
  mainnet: string,
): Token.ELFI | Token.DAI => {
  switch (stakedToken) {
    case 'ELFI':
      //   if (mainnet === 'BSC') {
      //     return Token.BUSD;
      //   }
      return Token.DAI;
    case 'EL':
    default:
      return Token.ELFI;
  }
};
export const rewardLimit = (rewardToken: string, round: number): number => {
  switch (rewardToken) {
    case 'ELFI':
      return round > 1 ? 1000000 : 5000000;
    case 'DAI':
      return round > 1 ? 50000 : 25000;
    case 'BUSD':
      return round > 0 ? 50000 : 12500;
    default:
      return 0;
  }
};

const miningValueByToken = (rewardToken: string, round: number): number => {
  switch (rewardToken) {
    case 'ELFI':
      return 5000000;
    case 'DAI':
      return round > 1 ? 50000 : 25000;
    case 'BUSD':
      return round > 0 ? 50000 : 12500;
    default:
      return 0;
  }
};

export default miningValueByToken;
