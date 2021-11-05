import { useContext, useMemo } from 'react';
import { utils, BigNumber } from 'ethers';
import PriceContext from 'src/contexts/PriceContext';
import Token from 'src/enums/Token';
import { toCompact } from 'src/utiles/formatters';

const ELFI_AMOUNT_PER_POOL = 300000;
const DAI_AMOUNT_PER_POOL = 25000;
const ETH_AMOUNT_PER_POOL = 5; // FIXME
const DAYS = 40;

// 풀의 유동성 : liquidity * sqrtPrice ^2
// Input: stakedToken(-> rewardToken)
const useLpApr = (
  stakedToken: Token.ELFI_DAI_LP | Token.ELFI_ETH_LP,
  stakedLiquidity: BigNumber,
): string => {
  const { elfiDaiPool, elfiEthPool, ethPrice, elfiPrice } =
    useContext(PriceContext);

  const apr = useMemo(() => {
    if (stakedLiquidity.isZero()) return '-';

    if (stakedToken === Token.ELFI_DAI_LP) {
      return toCompact(
        (((ELFI_AMOUNT_PER_POOL * elfiPrice + DAI_AMOUNT_PER_POOL) * 365) /
          DAYS /
          (parseFloat(utils.formatEther(stakedLiquidity)) *
            elfiDaiPool.price)) *
          100,
      );
    } else {
      return toCompact(
        (((ELFI_AMOUNT_PER_POOL * elfiPrice + ETH_AMOUNT_PER_POOL * ethPrice) *
          365) /
          DAYS /
          (parseFloat(utils.formatEther(stakedLiquidity)) *
            elfiEthPool.price)) *
          100,
      );
    }
  }, []);

  return apr;
};

export default useLpApr;
