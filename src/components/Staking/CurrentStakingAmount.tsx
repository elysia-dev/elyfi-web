import { BigNumber, constants } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import Skeleton from 'react-loading-skeleton';

const CurrentStakingAmount: React.FC<{
  tokenUsdPrice: number;
  isLoading: boolean;
  roundData: BigNumber;
}> = ({ tokenUsdPrice, isLoading, roundData }): JSX.Element => {
  return isLoading ? (
    <Skeleton width={30} height={20} />
  ) : roundData.isZero() ? (
    <span>0</span>
  ) : (
    <span>
      {(
        parseFloat(formatEther(roundData || constants.Zero)) * tokenUsdPrice
      ).toFixed(6)}
    </span>
  );
};

export default CurrentStakingAmount;
