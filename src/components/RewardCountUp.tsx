import { formatEther } from 'ethers/lib/utils';
import { Dispatch, FunctionComponent, SetStateAction } from 'react';
import CountUp from 'react-countup';
import { IReserveSubgraphData } from 'src/contexts/SubgraphContext';
import { BalanceType } from 'src/hooks/useBalances';
import { formatSixFracionDigit } from 'src/utiles/formatters';

const RewardCountUp: FunctionComponent<{
  balance: BalanceType;
  reserveData: IReserveSubgraphData;
  round: number;
  setBalances: Dispatch<SetStateAction<BalanceType[]>>;
}> = ({ balance, reserveData, round, setBalances }) => {
  return (
    <>
      <CountUp
        className="bold amounts"
        start={parseFloat(
          formatEther(
            round === 0
              ? balance.expectedIncentiveBefore
              : balance.expectedAdditionalIncentiveBefore,
          ),
        )}
        end={parseFloat(
          formatEther(
            round === 0
              ? balance.expectedIncentiveAfter
              : balance.expectedAdditionalIncentiveAfter,
          ),
        )}
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
