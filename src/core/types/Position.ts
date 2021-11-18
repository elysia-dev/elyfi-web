import { BigNumber } from 'ethers';

type Position = {
  id: string;
  incentivePotisions: {
    incentive: {
      pool: string;
      rewardToken: string;
    };
  }[];
  liquidity: BigNumber;
  owner: string;
  staked: boolean;
  tokenId: number;
};

export default Position;

export type TokenInfo = {
  id: string;
  liquidity: string;
  pool: {
    id: string;
  };
};
