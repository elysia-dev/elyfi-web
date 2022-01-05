import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import envs from 'src/core/envs';
import stakerABI from 'src/core/abi/StakerABI.json';
import positionABI from 'src/core/abi/NonfungiblePositionManager.json';
import { useContext } from 'react';
import TxContext from 'src/contexts/TxContext';
import RecentActivityType from 'src/enums/RecentActivityType';
import { lpTokenValues } from 'src/utiles/lpTokenValues';
import buildEventEmitter from 'src/utiles/buildEventEmitter';

const useLpMigration: () => (
  poolAddress: string,
  rewardTokenAddress: string,
  tokenId: string,
  round: number,
) => void = () => {
  const { account, library } = useWeb3React();
  const { setTransaction } = useContext(TxContext);
  const staker = new ethers.Contract(
    envs.stakerAddress,
    stakerABI,
    library.getSigner(),
  );
  const iFace = new ethers.utils.Interface(stakerABI);

  const migration = async (
    poolAddress: string,
    rewardTokenAddress: string,
    tokenId: string,
    round: number,
  ) => {
    try {
      const elfiUnstake = iFace.encodeFunctionData('unstakeToken', [
        lpTokenValues(poolAddress, envs.governanceAddress, round - 1),
        tokenId,
      ]);
      const rewardUnstake = iFace.encodeFunctionData('unstakeToken', [
        lpTokenValues(poolAddress, rewardTokenAddress, round - 1),
        tokenId,
      ]);

      const stakeGovernance = iFace.encodeFunctionData('stakeToken', [
        lpTokenValues(poolAddress, envs.governanceAddress, round),
        tokenId,
      ]);

      const stakeToken = iFace.encodeFunctionData('stakeToken', [
        lpTokenValues(poolAddress, rewardTokenAddress, round),
        tokenId,
      ]);

      const res = await staker.multicall([
        elfiUnstake,
        rewardUnstake,
        stakeGovernance,
        stakeToken,
      ]);
      const emitter = buildEventEmitter('LpMigration', 'migration', ``);
      setTransaction(
        res,
        emitter,
        'LPMigration' as RecentActivityType,
        () => {},
        () => {},
      );
    } catch (error) {
      console.error(error);
      // throw Error(error);
    }
  };
  return migration;
};

export default useLpMigration;
