import { useCallback, useContext, useMemo } from 'react';
import PriceContext from 'src/contexts/PriceContext';
import { toCompact } from 'src/utiles/formatters';
import UniswapPoolContext from 'src/contexts/UniswapPoolContext';

const ELFI_AMOUNT_PER_POOL = 300000;
const DAI_AMOUNT_PER_POOL = 25000;
const ETH_AMOUNT_PER_POOL = 5.507; // FIXME
const DAYS = 40;

const useLpApr = () => {
  const { daiPrice, ethPrice } = useContext(PriceContext);
  const { latestPrice: elfiPrice } = useContext(UniswapPoolContext);

  // Token0 is ELFI
  // Token1 is ETH

  const apy = (stakedValue: number, totalReward: number) => {
    if (stakedValue === 0) return '-';

    return toCompact(((totalReward * 365) / DAYS / stakedValue) * 100);
  };
  const calcDaiElfiPoolApr = (liquidity: number) => {
    return apy(
      liquidity,
      ELFI_AMOUNT_PER_POOL * elfiPrice + DAI_AMOUNT_PER_POOL * daiPrice,
    );
  };
  const calcEthElfiPoolApr = (liquidity: number) => {
    return apy(
      liquidity,
      ELFI_AMOUNT_PER_POOL * elfiPrice + ETH_AMOUNT_PER_POOL * ethPrice,
    );
  };

  return { calcDaiElfiPoolApr, calcEthElfiPoolApr };
};

export default useLpApr;
