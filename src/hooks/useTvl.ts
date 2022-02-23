import { BigNumber, constants, providers } from 'ethers';
import { formatUnits, formatEther } from 'ethers/lib/utils';
import { useContext, useEffect, useMemo, useState } from 'react';
import PriceContext from 'src/contexts/PriceContext';
import UniswapPoolContext from 'src/contexts/UniswapPoolContext';
import envs from 'src/core/envs';
import { ERC20__factory } from '@elysia-dev/contract-typechain';
import ReserveData from 'src/core/data/reserves';
import SubgraphContext, {
  initialReserveSubgraph,
  IReserveSubgraph,
} from 'src/contexts/SubgraphContext';
import { ReserveSubgraph } from 'src/clients/ReserveSubgraph';

const useTvl = (): { value: number; loading: boolean } => {
  const subgraphContext = useContext(SubgraphContext);
  const [loading, setLoading] = useState(true);
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
    return (
      subgraphContext.data.reserves.reduce((res, cur) => {
        const tokenInfo = ReserveData.find((datum) => datum.address === cur.id);
        return (
          res +
          parseFloat(
            formatUnits(
              BigNumber.from(loading ? 0 : cur.totalDeposit),
              tokenInfo?.decimals,
            ),
          )
        );
      }, 0) +
      totalValueLockedToken0 * elfiPrice +
      totalValueLockedToken1 +
      parseInt(formatEther(state.stakedEl), 10) * elPrice +
      parseInt(formatEther(state.stakedElfi), 10) * elfiPrice
    );
  }, [
    state,
    elPrice,
    elfiPrice,
    loading,
    totalValueLockedToken0,
    totalValueLockedToken1,
  ]);

  const loadBalances = async () => {
    try {
      const provider = new providers.JsonRpcProvider(
        process.env.REACT_APP_JSON_RPC,
      );

      const stakedElfiOnV1 = await ERC20__factory.connect(
        envs.token.governanceAddress,
        provider as any,
      ).balanceOf(envs.staking.elfyStakingPoolAddress);

      const stakedElfiOnV2 = await ERC20__factory.connect(
        envs.token.governanceAddress,
        provider as any,
      ).balanceOf(envs.staking.elfyV2StakingPoolAddress);

      setState({
        stakedEl: await ERC20__factory.connect(
          envs.token.elAddress,
          provider as any,
        ).balanceOf(envs.staking.elStakingPoolAddress),
        stakedElfi: stakedElfiOnV1.add(stakedElfiOnV2),
        loading: false,
      });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    loadBalances().then(() => {
      setLoading(false);
    });
  }, []);

  return {
    value: tvl,
    loading: state.loading,
  };
};

export default useTvl;
