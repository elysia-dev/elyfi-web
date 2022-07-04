import { IncentivePool__factory } from '@elysia-dev/contract-typechain';
import { BigNumber, constants, ethers, utils } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import envs from 'src/core/envs';

const provider = new ethers.providers.JsonRpcProvider(
  process.env.REACT_APP_JSON_RPC,
);

const useCalcMiningAPR = (): {
  dailyAllocation: number;
  calcMiningAPR: (
    mintPrice: number,
    totalDeposit: BigNumber,
    decimals?: number | undefined,
  ) => BigNumber;
} => {
  const [dailyAllocation, setDailyAllocation] = useState(0);

  useEffect(() => {
    (async () => {
      const incentivePool = IncentivePool__factory.connect(
        envs.incentivePool.currentUSDTIncentivePool,
        provider,
      );
      const amountPerSecond = await incentivePool.amountPerSecond();
      setDailyAllocation(
        parseFloat(utils.formatUnits(amountPerSecond)) * 3600 * 24,
      );
    })();
  }, []);

  const calcMiningAPR = useCallback(
    (
      mintPrice: number,
      totalDeposit: BigNumber,
      decimals?: number,
    ): BigNumber => {
      if (totalDeposit.isZero()) {
        return constants.Zero;
      }

      return utils.parseUnits(
        (
          ((mintPrice * dailyAllocation * 365) /
            parseFloat(utils.formatUnits(totalDeposit, decimals || '18'))) *
          100
        ).toLocaleString('fullwide', { useGrouping: false }),
        25,
      );
    },
    [dailyAllocation],
  );

  return { dailyAllocation, calcMiningAPR };
};

export default useCalcMiningAPR;
