import { useWeb3React } from '@web3-react/core';
import { ContractTransaction, ethers } from 'ethers';
import envs from 'src/core/envs';
import stakerABI from 'src/core/abi/StakerABI.json';
import positionABI from 'src/core/abi/NonfungiblePositionManager.json';
import { useContext } from 'react';
import TxContext from 'src/contexts/TxContext';
import RecentActivityType from 'src/enums/RecentActivityType';
import { lpTokenValues } from 'src/utiles/lpTokenValues';
import useTxTracking from './useTxTracking';

const useLpWithdraw: () => (
  poolAddress: string,
  rewardTokenAddress: string,
  tokenId: string,
  round: number,
) => void = () => {
  const { account, library } = useWeb3React();
  const { setTransaction } = useContext(TxContext);
  const initTxTracker = useTxTracking();
  const staker = new ethers.Contract(
    envs.stakerAddress,
    stakerABI,
    library.getSigner(),
  );
  const iFace = new ethers.utils.Interface(stakerABI);
  const unstake = async (
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
      const withdraw = iFace.encodeFunctionData('withdrawToken', [
        tokenId,
        account,
        '0x',
      ]);

      const res = await staker.multicall([
        elfiUnstake,
        rewardUnstake,
        withdraw,
      ]);
      const tracker = initTxTracker('LpUnstaking', 'unstaking', ``);
      setTransaction(
        res,
        tracker,
        'Withdraw' as RecentActivityType,
        () => {},
        () => {},
      );
    } catch (error) {
      console.error(error);
      // throw Error(error);
    }
  };
  return unstake;
};

export default useLpWithdraw;
