import { BigNumber } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import Skeleton from 'react-loading-skeleton';
import CountUp from 'react-countup';
import { useWeb3React } from '@web3-react/core';
import { formatSixFracionDigit } from 'src/utiles/formatters';

const CurrentRewardAmount: React.FC<{
  tokenUsdPrice: number;
  isLoading: boolean;
  roundData: BigNumber;
  rewardBefore: BigNumber;
  rewardValue: BigNumber;
}> = ({
  tokenUsdPrice,
  isLoading,
  roundData,
  rewardBefore,
  rewardValue,
}): JSX.Element => {
  const { account } = useWeb3React();

  return isLoading ? (
    <Skeleton width={30} height={20} />
  ) : rewardBefore.isZero() || !account ? (
    <span>0</span>
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
};

export default CurrentRewardAmount;
