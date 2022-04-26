import { BigNumber, constants } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import { useMemo } from 'react';
import Skeleton from 'react-loading-skeleton';

const useCurrentStakingAmount = (
  tokenUsdPrice: number,
  isLoading: boolean,
  isError: boolean,
  roundData: BigNumber,
): {
  currentStakingTokenAmount: string | JSX.Element;
} => {
  const currentStakingTokenAmount = useMemo(() => {
    return isLoading ? (
      <Skeleton width={30} height={20} />
    ) : isError ? (
      '-'
    ) : roundData.isZero() ? (
      '0'
    ) : (
      (
        parseFloat(formatEther(roundData || constants.Zero)) * tokenUsdPrice
      ).toFixed(6)
    );
  }, [tokenUsdPrice, isLoading, isError, roundData]);

  return { currentStakingTokenAmount };
};

export default useCurrentStakingAmount;
