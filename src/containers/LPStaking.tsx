import { ERC20__factory } from '@elysia-dev/contract-typechain';
import { useWeb3React } from '@web3-react/core';
import { BigNumber, constants, ethers, utils } from 'ethers';
import { useEffect, useContext, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Header from 'src/components/Header';
import LpStakingItem from 'src/components/LpStaking';
import PriceContext from 'src/contexts/PriceContext';
import envs from 'src/core/envs';
import LpStakingTitle from 'src/components/LpStaking/LpStakingTitle';
import StakedLp from 'src/components/LpStaking/StakedLp';
import StakerSubgraph from 'src/clients/StakerSubgraph';
import LpReward from 'src/components/LpStaking/LpReward';
import Position, { TokenInfo } from 'src/core/types/Position';
import LpTokenPoolSubgraph from 'src/clients/LpTokenPoolSubgraph';
import Token from 'src/enums/Token';
import TxContext from 'src/contexts/TxContext';
import { useDaiPositionLpApr, useEthPositionLpApr } from 'src/hooks/useLpApy';
import UniswapPoolContext from 'src/contexts/UniswapPoolContext';

function LPStaking() {
  const { account } = useWeb3React();
  const { t } = useTranslation();
  const { elfiPrice } = useContext(PriceContext);
  const { ethPool, daiPool } = useContext(UniswapPoolContext);
  const { ethPrice } = useContext(PriceContext);
  const { txWaiting } = useContext(TxContext);
  const [isLoading, setIsLoading] = useState(false);
  const [positions, setPositions] = useState<Position[]>([]);
  const [lpTokens, setLpTokens] = useState<TokenInfo[]>([]);
  const ethPoolApr = useEthPositionLpApr();
  const daiPoolApr = useDaiPositionLpApr();
  const [totalLiquidity, setTotalLiquidity] = useState<{
    daiElfiPoolTotalLiquidity: number;
    ethElfiPoolTotalLiquidity: number;
    ethElfiliquidityForApr: BigNumber;
    daiElfiliquidityForApr: BigNumber;
  }>({
    daiElfiPoolTotalLiquidity: 0,
    ethElfiPoolTotalLiquidity: 0,
    ethElfiliquidityForApr: constants.Zero,
    daiElfiliquidityForApr: constants.Zero,
  });

  const getPositions = useCallback(() => {
    StakerSubgraph.getPositionsByOwner(account!).then((res) => {
      setPositions(res.data.data.positions);
    });
  }, [positions]);

  const getPoolPositions = useCallback(() => {
    LpTokenPoolSubgraph.getPositionsByOwner(account!).then((res) => {
      setLpTokens(res.data.data.positions);
    });
  }, [lpTokens]);

  const getTotalLiquidity = useCallback(() => {
    setIsLoading(true);
    StakerSubgraph.getStakedPositionsByPoolId(
      envs.ethElfiPoolAddress,
      envs.daiElfiPoolAddress,
    ).then((res) => {
      const daiElfiPoolTotalLiquidity =
        res.data.data.daiIncentive[0]?.incentivePotisions.reduce(
          (sum, current) => sum.add(current.position.liquidity),
          constants.Zero,
        ) || constants.Zero;

      const ethElfiPoolTotalLiquidity =
        res.data.data.wethIncentive[0]?.incentivePotisions.reduce(
          (sum, current) => sum.add(current.position.liquidity),
          constants.Zero,
        ) || constants.Zero;
      setTotalLiquidity({
        ...totalLiquidity,
        daiElfiPoolTotalLiquidity: parseFloat(
          utils.formatEther(daiElfiPoolTotalLiquidity),
        ),
        ethElfiPoolTotalLiquidity: parseFloat(
          utils.formatEther(ethElfiPoolTotalLiquidity),
        ),
        daiElfiliquidityForApr: daiElfiPoolTotalLiquidity,
        ethElfiliquidityForApr: ethElfiPoolTotalLiquidity,
      });
      setIsLoading(false);
    });
  }, [totalLiquidity, isLoading]);

  useEffect(() => {
    if (txWaiting) return;
    getPositions();
  }, [account, txWaiting]);

  useEffect(() => {
    if (txWaiting) return;
    getTotalLiquidity();
  }, [txWaiting]);

  useEffect(() => {
    if (txWaiting) return;
    getPoolPositions();
  }, [txWaiting]);

  return (
    <>
      <Header title={t('lpstaking.lp_token_staking')} />
      <section
        className="staking"
        style={{
          overflowX: 'hidden',
          padding: 3,
        }}>
        <div className="staking_detail_box">
          <div>
            <LpStakingTitle firstToken={Token.ELFI} secondToken={Token.ETH} />
            <LpStakingItem
              firstToken={Token.ELFI}
              secondToken={Token.ETH}
              totalLiquidity={
                ethPool.stakedToken0 * elfiPrice + ethPool.stakedToken1 * ethPrice
              }
              positions={positions.filter(
                (position) =>
                  !position.staked &&
                  position.incentivePotisions.some(
                    (incentivePosition) =>
                      incentivePosition.incentive.pool.toLowerCase() ===
                      envs.ethElfiPoolAddress.toLowerCase(),
                  ),
              )}
              totalStakedLiquidity={positions
                .filter(
                  (position) =>
                    position.staked &&
                    position.incentivePotisions.some(
                      (incentivePosition) =>
                        incentivePosition.incentive.pool.toLowerCase() ===
                        envs.ethElfiPoolAddress.toLowerCase(),
                    ),
                )
                .reduce(
                  (sum, current) => sum.add(current.liquidity),
                  constants.Zero,
                )}
              lpTokens={lpTokens.filter((lpToken) => {
                return (
                  lpToken.pool.id.toLowerCase() ===
                  envs.ethElfiPoolAddress.toLowerCase()
                );
              })}
              apr={ethPoolApr}
              isLoading={isLoading}
            />
          </div>
          <div />
          <div>
            <LpStakingTitle firstToken={Token.ELFI} secondToken={Token.DAI} />
            <LpStakingItem
              firstToken={Token.ELFI}
              secondToken={Token.DAI}
              totalLiquidity={
                daiPool.stakedToken0 * elfiPrice + daiPool.stakedToken1
              }
              positions={positions.filter(
                (position) =>
                  !position.staked &&
                  position.incentivePotisions.some(
                    (incentivePosition) =>
                      incentivePosition.incentive.pool.toLowerCase() ===
                      envs.daiElfiPoolAddress.toLowerCase(),
                  ),
              )}
              totalStakedLiquidity={positions
                .filter(
                  (position) =>
                    position.staked &&
                    position.incentivePotisions.some(
                      (incentivePosition) =>
                        incentivePosition.incentive.pool.toLowerCase() ===
                        envs.daiElfiPoolAddress.toLowerCase(),
                    ),
                )
                .reduce(
                  (sum, current) => sum.add(current.liquidity),
                  constants.Zero,
                )}
              lpTokens={lpTokens.filter((lpToken) => {
                return (
                  lpToken.pool.id.toLowerCase() ===
                  envs.daiElfiPoolAddress.toLowerCase()
                );
              })}
              apr={daiPoolApr}
              isLoading={isLoading}
            />
          </div>
        </div>
        <StakedLp
          positions={positions.filter((position) => position.staked)}
          setPositions={setPositions}
        />
        <LpReward />
      </section>
    </>
  );
}

export default LPStaking;
