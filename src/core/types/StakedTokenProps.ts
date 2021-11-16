import { BigNumber } from 'ethers';
import { Dispatch, SetStateAction } from 'react';
import Position from './Position';

type StakedTokenProps = {
  stakedPositions: Position[];
  unstakeTokenId: number;
  setUnstakeTokenId: Dispatch<SetStateAction<number>>;
  ethElfiStakedLiquidity: BigNumber;
  daiElfiStakedLiquidity: BigNumber;
  ethPoolTotalLiquidity: number;
  daiPoolTotalLiquidity: number;
};

export default StakedTokenProps;
