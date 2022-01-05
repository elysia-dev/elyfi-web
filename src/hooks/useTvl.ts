import { BigNumber, constants, providers } from 'ethers';
import { formatUnits, formatEther } from 'ethers/lib/utils';
import { useContext, useEffect, useMemo, useState } from 'react';
import PriceContext from 'src/contexts/PriceContext';
import ReservesContext from 'src/contexts/ReservesContext';
import UniswapPoolContext from 'src/contexts/UniswapPoolContext';
import envs from 'src/core/envs';
import { ERC20__factory } from '@elysia-dev/contract-typechain';
import ReserveData from 'src/core/data/reserves';

const useTvl = (): { value: number; loading: boolean } => {
  const { reserves1st, reserves2nd, round } = useContext(ReservesContext);
  const reserves = round === 1 ? reserves1st : reserves2nd;
  const {
    totalValueLockedToken0,
    totalValueLockedToken1,
    latestPrice: elfiPrice,
  } = useContext(UniswapPoolContext);
  const { elPrice } = useContext(PriceContext);

  const [state, setState] = useState({
    stakedEl: constants.Zero,
    stakedElfi: constants.Zero,
    loading: true,
  });

  const tvl = useMemo(() => {
    const round1 =
      reserves1st.reduce((res, cur) => {
        const tokenInfo = ReserveData.find((datum) => datum.address === cur.id);
        return (
          res +
          parseFloat(
            formatUnits(BigNumber.from(cur.totalDeposit), tokenInfo?.decimals),
          )
        );
      }, 0) +
      totalValueLockedToken0 * elfiPrice +
      totalValueLockedToken1 +
      parseInt(formatEther(state.stakedEl), 10) * elPrice +
      parseInt(formatEther(state.stakedElfi), 10) * elfiPrice;

    const round2 = reserves2nd.reduce((res, cur) => {
      const tokenInfo = ReserveData.find((datum) => datum.address === cur.id);
      return (
        res +
        parseFloat(
          formatUnits(BigNumber.from(cur.totalDeposit), tokenInfo?.decimals),
        )
      );
    }, 0);

    return round1 + round2;
  }, [
    state,
    reserves,
    elPrice,
    elfiPrice,
    totalValueLockedToken0,
    totalValueLockedToken1,
  ]);

  const loadBalances = async () => {
    try {
      const provider = new providers.JsonRpcProvider(
        process.env.REACT_APP_JSON_RPC,
      );

      const stakedElfiOnV1 = await ERC20__factory.connect(
        envs.governanceAddress,
        provider as any,
      ).balanceOf(envs.elfyStakingPoolAddress);

      const stakedElfiOnV2 = await ERC20__factory.connect(
        envs.governanceAddress,
        provider as any,
      ).balanceOf(envs.elfyV2StakingPoolAddress);

      setState({
        stakedEl: await ERC20__factory.connect(
          envs.elAddress,
          provider as any,
        ).balanceOf(envs.elStakingPoolAddress),
        stakedElfi: stakedElfiOnV1.add(stakedElfiOnV2),
        loading: false,
      });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    loadBalances();
  }, []);

  return {
    value: tvl,
    loading: state.loading,
  };
};

export default useTvl;
