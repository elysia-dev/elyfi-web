import { useContext } from 'react';
import PriceContext from 'src/contexts/PriceContext';
import { toCompact } from 'src/utiles/formatters';

const ELFI_AMOUNT_PER_POOL = 300000;
const DAI_AMOUNT_PER_POOL = 25000;
const ETH_AMOUNT_PER_POOL = 6.437; // FIXME
const DAYS = 40;

const useLpApr = (): {
  calcDaiElfiPoolApr: (totalValue: number) => string;
  calcEthElfiPoolApr: (totalValue: number) => string;
} => {
  const { daiPrice, ethPrice, elfiPrice } = useContext(PriceContext);

  // Token0 is ELFI
  // Token1 is ETHa

  const apy = (stakedValue: number, totalReward: number) => {
    if (stakedValue === 0) return '-';

    return toCompact(((totalReward * 365) / DAYS / stakedValue) * 100);
  };
  const calcDaiElfiPoolApr = (totalValue: number) => {
    return apy(
      totalValue,
      ELFI_AMOUNT_PER_POOL * elfiPrice + DAI_AMOUNT_PER_POOL * daiPrice,
    );
  };
  const calcEthElfiPoolApr = (totalValue: number) => {
    return apy(
      totalValue,
      ELFI_AMOUNT_PER_POOL * elfiPrice + ETH_AMOUNT_PER_POOL * ethPrice,
    );
  };

  return { calcDaiElfiPoolApr, calcEthElfiPoolApr };
};

export default useLpApr;
