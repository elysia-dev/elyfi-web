import { BigNumber, constants } from 'ethers';
import {
  GetUser_user_lTokenBurn,
  GetUser_user_lTokenMint,
} from 'src/queries/__generated__/GetUser';
import { RAY } from './math';

const calcAccumulatedYield = (
  balance: BigNumber,
  currentIndex: BigNumber,
  mints: GetUser_user_lTokenMint[],
  burns: GetUser_user_lTokenBurn[],
): BigNumber => {
  let index = currentIndex;

  if (balance.isZero() && mints.length > 0 && burns.length > 0) {
    const lastBurnIndex = burns[burns.length - 1].index;
    const lastMintIndex = mints[mints.length - 1].index;
    index = BigNumber.from(
      lastBurnIndex > lastMintIndex ? lastBurnIndex : lastMintIndex,
    );
  }

  const mintYield = mints
    .reduce(
      (res, cur) =>
        res.add(
          BigNumber.from(cur.amount).mul(index.sub(BigNumber.from(cur.index))),
        ),
      constants.Zero,
    )
    .div(RAY);

  const burnYield = burns
    .reduce(
      (res, cur) =>
        res.add(
          BigNumber.from(cur.amount).mul(index.sub(BigNumber.from(cur.index))),
        ),
      constants.Zero,
    )
    .div(RAY);

  return mintYield.sub(burnYield);
};

export default calcAccumulatedYield;
