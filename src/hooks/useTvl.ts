import { BigNumber, constants, providers } from 'ethers';
import { formatUnits, formatEther } from 'ethers/lib/utils';
import { useContext, useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';
import envs from 'src/core/envs';
import { ERC20__factory } from '@elysia-dev/contract-typechain';
import ReserveData from 'src/core/data/reserves';
import SubgraphContext from 'src/contexts/SubgraphContext';
import { poolDataFetcher } from 'src/clients/CachedUniswapV3';
import poolDataMiddleware from 'src/middleware/poolDataMiddleware';
import { pricesFetcher } from 'src/clients/Coingecko';
import priceMiddleware from 'src/middleware/priceMiddleware';

const useTvl = (): { value: number; loading: boolean } => {
  const { data, loading: reserveLoading } = useContext(SubgraphContext);
  const [loading, setLoading] = useState(true);
  const { data: poolData } = useSWR(
    envs.externalApiEndpoint.cachedUniswapV3URL,
    poolDataFetcher,
    {
      use: [poolDataMiddleware],
    },
  );
  const { data: priceData } = useSWR(
    envs.externalApiEndpoint.coingackoURL,
    pricesFetcher,
    {
      use: [priceMiddleware],
    },
  );

  const [state, setState] = useState({
    stakedEl: constants.Zero,
    stakedElfi: constants.Zero,
    loading: true,
  });

  const tvl = useMemo(() => {
    if (!poolData || !priceData) return 0;
    return (
      data.reserves.reduce((res, cur) => {
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
      poolData.ethPool.totalValueLockedToken0 * priceData.elfiPrice +
      poolData.ethPool.totalValueLockedToken1 * priceData.ethPrice +
      poolData.daiPool.totalValueLockedToken0 * priceData.elfiPrice +
      poolData.daiPool.totalValueLockedToken1 * priceData.daiPrice +
      parseInt(formatEther(state.stakedEl), 10) * priceData.elPrice +
      parseInt(formatEther(state.stakedElfi), 10) * priceData.elfiPrice
    );
  }, [state, priceData, loading, poolData]);

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
    if (reserveLoading) return;
    loadBalances().then(() => {
      setLoading(false);
    });
  }, [reserveLoading]);

  return {
    value: tvl,
    loading: state.loading,
  };
};

export default useTvl;
