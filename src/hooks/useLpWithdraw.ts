import { useWeb3React } from '@web3-react/core';
import { ContractTransaction, ethers } from 'ethers';
import envs from 'src/core/envs';
import stakerABI from 'src/core/abi/StakerABI.json';
import { useContext } from 'react';
import TxContext from 'src/contexts/TxContext';
import RecentActivityType from 'src/enums/RecentActivityType';
import { lpTokenValues } from 'src/utiles/lpTokenValues';
import useTxTracking from './useTxTracking';

const useLpWithdraw: () => (
  poolAddress: string,
  rewardTokenAddress: string,
  tokenId: string,
) => void = () => {
  const { account, library } = useWeb3React();
  const { setTransaction } = useContext(TxContext);
  const initTxTracker = useTxTracking();
  const iFace = new ethers.utils.Interface(stakerABI);

  const unstake = async (
    poolAddress: string,
    rewardTokenAddress: string,
    tokenId: string,
  ) => {
    try {
      const staker = new ethers.Contract(
        envs.stakerAddress,
        stakerABI,
        library.getSigner(),
      );
      const elfiUnstake = iFace.encodeFunctionData('unstakeToken', [
        lpTokenValues(poolAddress, envs.governanceAddress),
        tokenId,
      ]);
      const rewardUnstake = iFace.encodeFunctionData('unstakeToken', [
        lpTokenValues(poolAddress, rewardTokenAddress),
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
    } catch (error: any) {
      alert(error.message);
    }
  };
  return unstake;
};

export default useLpWithdraw;
