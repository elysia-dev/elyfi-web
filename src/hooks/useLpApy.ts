import { pricesFetcher } from 'src/clients/Coingecko';
import useSWR from 'swr';
import envs from 'src/core/envs';
import priceMiddleware from 'src/middleware/priceMiddleware';
import { toCompact } from 'src/utiles/formatters';

const ELFI_AMOUNT_PER_POOL = 300000;
const DAI_AMOUNT_PER_POOL = 25000;
const ETH_AMOUNT_PER_POOL = 6.437; // FIXME
const DAYS = 40;

const useLpApr = (): {
  calcDaiElfiPoolApr: (totalValue: number) => string;
  calcEthElfiPoolApr: (totalValue: number) => string;
} => {
  const { data: priceData } = useSWR(
    envs.externalApiEndpoint.coingackoURL,
    pricesFetcher,
    {
      use: [priceMiddleware],
    },
  );

  // Token0 is ELFI
  // Token1 is ETHa

  const apy = (stakedValue: number, totalReward: number) => {
    if (stakedValue === 0) return '-';

    return toCompact(((totalReward * 365) / DAYS / stakedValue) * 100);
  };
  const calcDaiElfiPoolApr = (totalValue: number) => {
    if (!priceData) return '-';
    return apy(
      totalValue,
      ELFI_AMOUNT_PER_POOL * priceData.elfiPrice +
        DAI_AMOUNT_PER_POOL * priceData.daiPrice,
    );
  };
  const calcEthElfiPoolApr = (totalValue: number) => {
    if (!priceData) return '-';
    return apy(
      totalValue,
      ELFI_AMOUNT_PER_POOL * priceData.elfiPrice +
        ETH_AMOUNT_PER_POOL * priceData.ethPrice,
    );
  };

  return { calcDaiElfiPoolApr, calcEthElfiPoolApr };
};

export default useLpApr;
