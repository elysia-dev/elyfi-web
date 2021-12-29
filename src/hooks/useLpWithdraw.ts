import { ContractTransaction, ethers } from 'ethers';
import envs from 'src/core/envs';
import stakerABI from 'src/core/abi/StakerABI.json';
import { useContext } from 'react';
import TxContext from 'src/contexts/TxContext';
import RecentActivityType from 'src/enums/RecentActivityType';
import { lpTokenValues } from 'src/utiles/lpTokenValues';
import { Web3Context } from 'src/providers/Web3Provider';
import useTxTracking from './useTxTracking';

const useLpWithdraw: () => (
  poolAddress: string,
  rewardTokenAddress: string,
  tokenId: string,
  round: number,
) => void = () => {
  const { account, provider } = useContext(Web3Context);
  const { setTransaction } = useContext(TxContext);
  const initTxTracker = useTxTracking();
  const iFace = new ethers.utils.Interface(stakerABI);

  const unstake = async (
    poolAddress: string,
    rewardTokenAddress: string,
    tokenId: string,
    round: number,
  ) => {
    try {
      const staker = new ethers.Contract(
        envs.stakerAddress,
        stakerABI,
        provider?.getSigner(),
      );
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
    } catch (error: any) {
      throw new Error(`${error.message}`);
    }
  };
  return unstake;
};

export default useLpWithdraw;
