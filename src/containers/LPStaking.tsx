import { ERC20__factory } from '@elysia-dev/contract-typechain';
import { useWeb3React } from '@web3-react/core';
import { BigNumber, constants, ethers, utils } from 'ethers';
import { useEffect, useContext, useState } from 'react';
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

function LPStaking() {
  const { account, library } = useWeb3React();
  const { t } = useTranslation();
  const { ethPrice, daiPrice, elfiPrice } = useContext(PriceContext);
  const [positions, setPositions] = useState<Position[]>([]);
  const [lpTokens, setLpTokens] = useState<TokenInfo[]>([]);
  const [state, setState] = useState({
    ethBalanceOfEthPool: 0,
    elfiBalanceOfEthPool: 0,
    daiBalanceOfDaiPool: 0,
    elfiBalanceOfDaiPool: 0,
  });
  useEffect(() => {
    (async () => {
      setState({
        ethBalanceOfEthPool: parseFloat(
          utils.formatEther(
            await ERC20__factory.connect(envs.wEth, library).balanceOf(
              envs.ethElfiPoolAddress,
            ),
          ),
        ),
        elfiBalanceOfEthPool: parseFloat(
          utils.formatEther(
            await ERC20__factory.connect(
              envs.governanceAddress,
              library,
            ).balanceOf(envs.ethElfiPoolAddress),
          ),
        ),
        daiBalanceOfDaiPool: parseFloat(
          utils.formatEther(
            await ERC20__factory.connect(envs.daiAddress, library).balanceOf(
              envs.daiElfiPoolAddress,
            ),
          ),
        ),
        elfiBalanceOfDaiPool: parseFloat(
          utils.formatEther(
            await ERC20__factory.connect(
              envs.governanceAddress,
              library,
            ).balanceOf(envs.daiElfiPoolAddress),
          ),
        ),
      });
    })();
  }, []);

  useEffect(() => {
    StakerSubgraph.getPositionsByOwner(account!).then((res) => {
      setPositions(res.data.data.positions);
    });
  }, [account]);

  useEffect(() => {
    LpTokenPoolSubgraph.getPositionsByOwner(account!).then((res) => {
      setLpTokens(res.data.data.positions);
    });
  }, []);

  return (
    <>
      <Header
        title={t('staking.token_staking', {
          stakedToken: 'LP 토큰',
        }).toUpperCase()}
      />
      <section className="staking">
        <div className="staking_detail_box">
          <div>
            <LpStakingTitle firstToken={'ELFI'} secondToken={'ETH'} />
            <LpStakingItem
              firstToken={'ELFI'}
              secondToken={'ETH'}
              totalLiquidity={
                state.ethBalanceOfEthPool * ethPrice +
                state.elfiBalanceOfEthPool * elfiPrice
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
            />
          </div>
          <div />
          <div>
            <LpStakingTitle firstToken={'ELFI'} secondToken={'DAI'} />
            <LpStakingItem
              firstToken={'ELFI'}
              secondToken={'DAI'}
              totalLiquidity={
                state.daiBalanceOfDaiPool * daiPrice +
                state.elfiBalanceOfDaiPool * elfiPrice
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
            />
          </div>
        </div>
        <StakedLp positions={positions.filter((position) => position.staked)} />
        <LpReward />
      </section>
    </>
  );
}

export default LPStaking;
