import { BigNumber } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import { useMemo } from 'react';
import Skeleton from 'react-loading-skeleton';
import CountUp from 'react-countup';
import { useWeb3React } from '@web3-react/core';
import { formatSixFracionDigit } from 'src/utiles/formatters';

const useCurrentRewardAmount = (
  tokenUsdPrice: number,
  isLoading: boolean,
  isError: boolean,
  roundData: BigNumber,
  rewardBefore: BigNumber,
  rewardValue: BigNumber,
): {
  currentRewardTokenAmount: string | JSX.Element;
} => {
  const { account } = useWeb3React();
  const currentRewardTokenAmount = useMemo(() => {
    return isLoading ? (
      <Skeleton width={30} height={20} />
    ) : rewardBefore.isZero() || !account ? (
      '-'
    ) : (
      <CountUp
        start={parseFloat(formatEther(rewardBefore)) * tokenUsdPrice}
        end={
          parseFloat(
            formatEther(rewardBefore.isZero() ? roundData : rewardValue),
          ) * tokenUsdPrice
        }
        formattingFn={(number) => {
          return formatSixFracionDigit(number);
        }}
        decimals={6}
        duration={1}
      />
    );
  }, [tokenUsdPrice, isLoading, isError, roundData, rewardBefore, rewardValue]);

  return { currentRewardTokenAmount };
};

export default useCurrentRewardAmount;
