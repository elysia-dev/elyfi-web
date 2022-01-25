import { formatEther } from 'ethers/lib/utils';
import { Dispatch, FunctionComponent, SetStateAction } from 'react';
import CountUp from 'react-countup';
import { IReserveSubgraphData } from 'src/contexts/SubgraphContext';
import { BalanceType } from 'src/hooks/useBalances';
import useDepositRewardCount from 'src/hooks/useDepositRewardCount';
import { formatSixFracionDigit } from 'src/utiles/formatters';

const RewardCountUp: FunctionComponent<{
  balance: BalanceType;
  reserveData: IReserveSubgraphData;
  round: number;
  setBalances: Dispatch<SetStateAction<BalanceType[]>>;
}> = ({ balance, reserveData, round, setBalances }) => {
  const incentive = useDepositRewardCount(
    balance,
    reserveData,
    round,
    setBalances,
  );

  return (
    <>
      <CountUp
        className="bold amounts"
        start={parseFloat(formatEther(incentive.beforeIncentive))}
        end={parseFloat(formatEther(incentive.afterIncentive))}
        formattingFn={(number) => {
          return formatSixFracionDigit(number);
        }}
        decimals={6}
        duration={1}
      />
    </>
  );
};

export default RewardCountUp;
