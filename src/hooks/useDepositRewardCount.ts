import { BigNumber, constants } from 'ethers';
import moment from 'moment';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import PriceContext from 'src/contexts/PriceContext';
import { IReserveSubgraphData } from 'src/contexts/SubgraphContext';
import isEndedIncentive from 'src/core/utils/isEndedIncentive';
import Token from 'src/enums/Token';
import { busd3xRewardEvent } from 'src/utiles/busd3xRewardEvent';
import calcExpectedIncentive from 'src/utiles/calcExpectedIncentive';
import calcMiningAPR from 'src/utiles/calcMiningAPR';
import { BalanceType } from './useBalances';
import useTvl from './useTvl';

function useDepositRewardCount(
  balance: BalanceType,
  reserveData: IReserveSubgraphData,
  round: number,
  setBalances: Dispatch<SetStateAction<BalanceType[]>>,
): {
  beforeIncentive: BigNumber;
  afterIncentive: BigNumber;
} {
  const { value: tvl } = useTvl();
  const { elfiPrice } = useContext(PriceContext);
  const [incentive, setIncentive] = useState({
    beforeIncentive: constants.Zero,
    afterIncentive: constants.Zero,
  });

  const calcIncentive = useCallback(
    (reward: BigNumber) => {
      return isEndedIncentive(balance.tokenName, round)
        ? reward
        : reward.add(
            calcExpectedIncentive(
              elfiPrice,
              balance.deposit,
              calcMiningAPR(
                elfiPrice,
                BigNumber.from(reserveData.totalDeposit),
              ).mul(busd3xRewardEvent(balance.tokenName)),
              balance.updatedAt,
            ),
          );
    },
    [balance],
  );

  const afterIncentiveByRound = (item: BalanceType) => {
    return round === 0
      ? item.expectedIncentive[balance.tokenName].afterRound1
      : item.expectedIncentive[balance.tokenName].afterRound2;
  };

  const setEachTokenIncentive = (item: BalanceType) => {
    return {
      beforeRound1: afterIncentiveByRound(item),
      afterRound1: calcIncentive(incentive.afterIncentive),
      beforeRound2: afterIncentiveByRound(item),
      afterRound2: calcIncentive(incentive.afterIncentive),
    };
  };

  useMemo(() => {
    setIncentive({
      beforeIncentive:
        round === 0
          ? balance.expectedIncentive[balance.tokenName].beforeRound1
          : balance.expectedIncentive[balance.tokenName].beforeRound2,
      afterIncentive:
        round === 0
          ? balance.expectedIncentive[balance.tokenName].afterRound1
          : balance.expectedIncentive[balance.tokenName].afterRound2,
    });
  }, [balance]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBalances((items) => {
        return items.map((item) => {
          return {
            ...item,
            expectedIncentive:
              balance.tokenName === Token.DAI
                ? {
                    ...item.expectedIncentive,
                    DAI: setEachTokenIncentive(item),
                  }
                : balance.tokenName === Token.USDT
                ? {
                    ...item.expectedIncentive,
                    USDT: setEachTokenIncentive(item),
                  }
                : {
                    ...item.expectedIncentive,
                    BUSD: setEachTokenIncentive(item),
                  },
            updatedAt: moment().unix(),
          };
        });
      });
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [tvl, incentive, balance]);

  return incentive;
}

export default useDepositRewardCount;
