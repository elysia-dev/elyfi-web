import { BigNumber } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import moment from 'moment';
import {
  Dispatch,
  FunctionComponent,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import CountUp from 'react-countup';
import PriceContext from 'src/contexts/PriceContext';
import {
  daiMoneyPoolTime,
  tetherMoneyPoolTime,
} from 'src/core/data/moneypoolTimes';
import DepositBalance from 'src/core/types/DepositBalance';
import Token from 'src/enums/Token';
import useTvl from 'src/hooks/useTvl';
import { GetAllReserves_reserves } from 'src/queries/__generated__/GetAllReserves';
import calcExpectedIncentive from 'src/utiles/calcExpectedIncentive';
import calcMiningAPR from 'src/utiles/calcMiningAPR';
import { formatSixFracionDigit } from 'src/utiles/formatters';

const RewardCountUp: FunctionComponent<{
  balance: DepositBalance;
  reserveData: GetAllReserves_reserves;
  round: number;
  setBalances: Dispatch<SetStateAction<DepositBalance[]>>;
}> = ({ balance, reserveData, round, setBalances }) => {
  const { value: tvl } = useTvl();
  const { elfiPrice } = useContext(PriceContext);
  const [incentive, setIncentive] = useState({
    beforeIncentive: balance.incentive[round],
    afterIncentive: balance.incentive[round],
  });

  const isEndedIncentive = (token: string, round: number) => {
    const moneyPoolTime =
      token === Token.DAI ? daiMoneyPoolTime : tetherMoneyPoolTime;

    return round === 1
      ? !moment().isAfter(moneyPoolTime[round].startedAt)
      : moment().isAfter(moneyPoolTime[round].endedAt);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const calcIncentive = isEndedIncentive(balance.tokenName, round)
        ? balance.incentive[round]
        : balance.incentive[round].add(
            calcExpectedIncentive(
              elfiPrice,
              balance.deposit,
              calcMiningAPR(
                elfiPrice,
                BigNumber.from(reserveData.totalDeposit),
              ),
              balance.updatedAt,
            ),
          );
      setIncentive({
        ...incentive,
        beforeIncentive: incentive.afterIncentive,
        afterIncentive: calcIncentive,
      });

      const incentiveInfo = [incentive.afterIncentive, calcIncentive];
      setBalances((balances) => {
        return balances.map((item) => {
          return balance.tokenName === Token.DAI
            ? {
                ...item,
                daiIncentiveRound1:
                  round === 0 ? incentiveInfo : item.daiIncentiveRound1,
                daiIncentiveRound2:
                  round === 1 ? incentiveInfo : item.daiIncentiveRound2,
              }
            : {
                ...item,
                usdtIncentiveRound1:
                  round === 0 ? incentiveInfo : item.usdtIncentiveRound1,
                usdtIncentiveRound2:
                  round === 1 ? incentiveInfo : item.usdtIncentiveRound2,
              };
        });
      });
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [tvl, incentive, setBalances]);

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
