import { useContext, useMemo } from 'react';
import PriceContext from 'src/contexts/PriceContext';
import { toCompact } from 'src/utiles/formatters';
import UniswapPoolContext from 'src/contexts/UniswapPoolContext';

const ELFI_AMOUNT_PER_POOL = 300000;
const DAI_AMOUNT_PER_POOL = 25000;
const ETH_AMOUNT_PER_POOL = 5.507; // FIXME
const DAYS = 40;

const useLpApr = (stakedValue: number, totalReward: number): string => {
  const apy = useMemo(() => {
    if (stakedValue === 0) return '-';

    return toCompact(((totalReward * 365) / DAYS / stakedValue) * 100);
  }, [stakedValue, totalReward]);

  return apy;
};

export const useDaiPositionLpApr = (): string => {
  const { latestPrice: elfiPrice, daiPool } = useContext(UniswapPoolContext);

  // Token0 is ELFI
  // Token1 is DAI
  return useLpApr(
    daiPool.stakedToken0 * elfiPrice + daiPool.stakedToken1,
    ELFI_AMOUNT_PER_POOL * elfiPrice + DAI_AMOUNT_PER_POOL,
  );
};

export const useEthPositionLpApr = (): string => {
  const { ethPrice } = useContext(PriceContext);
  const { latestPrice: elfiPrice, ethPool } = useContext(UniswapPoolContext);

  // console.log(ethPrice)

  // Token0 is ELFI
  // Token1 is ETH
  return useLpApr(
    ethPool.stakedToken0 * elfiPrice + ethPool.stakedToken1 * ethPrice,
    ELFI_AMOUNT_PER_POOL * elfiPrice + ETH_AMOUNT_PER_POOL * ethPrice,
  );
};

export default useLpApr;
